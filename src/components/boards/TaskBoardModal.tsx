import { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { useTaskStore } from '@/store/useTaskStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import dayjs from 'dayjs';
import { useEffect } from 'react';

interface TaskBoardModalProps {
  open: boolean;
  onClose: () => void;
  boardId: number;
  onSuccess?: () => void;
}

export default function TaskBoardModal({ open, onClose, boardId, onSuccess }: TaskBoardModalProps) {
  const [form] = Form.useForm();
  const { createTask, loading } = useTaskStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const taskData = {
        tugas: values.tugas,
        deskripsi: values.deskripsi || '',
        status: values.status,
        prioritas: values.prioritas,
        tenggat: values.tenggat.toISOString(),
        id_category: values.id_category,
        id_board: boardId,
      };

      await createTask(taskData);
      message.success('Task berhasil ditambahkan ke board');
      form.resetFields();
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      message.error(error.response?.data?.error || 'Gagal menambahkan task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Tambah Task ke Board"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={submitting || loading}
      okText="Tambah Task"
      cancelText="Batal"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 'todo',
          prioritas: 'medium',
          tenggat: dayjs().add(7, 'day'),
        }}
      >
        <Form.Item
          label="Nama Task"
          name="tugas"
          rules={[
            { required: true, message: 'Nama task harus diisi' },
            { min: 3, message: 'Nama task minimal 3 karakter' },
          ]}
        >
          <Input placeholder="Masukkan nama task" size="large" />
        </Form.Item>

        <Form.Item label="Deskripsi" name="deskripsi">
          <Input.TextArea
            placeholder="Deskripsi task (opsional)"
            rows={3}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Status harus dipilih' }]}
          >
            <Select size="large">
              <Select.Option value="todo">To Do</Select.Option>
              <Select.Option value="in_progress">In Progress</Select.Option>
              <Select.Option value="done">Done</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Prioritas"
            name="prioritas"
            rules={[{ required: true, message: 'Prioritas harus dipilih' }]}
          >
            <Select size="large">
              <Select.Option value="low">
                <span className="text-green-600">● Low</span>
              </Select.Option>
              <Select.Option value="medium">
                <span className="text-yellow-600">● Medium</span>
              </Select.Option>
              <Select.Option value="high">
                <span className="text-red-600">● High</span>
              </Select.Option>
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Kategori"
            name="id_category"
            rules={[{ required: true, message: 'Kategori harus dipilih' }]}
          >
            <Select
              placeholder="Pilih kategori"
              size="large"
              showSearch
              optionFilterProp="children"
            >
              {categories.map((category) => (
                <Select.Option key={category.id_category} value={category.id_category}>
                  {category.category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Deadline"
            name="tenggat"
            rules={[{ required: true, message: 'Deadline harus diisi' }]}
          >
            <DatePicker
              size="large"
              style={{ width: '100%' }}
              format="DD MMM YYYY"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
