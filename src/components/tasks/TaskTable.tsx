import { useTaskStore } from '@/store/useTaskStore';
import { CheckCircleIcon, ClockIcon, MoreVerticalIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Dropdown, Modal, Space, message, Form, Input, DatePicker, Select, type MenuProps } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

import type { Task, TaskFormData } from '@/types/task';

export function TaskTable() {
  const { tasks, deleteTask, updateTask } = useTaskStore();
  const [form] = Form.useForm<TaskFormData>();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  
  const handleEdit = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    setSelectedTask(taskId);
    form.setFieldsValue({
      ...task,
      tenggat: dayjs(task.tenggat)
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async (values: TaskFormData) => {
    if (!selectedTask) return;

    try {
      const updatedTask = {
        ...values,
        tenggat: dayjs(values.tenggat).startOf('day').toISOString() 
      };

      await updateTask(selectedTask, updatedTask);
      message.success('Tugas berhasil diperbarui');
      setEditModalVisible(false);
      setSelectedTask(null);
      form.resetFields();
    } catch (error) {
      message.error('Gagal memperbarui tugas');
    }
  };

  const handleDelete = async () => {
    if (!selectedTask) return;
    
    try {
      await deleteTask(selectedTask);
      message.success('Tugas berhasil dihapus');
    } catch (error) {
      message.error('Gagal menghapus tugas');
    } finally {
      setDeleteModalVisible(false);
      setSelectedTask(null);
    }
  };

  const getDropdownItems = (taskId: string): MenuProps['items'] => [
    {
      label: (
        <div className='flex gap-3'>
          <EditOutlined/>
          <span>
            Edit
          </span>
        </div>
      ),
      key: '0',
      onClick: () => handleEdit(taskId),
    },
    {
      type: 'divider',
    },
    {
      label: (
        <div className='flex gap-3'>
          <DeleteOutlined/>
          <span>
            Hapus
          </span>
        </div>
      ),
      key: '1',
      danger: true,
      onClick: () => {
        setSelectedTask(taskId);
        setDeleteModalVisible(true);
      },
    },

];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircleIcon size={16} className="text-green-500" />;
      case 'in_progress':
        return <ClockIcon size={16} className="text-yellow-500" />;
      default:
        return <ClockIcon size={16} className="text-gray-500" />;
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedTask(null);
        }}
        okText="Hapus"
        cancelText="Batal"
        okButtonProps={{ danger: true }}
        centered
      >
        <div className="flex items-start space-x-4">
          <ExclamationCircleOutlined className="text-xl mt-1" style={{ color: '#efb100' }}/>
          <div>
            <h3 className="text-base font-medium text-gray-900">Apakah Anda yakin ingin menghapus tugas ini?</h3>
            <p className="text-sm text-gray-500 mt-1">
              Tindakan ini tidak dapat dibatalkan dan akan menghapus tugas secara permanen.
            </p>
          </div>
        </div>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        title="Edit Tugas"
        open={editModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedTask(null);
          form.resetFields();
        }}
        okText="Simpan"
        cancelText="Batal"
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
          className="mt-4"
        >
          <Form.Item
            name="tugas"
            label="Nama Tugas"
            rules={[{ required: true, message: 'Nama tugas harus diisi!' }]}
          >
            <Input placeholder="Masukkan nama tugas" />
          </Form.Item>

          <Form.Item
            name="deskripsi"
            label="Deskripsi"
          >
            <Input.TextArea rows={4} placeholder="Masukkan deskripsi tugas" />
          </Form.Item>

          <Form.Item
            name="tenggat"
            label="Tenggat Waktu"
            rules={[{ required: true, message: 'Tenggat waktu harus diisi!' }]}
          >
            <DatePicker 
              className="w-full" 
              placeholder="Pilih tanggal"
            />
          </Form.Item>

          <Form.Item
            name="prioritas"
            label="Prioritas"
            rules={[{ required: true, message: 'Prioritas harus dipilih!' }]}
          >
            <Select placeholder="Pilih prioritas">
              <Select.Option value="high">Tinggi</Select.Option>
              <Select.Option value="medium">Sedang</Select.Option>
              <Select.Option value="low">Rendah</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Status harus dipilih!' }]}
          >
            <Select placeholder="Pilih status">
              <Select.Option value="todo">Tertunda</Select.Option>
              <Select.Option value="in_progress">Dalam Proses</Select.Option>
              <Select.Option value="done">Selesai</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tugas
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenggat Waktu
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioritas
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task, index) => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    <Link 
                      to={`/tugas/${task.id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {task.tugas}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatDate(task.tenggat)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.prioritas)}`}>
                    {task.prioritas.charAt(0).toUpperCase() + task.prioritas.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-50`}>
                    <span className="mr-1">{getStatusIcon(task.status)}</span>
                    {task.status === 'in_progress' ? 'Dalam Proses' : task.status === 'done' ? 'Selesai' : 'Tertunda'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-500">
                    <Dropdown menu={{ items: getDropdownItems(task.id) }} placement="bottomRight">
                      <a onClick={(e) => e.preventDefault()}>
                        <Space className='cursor-pointer'>
                          <MoreVerticalIcon size={16} />
                        </Space>
                      </a>
                    </Dropdown>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}