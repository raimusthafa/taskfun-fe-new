import { useState, useEffect, useCallback } from 'react';
import { Modal, List, Avatar, Tag, Button, Select, message, Segmented, Tooltip, Popconfirm } from 'antd';
import { CrownOutlined, UserAddOutlined, MailOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useBoardStore } from '@/store/useBoardStore';
import { useUserStore } from '@/store/useUserStore';
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
  const { addMember, sendInvitation, removeMember, updateMemberRole, currentBoard, loading } = useBoardStore();
  const { user } = useUserStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [addMode, setAddMode] = useState<'invite' | 'direct'>('invite');
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member'>('member');
  const [_searching, setSearching] = useState(false); // searching : not used yet

  // Edit Role State
  const [editMemberModalOpen, setEditMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<BoardMember | null>(null);
  const [newRole, setNewRole] = useState<'admin' | 'member'>('member');

  // Fix: Backend returns id_user, not id. Handle both just in case.
  // Cast to number because interface might say string but runtime is number, or vice versa.
  const currentUserId = user?.id_user ? Number(user.id_user) : (user?.id ? Number(user.id) : undefined);

  const currentUserMember = members.find(m => m.id_user === currentUserId);
  const isAdmin = currentUserMember?.role === 'admin';
  const ownerId = currentBoard?.board.id_user;

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

  const handleSendInvitation = async () => {
    if (!selectedUserId) {
      message.warning('Pilih user terlebih dahulu');
      return;
    }

    const isAlreadyMember = members.some((member) => member.id_user === parseInt(selectedUserId));
    if (isAlreadyMember) {
      message.warning('User sudah menjadi member board ini');
      return;
    }

    // Get selected user info
    const selectedUser = searchResults.find(u => u.id_user.toString() === selectedUserId);
    const userName = selectedUser?.fullname || selectedUser?.username || 'User';

    try {
      await sendInvitation(boardId, { invitee_id: parseInt(selectedUserId), role: selectedRole });
      message.success(`Invitation berhasil dikirim ke ${userName} sebagai ${selectedRole === 'admin' ? 'Admin' : 'Member'}!`);
      setSelectedUserId(null);
      setSearchInput('');
      setSearchResults([]);
      setSelectedRole('member');
      setShowAddForm(false);
      if (onMemberAdded) {
        onMemberAdded();
      }
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Gagal mengirim invitation');
    }
  };

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
      message.success('Member berhasil ditambahkan langsung');
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

  const handleRemoveMember = async (memberId: number) => {
    try {
      await removeMember(boardId, memberId);
      message.success('Member berhasil dihapus');
      if (onMemberAdded) onMemberAdded();
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Gagal menghapus member');
    }
  };

  const openEditModal = (member: BoardMember) => {
    setEditingMember(member);
    setNewRole(member.role);
    setEditMemberModalOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!editingMember) return;
    try {
      await updateMemberRole(boardId, editingMember.id_boardmember, { role: newRole });
      message.success('Role member berhasil diupdate');
      setEditMemberModalOpen(false);
      setEditingMember(null);
      if (onMemberAdded) onMemberAdded();
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Gagal update role member');
    }
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
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Tambah Member Baru</h4>
              <Segmented
                value={addMode}
                onChange={(value) => setAddMode(value as 'invite' | 'direct')}
                options={[
                  { label: 'Send Invitation', value: 'invite', icon: <MailOutlined /> },
                  { label: 'Direct Add', value: 'direct', icon: <UserAddOutlined /> },
                ]}
              />
            </div>

            {addMode === 'invite' && (
              <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                <strong>Mode Invitation:</strong> User akan menerima notifikasi dan harus menyetujui undangan sebelum menjadi member.
              </div>
            )}

            {addMode === 'direct' && (
              <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                <strong>Mode Direct Add:</strong> User langsung ditambahkan sebagai member tanpa persetujuan.
              </div>
            )}

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

              <Button
                type="primary"
                icon={addMode === 'invite' ? <MailOutlined /> : <UserAddOutlined />}
                disabled={!selectedUserId}
                loading={loading}
                onClick={addMode === 'invite' ? handleSendInvitation : handleAddMember}
                block
              >
                {addMode === 'invite' ? 'Kirim Invitation' : 'Tambah Member Langsung'}
              </Button>
            </div>
          </div>
        )}


        <List
          dataSource={members}
          renderItem={(member) => {
            const isOwner = member.id_user === ownerId;
            const isSelf = member.id_user === currentUserId;
            const canEdit = isAdmin && !isOwner; // Admin can edit anyone except owner

            return (
              <List.Item
                actions={canEdit ? [
                  <Tooltip title="Edit Role">
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => openEditModal(member)}
                    />
                  </Tooltip>,
                  <Popconfirm
                    title="Hapus Member"
                    description="Apakah anda yakin ingin menghapus member ini?"
                    onConfirm={() => handleRemoveMember(member.id_boardmember)}
                    okText="Ya"
                    cancelText="Batal"
                    disabled={isSelf} // Prevent deleting self via this button (maybe allow leave?)
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      disabled={isSelf}
                    />
                  </Popconfirm>
                ] : []}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={48}
                      style={{ backgroundColor: '#1890ff' }}
                    >
                      {(member.user?.fullname || 'U').charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-base">
                        {member.user?.fullname || `User ${member.id_user}`}
                      </span>
                      <Tag
                        icon={member.role === 'admin' ? <CrownOutlined /> : null}
                        color={member.role === 'admin' ? 'gold' : 'blue'}
                        className="rounded-md"
                      >
                        {member.role === 'admin' ? 'Admin' : 'Member'}
                      </Tag>
                      {isOwner && <Tag color="purple">Owner</Tag>}
                    </div>
                  }
                  description={
                    <span className="text-gray-500">
                      {member.user?.email || member.user?.username}
                    </span>
                  }
                />
              </List.Item>
            );
          }}
          locale={{ emptyText: 'Tidak ada member' }}
        />
      </div>


      {/* Edit Role Modal */}
      <Modal
        title="Edit Role Member"
        open={editMemberModalOpen}
        onOk={handleUpdateRole}
        onCancel={() => setEditMemberModalOpen(false)}
        okText="Simpan"
        cancelText="Batal"
      >
        <div className="py-4">
          <p className="mb-2">Pilih role untuk <strong>{editingMember?.user?.fullname}</strong>:</p>
          <Select
            value={newRole}
            onChange={setNewRole}
            style={{ width: '100%' }}
            options={[
              { value: 'member', label: 'Member' },
              { value: 'admin', label: 'Admin' },
            ]}
          />
        </div>
      </Modal>
    </Modal >
  );
}
