import { useEffect } from 'react';
import { Card, Button, Tag, Typography, Spin, Empty, message, Avatar } from 'antd';
import { TeamOutlined, CrownOutlined } from '@ant-design/icons';
import { useBoardInvitationStore } from '@/store/useBoardInvitationStore';
import { useBoardStore } from '@/store/useBoardStore';

const { Text } = Typography;

const BoardInviteComponent = () => {
  const { invitations, loading, fetchInvitations, acceptInvitation, declineInvitation } = useBoardInvitationStore();
  const { fetchBoards } = useBoardStore();

  useEffect(() => {
    const loadInvitations = async () => {
      try {
        await fetchInvitations(); // Fetch all statuses
      } catch (error: any) {
        message.error('Gagal memuat daftar undangan board');
      }
    };
    loadInvitations();
  }, [fetchInvitations]);

  const handleAccept = async (invitationId: number, boardTitle: string) => {
    try {
      await acceptInvitation(invitationId);
      await fetchBoards(); // Refresh boards list
      message.success(`Anda sekarang member dari "${boardTitle}"!`);
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Gagal menerima undangan');
    }
  };

  const handleDecline = async (invitationId: number, boardTitle: string) => {
    try {
      await declineInvitation(invitationId);
      message.info(`Undangan dari "${boardTitle}" ditolak`);
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Gagal menolak undangan');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin size="large" tip="Memuat undangan board..." />
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="flex justify-center py-10">
        <Empty
          description={
            <span className="text-gray-500">
              Kamu belum memiliki undangan board saat ini ✨
            </span>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => (
        <Card
          key={invitation.id_boardinvitation}
          className="rounded-xl border border-gray-200 shadow-sm hover:shadow transition-all duration-200"
        >
          <div className="flex justify-between items-start gap-4">

            {/* Left */}
            <div className="flex items-start gap-3">
              <Avatar 
                size={48} 
                icon={<TeamOutlined />} 
                style={{ backgroundColor: '#1890ff' }}
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Text strong className="text-[16px]">
                    {invitation.board?.title}
                  </Text>
                  <Tag color={invitation.role === 'admin' ? 'gold' : 'blue'} className="rounded-md">
                    {invitation.role === 'admin' ? (
                      <>
                        <CrownOutlined /> Admin
                      </>
                    ) : (
                      'Member'
                    )}
                  </Tag>
                </div>

                <Text type="secondary" className="text-sm block mb-1">
                  {invitation.board?.description || 'Tidak ada deskripsi'}
                </Text>

                <Text type="secondary" className="text-xs">
                  Diundang oleh <span className="font-medium">{invitation.inviter?.fullname}</span> 
                  {' · '}
                  {getTimeAgo(invitation.created_at)}
                </Text>
              </div>
            </div>

            {/* Right - Status/Actions */}
            <div className="flex-shrink-0">
              {invitation.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    type="primary"
                    size="middle"
                    className="rounded-lg"
                    onClick={() => handleAccept(invitation.id_boardinvitation, invitation.board?.title || 'board')}
                  >
                    Terima
                  </Button>
                  <Button
                    size="middle"
                    danger
                    className="rounded-lg"
                    onClick={() => handleDecline(invitation.id_boardinvitation, invitation.board?.title || 'board')}
                  >
                    Tolak
                  </Button>
                </div>
              )}

              {invitation.status === 'accepted' && (
                <Tag color="green" className="rounded-md px-3 py-1">
                  ✓ Diterima
                </Tag>
              )}

              {invitation.status === 'declined' && (
                <Tag color="red" className="rounded-md px-3 py-1">
                  ✗ Ditolak
                </Tag>
              )}
            </div>

          </div>
        </Card>
      ))}
    </div>
  );
};

export default BoardInviteComponent;
