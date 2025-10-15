import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useCategoryStore } from '../store/useCategoryStore';

const { TextArea } = Input;
const { Option } = Select;

import type { TaskModalFormValues, TaskCreateData } from '@/types/task';

interface TaskModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: TaskCreateData) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const { categories, fetchCategories } = useCategoryStore();
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values: TaskModalFormValues) => {
        const formattedValues: TaskCreateData = {
          tugas: values.tugas,
          deskripsi: values.deskripsi,
          prioritas: values.prioritas,
          status: values.status,
          tenggat: dayjs(values.tenggat).startOf('day').toISOString(),
          kategori: values.kategori,
          id_user: 0, // Akan diisi di TaskView
          id_category: 0 // Akan diisi di TaskView
        };
        onSubmit(formattedValues);
        form.resetFields(); // reset setelah submit sukses
      })
      .catch((info) => {
        console.log('Validation Failed:', info);
      });
  };

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Reset form saat modal ditutup
  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);

  return (
    <Modal
      title="Tambah Tugas Baru"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Simpan"
      cancelText="Batal"
    >
      <Form
        form={form}
        layout="vertical"
        style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 12, paddingTop: 3 }}
      >
        <Form.Item
          name="tugas"
          label="Tugas"
          rules={[{ required: true, message: 'Tugas wajib diisi' }]}
        >
          <Input placeholder="Judul tugas" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Pilih status' }]}
        >
          <Select placeholder="Pilih status">
            <Option value="todo">Belum</Option>
            <Option value="in_progress">Proses</Option>
            <Option value="done">Selesai</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="prioritas"
          label="Prioritas"
          rules={[{ required: true, message: 'Pilih prioritas' }]}
        >
          <Select placeholder="Pilih prioritas">
            <Option value="low">Rendah</Option>
            <Option value="medium">Sedang</Option>
            <Option value="high">Tinggi</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="tenggat"
          label="Tenggat"
          rules={[{ required: true, message: 'Tenggat wajib diisi', type: 'date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="kategori"
          label="Nama Category"
          rules={[{ required: true, message: 'Pilih setidaknya satu kategori' }]}
        >
          <Select
            
            placeholder="Pilih kategori"
            allowClear
          >
            {categories.map((cat) => (
              <Option key={cat.id_category} value={cat.category}>
                {cat.category}
              </Option>
            ))}
          </Select>
        </Form.Item>
         <Form.Item
          name="deskripsi"
          label="Deskripsi"
          rules={[{ required: true, message: 'Deskripsi wajib diisi' }]}
        >
          <TextArea placeholder="Deskripsikan tugas..." rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskModal;
    