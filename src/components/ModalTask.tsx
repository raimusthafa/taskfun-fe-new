import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import type dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

export interface TaskFormValues {
  tugas: string;
  deskripsi: string;
  status: 'todo' | 'in progres' | 'selesai';
  prioritas: 'low' | 'medium' | 'high';
  tenggat: dayjs.Dayjs;
  kategori: string[];
}

interface TaskModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: TaskFormValues) => void;
  categories: string[];
}

const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  categories,
}) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values: TaskFormValues) => {
        onSubmit(values);
        form.resetFields(); // reset setelah submit sukses
      })
      .catch((info) => {
        console.log('Validation Failed:', info);
      });
  };

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
        style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 12 }}
      >
        <Form.Item
          name="tugas"
          label="Tugas"
          rules={[{ required: true, message: 'Tugas wajib diisi' }]}
        >
          <Input placeholder="Judul tugas" />
        </Form.Item>

        <Form.Item
          name="deskripsi"
          label="Deskripsi"
          rules={[{ required: true, message: 'Deskripsi wajib diisi' }]}
        >
          <TextArea placeholder="Deskripsikan tugas..." rows={4} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Pilih status' }]}
        >
          <Select placeholder="Pilih status">
            <Option value="todo">Todo</Option>
            <Option value="in progres">In Progress</Option>
            <Option value="selesai">Selesai</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="prioritas"
          label="Prioritas"
          rules={[{ required: true, message: 'Pilih prioritas' }]}
        >
          <Select placeholder="Pilih prioritas">
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="tenggat"
          label="Tenggat"
          rules={[{ required: true, message: 'Tenggat wajib diisi' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="kategori"
          label="Nama Category"
          rules={[{ required: true, message: 'Pilih setidaknya satu kategori' }]}
        >
          <Select
            mode="multiple"
            placeholder="Pilih kategori"
            allowClear
          >
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskModal;
    