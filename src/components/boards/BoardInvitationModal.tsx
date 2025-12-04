import { useEffect } from 'react';
import { Modal, List, Avatar, Button, Tag, message, Empty, Spin } from 'antd';
import { MailOutlined, CheckOutlined, CloseOutlined, CrownOutlined } from '@ant-design/icons';
import { useBoardInvitationStore } from '@/store/useBoardInvitationStore';
import { useBoardStore } from '@/store/useBoardStore';
// import { useNavigate } from 'react-router-dom';

interface BoardInvitationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BoardInvitationModal({ open, onClose }: BoardInvitationModalProps) {
  const { invitations, loading, fetchInvitations, acceptInvitation, declineInvitation } = useBoardInvitationStore();
  const { fetchBoards } = useBoardStore();
  // const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchInvitations('pending');
    }
  }, [open]);

  const handleAccept = async (invitationId: number) => {
    try {
      await acceptInvitation(invitationId);
      message.success('Invitation diterima! Anda sekarang member board.');
      await fetchBoards(); // Refresh boards list
    } catch (error: any) {
      console.error('Accept invitation error:', error);
      message.error(error.response?.data?.error || 'Gagal menerima invitation');
    }
  };

  const handleDecline = async (invitationId: number) => {
    try {
      await declineInvitation(invitationId);
      message.success('Invitation ditolak');
    } catch (error: any) {
      console.error('Decline invitation error:', error);
      message.error(error.response?.data?.error || 'Gagal menolak invitation');
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`;
    return `${Math.floor(diffDays / 30)} bulan yang lalu`;
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <MailOutlined />
          Board Invitations
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {loading ? (
        <div className="text-center py-8">
          <Spin size="large" />
        </div>
      ) : invitations.length === 0 ? (
        <Empty
          description="Tidak ada invitation"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          dataSource={invitations}
          renderItem={(invitation) => (
            <List.Item
              key={invitation.id_boardinvitation}
              actions={[
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => handleAccept(invitation.id_boardinvitation)}
                  loading={loading}
                >
                  Accept
                </Button>,
                <Button
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => handleDecline(invitation.id_boardinvitation)}
                  loading={loading}
                >
                  Decline
                </Button>,
              ]}
              className="hover:bg-gray-50 transition-colors"
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    size={48}
                    style={{ backgroundColor: '#1890ff' }}
                  >
                    {invitation.board?.title?.charAt(0).toUpperCase()}
                  </Avatar>
                }
                title={
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">
                      {invitation.board?.title}
                    </span>
                    <Tag color={invitation.role === 'admin' ? 'gold' : 'blue'}>
                      {invitation.role === 'admin' ? (
                        <>
                          <CrownOutlined /> Admin
                        </>
                      ) : (
                        'Member'
                      )}
                    </Tag>
                  </div>
                }
                description={
                  <div className="space-y-1">
                    <div className="text-gray-600">
                      {invitation.board?.description || 'Tidak ada deskripsi'}
                    </div>
                    <div className="text-sm text-gray-500">
                      <strong>Diundang oleh:</strong> {invitation.inviter?.fullname} (@{invitation.inviter?.username})
                    </div>
                    <div className="text-xs text-gray-400">
                      {getTimeAgo(invitation.created_at)}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
}
