import { useState } from 'react';
import { Modal, Button, Input, message } from 'antd';
import useInviteStore from '../../store/useInviteStore';

interface InviteCollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  onInviteSuccess?: () => void;
}

const InviteCollaboratorModal = ({
  isOpen,
  onClose,
  taskId,
  onInviteSuccess
}: InviteCollaboratorModalProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { createInvite } = useInviteStore();

  const handleSubmit = async () => {
    if (!email) {
      message.warning('Silakan masukkan alamat email');
      return;
    }

    if (!email.includes('@')) {
      message.warning('Silakan masukkan alamat email yang valid');
      return;
    }

    try {
      setIsLoading(true);
      await createInvite(taskId, { email });
      message.success('Undangan berhasil dikirim!');
      setEmail('');
      onInviteSuccess?.();
      onClose();
    } catch (error: any) {
      message.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Undang Kolaborator"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={isLoading}>
          Batal
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleSubmit}
        >
          Kirim Undangan
        </Button>
      ]}
    >
      <div style={{ marginTop: 16 }}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Masukkan alamat email"
          required
        />
        <p style={{ marginTop: 8, color: 'rgba(0, 0, 0, 0.45)' }}>
          Kirim undangan untuk berkolaborasi pada tugas ini.
        </p>
      </div>
    </Modal>
  );
};

export default InviteCollaboratorModal;