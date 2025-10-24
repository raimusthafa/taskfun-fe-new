import { useEffect } from 'react';
import { Card, Button, Tag, Typography, Spin, Empty, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import useNotifikasiStore from '../../store/useNotifikasiStore';
import useInviteStore from '@/store/useInviteStore';

const { Title, Text } = Typography;

const InviteComponent = () => {
  const { invites, loading, listInvitesUser } = useNotifikasiStore();
  const { acceptInvite, rejectInvite } = useInviteStore();

  useEffect(() => {
    const loadInvites = async () => {
      try {
        await listInvitesUser();
      } catch (error: any) {
        message.error(error || 'Gagal memuat daftar undangan');
      }
    };
    loadInvites();
  }, [listInvitesUser]);

  const handleAccept = async (inviteId: string, taskId: string) => {
    try {
      await acceptInvite(taskId, inviteId);
      message.success('Undangan diterima');
    } catch (error: any) {
      message.error(error || 'Gagal menerima undangan');
    }
  };

  const handleReject = async (inviteId: string, taskId: string) => {
    try {
      await rejectInvite(taskId, inviteId);
      message.success('Undangan ditolak');
    } catch (error: any) {
      message.error(error || 'Gagal menolak undangan');
    }
  };

  if (loading) {
    return <Spin size="large" tip="Memuat..." />;
  }

  if (invites.length === 0) {
    return (
      <div className="">
        <Empty description="Belum ada undangan" />
      </div>
    );
  }

  return (
    <div className="">

      {invites.map((invite) => (
        <Card
          key={invite.id}
          className="mb-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
        >
          <div className="flex justify-between items-center">
            {/* Kiri: Detail undangan */}
            <div>
              <Text strong className="text-lg block">
                {invite.task.tugas}
              </Text>
              <div className="flex items-center gap-1 text-gray-500 mt-1">
                <Text className="text-sm">Dari {invite.inviter.username}</Text>
              </div>
            </div>

            {/* Kanan: Status / Aksi */}
            <div className="text-right">
              {invite.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => handleAccept(invite.id, invite.taskId)}
                  >
                    Terima
                  </Button>
                  <Button
                    danger
                    size="small"
                    onClick={() => handleReject(invite.id, invite.taskId)}
                  >
                    Tolak
                  </Button>
                </div>
              )}

              {invite.status === 'accepted' && (
                <Tag color="green" className="text-sm">
                  Diterima
                </Tag>
              )}

              {invite.status === 'rejected' && (
                <Tag color="red" className="text-sm">
                  Ditolak
                </Tag>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default InviteComponent;
