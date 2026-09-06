import { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Input, Select, Radio } from 'antd';
import useInviteStore from '../../store/useInviteStore';
import api from '../../lib/api';
import debounce from 'lodash/debounce';
import { toast } from '@/lib/toast';

interface InviteCollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  onInviteSuccess?: () => void;
}

interface UserSearchResult {
  id_user: number;
  username: string;
  email: string;
  fullname: string;
}

export default function InviteCollaboratorModal({
  isOpen,
  onClose,
  taskId,
  onInviteSuccess,
}: InviteCollaboratorModalProps) {
  const [inviteMethod, setInviteMethod] = useState<'username' | 'email'>('username');
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { createInvite } = useInviteStore();

  const searchUsers = useCallback(
    debounce(async (query: string) => {
      if (!query || query.length < 3) {
        setSearchResults([]);
        return;
      }
      try {
        const response = await api.get(`/users/search?username=${encodeURIComponent(query)}`);
        setSearchResults(response.data || []);
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchResults([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (!isOpen) {
      setSearchInput('');
      setSearchResults([]);
      setSelectedUserId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (inviteMethod === 'username' && searchInput.length >= 3) {
      searchUsers(searchInput);
    }
  }, [searchInput, inviteMethod]);

  const handleSubmit = async () => {
    if (inviteMethod === 'email') {
      if (!searchInput) {
        toast.warning('Silakan masukkan alamat email');
        return;
      }

      if (!searchInput.includes('@')) {
        toast.warning('Silakan masukkan alamat email yang valid');
        return;
      }

      try {
        setIsLoading(true);
        await createInvite(taskId, { invitee_email: searchInput });
        toast.success('Undangan berhasil dikirim!');
        setSearchInput('');
        onInviteSuccess?.();
        onClose();
      } catch (error) {
        toast.error(error, 'Gagal mengirim undangan');
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!selectedUserId) {
        toast.warning('Silakan pilih pengguna dari hasil pencarian');
        return;
      }

      try {
        setIsLoading(true);
        await createInvite(taskId, { user_id: parseInt(selectedUserId!) });
        toast.success('Undangan berhasil dikirim!');
        setSearchInput('');
        setSelectedUserId(null);
        onInviteSuccess?.();
        onClose();
      } catch (error) {
        toast.error(error, 'Gagal mengirim undangan');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (inviteMethod === 'username') {
      setSelectedUserId(null);
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    const user = searchResults.find(u => String(u.id_user) === String(userId));
    if (user) {
      setSearchInput(user.username);
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
        <Radio.Group
          value={inviteMethod}
          onChange={(e) => {
            setInviteMethod(e.target.value);
            setSearchInput('');
            setSelectedUserId(null);
            setSearchResults([]);
          }}
          style={{ marginBottom: 16 }}
        >
          <Radio.Button value="email">Email</Radio.Button>
          <Radio.Button value="username">Username</Radio.Button>
        </Radio.Group>

        {inviteMethod === 'email' ? (
          <Input
            type="email"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Masukkan alamat email"
            required
          />
        ) : (
          <Select
            showSearch
            value={selectedUserId ? searchInput : undefined}
            placeholder="Cari username"
            style={{ width: '100%' }}
            onSearch={handleSearchChange}
            onChange={handleUserSelect}
            filterOption={false}
            notFoundContent={searchInput.length < 3 ? "Ketik minimal 3 karakter" : "Tidak ada hasil"}
          >
            {searchResults.map((user) => (
              <Select.Option key={user.id_user} value={user.id_user.toString()}>
                {user.username} ({user.email})
              </Select.Option>
            ))}
          </Select>
        )}
        
        <p style={{ marginTop: 8, color: 'rgba(0, 0, 0, 0.45)' }}>
          {inviteMethod === 'email' 
            ? 'Kirim undangan melalui email untuk berkolaborasi pada tugas ini.'
            : 'Cari dan pilih pengguna berdasarkan username untuk mengundang mereka.'}
        </p>
      </div>
    </Modal>
  );
}