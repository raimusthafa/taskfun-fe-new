import { useState, useEffect } from 'react';
import { Modal, List, Avatar, Button, Select, message, Tag, Input, Spin } from 'antd';
import { UserAddOutlined, CrownOutlined, MailOutlined } from '@ant-design/icons';
import { useBoardStore } from '@/store/useBoardStore';
import { useUserStore } from '@/store/useUserStore';
import type { BoardMember } from '@/types/board';

interface MemberModalProps {
  open: boolean;
  onClose: () => void;
  boardId: number;
  members: BoardMember[];
  onMemberAdded?: () => void;
}

export default function MemberModal({ open, onClose, boardId, members, onMemberAdded }: MemberModalProps) {
  const { sendInvitation, updateMemberRole, loading } = useBoardStore();
  const { users, fetchUsers } = useUserStore();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member'>('member');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (open) {
      console.log('MemberModal opened, fetching users...');
      fetchUsers();
    }
  }, [open]);

  useEffect(() => {
    console.log('Users fetched:', users.length, 'users');
    console.log('Available users after filter:', availableUsers.length, 'users');
  }, [users]);

  const availableUsers = users.filter(
    (user) => !members.some((member) => member.id_user === user.id)
  );

  const handleSendInvitation = async () => {
    if (!selectedUserId) {
      message.warning('Pilih user terlebih dahulu');
      return;
    }

    try {
      await sendInvitation(boardId, { invitee_id: selectedUserId, role: selectedRole });
      message.success('Invitation berhasil dikirim!');
      setSelectedUserId(null);
      setSelectedRole('member');
      if (onMemberAdded) {
        onMemberAdded();
      }
    } catch (error: any) {
      console.error('Send invitation error:', error);
      message.error(error.response?.data?.error || 'Gagal mengirim invitation');
    }
  };



  const handleUpdateRole = async (memberId: number, newRole: 'admin' | 'member') => {
    try {
      await updateMemberRole(boardId, memberId, { role: newRole });
      message.success('Role member berhasil diupdate');
      if (onMemberAdded) {
        onMemberAdded();
      }
    } catch (error: any) {
      console.error('Update role error:', error);
      message.error(error.response?.data?.error || 'Gagal mengupdate role');
    }
  };

  const filteredMembers = members.filter((member) =>
    member.user?.fullname.toLowerCase().includes(searchText.toLowerCase()) ||
    member.user?.username.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <UserAddOutlined />
          Kelola Member Board
        </div>
      }
      open={open}
      onCancel={(e) => {
        console.log('Modal cancel triggered', e);
        onClose();
      }}
      footer={null}
      width={600}
      maskClosable={false}
    >
      <div className="space-y-4">
        {/* Send Invitation Section */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3">Kirim Invitation</h4>
          <div className="flex gap-2">
            <Select
              showSearch
              placeholder="Pilih user"
              style={{ flex: 1 }}
              value={selectedUserId}
              onChange={setSelectedUserId}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={availableUsers.map((user) => ({
                value: user.id,
                label: `${user.fullname} (@${user.username})`,
              }))}
            />
            <Select
              value={selectedRole}
              onChange={setSelectedRole}
              style={{ width: 120 }}
              options={[
                { value: 'member', label: 'Member' },
                { value: 'admin', label: 'Admin' },
              ]}
            />
            <Button
              type="primary"
              icon={<MailOutlined />}
              onClick={handleSendInvitation}
              loading={loading}
              disabled={!selectedUserId}
            >
              Kirim
            </Button>
          </div>
        </div>

        {/* Members List */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold">Daftar Member ({members.length})</h4>
            <Input.Search
              placeholder="Cari member..."
              style={{ width: 200 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </div>

          {loading && members.length === 0 ? (
            <div className="text-center py-8">
              <Spin />
            </div>
          ) : (
            <List
              dataSource={filteredMembers}
              renderItem={(member) => (
                <List.Item
                  actions={[
                    <Select
                      value={member.role}
                      onChange={(value) => handleUpdateRole(member.id_boardmember, value)}
                      style={{ width: 100 }}
                      size="small"
                    >
                      <Select.Option value="member">Member</Select.Option>
                      <Select.Option value="admin">Admin</Select.Option>
                    </Select>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: '#1890ff' }}>
                        {(member.user?.fullname || `U${member.id_user}`).charAt(0).toUpperCase()}
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
          )}
        </div>
      </div>
    </Modal>
  );
}
