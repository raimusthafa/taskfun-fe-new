import { useState, useEffect } from 'react';
import { Modal, Form, Input, Radio, message } from 'antd';
import { useBoardStore } from '@/store/useBoardStore';
import type { Board, CreateBoardData } from '@/types/board';

interface BoardModalProps {
  open: boolean;
  onClose: () => void;
  board?: Board | null;
}

export default function BoardModal({ open, onClose, board }: BoardModalProps) {
  const [form] = Form.useForm();
  const { createBoard, updateBoard, loading } = useBoardStore();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && board) {
      form.setFieldsValue({
        title: board.title,
        description: board.description,
        visibility: board.visibility,
      });
    } else if (open) {
      form.resetFields();
    }
  }, [open, board, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (board) {
        await updateBoard(board.id_board, values);
        message.success('Board berhasil diupdate');
      } else {
        await createBoard(values as CreateBoardData);
        message.success('Board berhasil dibuat');
      }

      form.resetFields();
      onClose();
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      message.error(error.response?.data?.error || 'Gagal menyimpan board');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={board ? 'Edit Board' : 'Buat Board Baru'}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={submitting || loading}
      okText={board ? 'Update' : 'Buat'}
      cancelText="Batal"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          visibility: 'public',
        }}
      >
        <Form.Item
          label="Judul Board"
          name="title"
          rules={[
            { required: true, message: 'Judul board harus diisi' },
            { min: 3, message: 'Judul minimal 3 karakter' },
            { max: 100, message: 'Judul maksimal 100 karakter' },
          ]}
        >
          <Input
            placeholder="Masukkan judul board"
            size="large"
            maxLength={100}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="Deskripsi"
          name="description"
          rules={[
            { max: 500, message: 'Deskripsi maksimal 500 karakter' },
          ]}
        >
          <Input.TextArea
            placeholder="Deskripsi board (opsional)"
            rows={4}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="Visibilitas"
          name="visibility"
          rules={[{ required: true, message: 'Pilih visibilitas board' }]}
        >
          <Radio.Group>
            <Radio value="public">
              <div>
                <div className="font-medium">Public</div>
                <div className="text-xs text-gray-500">Semua orang dapat melihat board ini</div>
              </div>
            </Radio>
            <Radio value="private" className="mt-2">
              <div>
                <div className="font-medium">Private</div>
                <div className="text-xs text-gray-500">Hanya member yang bisa melihat</div>
              </div>
            </Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
