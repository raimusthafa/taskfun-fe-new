import { useState, useEffect, useCallback } from 'react';
import { Modal, List, Avatar, Tag, Button, Select, Radio, message } from 'antd';
import { CrownOutlined, UserAddOutlined } from '@ant-design/icons';
import { useBoardStore } from '@/store/useBoardStore';
import api from '@/lib/api';
import debounce from 'lodash/debounce';
import type { BoardMember } from '@/types/board';

interface MemberModalProps {
  open: boolean;
  onClose: () => void;
  boardId: number;
  members: BoardMember[];
  onMemberAdded?: () => void;
}

interface UserSearchResult {
  id_user: number;
  username: string;
  email: string;
  fullname: string;
}

export default function MemberModal({ open, onClose, boardId, members, onMemberAdded }: MemberModalProps) {
  const { addMember, loading } = useBoardStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member'>('member');
  const [searching, setSearching] = useState(false);

  // Debounced search function
  const searchUsers = useCallback(
    debounce(async (query: string) => {
      if (!query || query.length < 3) {
        setSearchResults([]);
        return;
      }
      try {
        setSearching(true);
        const response = await api.get(`/users/search?username=${encodeURIComponent(query)}`);
        console.log('API Response:', response.data);
        console.log('First user:', response.data?.[0]);
        setSearchResults(response.data || []);
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchResults([]);
        message.error('Gagal mencari user');
      } finally {
        setSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (!open) {
      setSearchInput('');
      setSearchResults([]);
      setSelectedUserId(null);
      setShowAddForm(false);
    }
  }, [open]);

  useEffect(() => {
    if (searchInput.length >= 3) {
      searchUsers(searchInput);
    }
  }, [searchInput, searchUsers]);

  const handleAddMember = async () => {
    if (!selectedUserId) {
      message.warning('Pilih user terlebih dahulu');
      return;
    }

    const isAlreadyMember = members.some((member) => member.id_user === parseInt(selectedUserId));
    if (isAlreadyMember) {
      message.warning('User sudah menjadi member board ini');
      return;
    }

    try {
      await addMember(boardId, { id_user: parseInt(selectedUserId), role: selectedRole });
      message.success('Member berhasil ditambahkan');
      setSelectedUserId(null);
      setSearchInput('');
      setSearchResults([]);
      setSelectedRole('member');
      setShowAddForm(false);
      if (onMemberAdded) {
        onMemberAdded();
      }
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Gagal menambahkan member');
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setSelectedUserId(null);
  };

  const handleUserSelect = (userId: string) => {
    console.log('handleUserSelect called:', userId);
    setSelectedUserId(userId);
    const user = searchResults.find(u => u.id_user.toString() === userId);
    console.log('Found user:', user);
    if (user) {
      setSearchInput(user.username);
    }
  };

  // console.log('Render - selectedUserId:', selectedUserId, 'Type:', typeof selectedUserId, 'Button disabled:', !selectedUserId);

  return (
    <Modal
      title="Kelola Member Board"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-end">
        <h4 className="font-semibold text-sm">Daftar Member ({members.length})</h4>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Tutup Form' : 'Tambah Member'}
        </Button>
        </div>
        {/* Add Member Form - Collapse Style */}
        {showAddForm && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-3">Tambah Member Baru</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Cari User (Username)</label>
                <Select
                  showSearch
                  value={selectedUserId ? searchInput : undefined}
                  placeholder="Ketik minimal 3 karakter untuk mencari"
                  style={{ width: '100%' }}
                  onSearch={handleSearchChange}
                  onChange={handleUserSelect}
                  filterOption={false}
                  notFoundContent={searchInput.length < 3 ? "Ketik minimal 3 karakter" : "Tidak ada hasil"}
                >
                  {searchResults.filter(user => user && user.id_user).map((user) => (
                    <Select.Option key={user.id_user} value={user.id_user.toString()}>
                      {user.fullname} (@{user.username})
                    </Select.Option>
                  ))}
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Cari dan pilih pengguna berdasarkan username untuk menambahkan sebagai member
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <Select
                  value={selectedRole}
                  onChange={setSelectedRole}
                  style={{ width: '100%' }}
                  options={[
                    { value: 'member', label: 'Member' },
                    { value: 'admin', label: 'Admin' },
                  ]}
                />
              </div>

              {/* <div className="text-xs text-gray-500 mb-2">
                Debug: Selected User ID = {selectedUserId || 'null'} | Disabled = {!selectedUserId ? 'true' : 'false'}
              </div> */}
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                disabled={!selectedUserId}
                loading={loading}
                onClick={handleAddMember}
                block
              >
                Tambah Member
              </Button>
            </div>
          </div>
        )}

        
        <List
          dataSource={members}
          renderItem={(member) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar style={{ backgroundColor: '#1890ff' }}>
                    {(member.user?.fullname || 'U').charAt(0).toUpperCase()}
                  </Avatar>
                }
                title={
                  <div className="flex items-center gap-2">
                    {member.user?.fullname || `User ${member.id_user}`}
                    {member.role === 'admin' && (
                      <Tag icon={<CrownOutlined />} color="gold">
                        Admin
                      </Tag>
                    )}
                  </div>
                }
                description={member.user?.email || member.user?.username}
              />
            </List.Item>
          )}
          locale={{ emptyText: 'Tidak ada member' }}
        />
      </div>
    </Modal>
  );
}
