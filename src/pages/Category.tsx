import React, { useState, useEffect } from 'react';
import { Table, Tooltip, Modal, Input, Button, Space, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, CheckCircleTwoTone, CloseCircleOutlined } from '@ant-design/icons';
import { useCategoryStore } from '../store/useCategoryStore';
import { useUserStore } from '../store/useUserStore';

interface Category {
  id_category: number;
  category: string;
}

const CategoryPage: React.FC = () => {
  const { categories, fetchCategories, createCategory, updateCategory, deleteCategory, loading, error, success } = useCategoryStore();
  const user = useUserStore((state) => state.user);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [createFormData, setCreateFormData] = useState({ category: '' });
  const [editFormData, setEditFormData] = useState({ category: '' });
  const setSuccess = useCategoryStore((state) => state.setSuccess);
  const setError = useUserStore((state) => state.setError);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (error) {
      const key = 'create_error';
      message.open({
        key,
        type: "error",
        duration: 4,
        icon: <CloseCircleOutlined twoToneColor="#52c41a" style={{ fontSize: "20px" }} />,
        content: (
          <div className="text-lg">
            {error}
          </div>
        ),
      });
      setError(null);
    }
  }, [error]);

  useEffect(() => {
   if (success) {
      const key = 'create_success';
      message.open({
        key,
        type: "success",
        duration: 4,
        icon: <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: "20px" }} />,
        content: (
          <div className="text-lg">
            {success}
          </div>
        ),
      });
      setSuccess(null);
    }
  }, [success]);

  const showCreateModal = () => {
    setCreateFormData({ category: '' });
    setIsCreateModalVisible(true);
  };

  const showEditModal = (record: Category) => {
    setEditingCategory(record);
    setEditFormData({ category: record.category });
    setIsEditModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch {
      // Error handling is managed by the store and useEffect
    }
  };

const handleCreateOk = async () => {
  if (!createFormData.category.trim()) {
    message.error('Category name is required');
    return;
  }

  try {
    if (!user || !user.id_user) {
      message.error('User not logged in');
      return;
    }

    const userId = parseInt(user.id_user, 10); // ⬅️ pastikan integer

    if (isNaN(userId)) {
      message.error('Invalid user ID');
      return;
    }

    await createCategory(createFormData.category, userId);
    await fetchCategories();
    setIsCreateModalVisible(false);
  } catch {
    message.error('Failed to add category');
  }
};


  const handleEditOk = async () => {
    if (!editFormData.category.trim()) {
      message.error('Category name is required');
      return;
    }
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id_category, { category: editFormData.category });
        await fetchCategories();
        setIsEditModalVisible(false);
      }
    } catch {
      message.error('Failed to update category');
    }
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateFormData({ ...createFormData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const columns = [
    {
      title: 'No',
      key: 'no',
      width: '20%',
      render: (_: any, __: Category, index: number) => index + 1,
      sorter: (a: Category, b: Category) => a.id_category - b.id_category,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '60%',
      sorter: (a: Category, b: Category) => a.category.localeCompare(b.category),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      render: (_: any, record: Category) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title={<span>Are you sure you want to delete category <strong>{record.category}</strong>?</span>}
            onConfirm={() => handleDelete(record.id_category)}
            okText="Yes"
            cancelText="Cancel"
            placement="bottomRight"
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Category</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal} loading={loading}>
          Add Category
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id_category"
        pagination={{ pageSize: 5 }}
        loading={loading}
        className="shadow-sm"
      />
      <Modal
        title="Add Category"
        visible={isCreateModalVisible}
        onOk={handleCreateOk}
        onCancel={handleCreateCancel}
        okText="Add"
        confirmLoading={loading}
      >
        <div className="mb-4">
          <label className="block mb-1 font-medium">Category</label>
          <Input
            name="category"
            value={createFormData.category}
            onChange={handleChange}
            placeholder="Enter category name"
          />
        </div>
      </Modal>
      <Modal
        title="Edit Category"
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Update"
        confirmLoading={loading}
      >
        <div className="mb-4">
          <label className="block mb-1 font-medium">Category</label>
          <Input
            name="category"
            value={editFormData.category}
            onChange={handleEditChange}
            placeholder="Enter category name"
          />
        </div>
      </Modal>
    </div>
  );
};

export default CategoryPage;
