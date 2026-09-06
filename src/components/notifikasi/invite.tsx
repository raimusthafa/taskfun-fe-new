import { useEffect } from 'react';
import { Card, Button, Tag, Typography, Spin, Empty, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import useNotifikasiStore from '../../store/useNotifikasiStore';
import { toast } from '@/lib/toast';
import type { Invitation } from '@/types/invitation';

const { Text } = Typography;

const InviteComponent = () => {
  const { invites, loading, listInvitesUser, acceptInvite, rejectInvite } = useNotifikasiStore();

  useEffect(() => {
    const loadInvites = async () => {
      try {
        await listInvitesUser();
      } catch (error) {
        toast.error(error, 'Gagal memuat daftar undangan');
      }
    };
    loadInvites();
  }, [listInvitesUser]);

  const handleAccept = async (invite: Invitation) => {
    const taskId = invite.task_id || invite.taskId || invite.task?.id;
    if (!taskId) {
      toast.error('Task ID tidak ditemukan');
      return;
    }
    try {
      await acceptInvite(taskId, invite.id);
      const taskTitle = invite.task?.tugas ? ` "${invite.task.tugas}"` : '';
      toast.success(`Undangan tugas${taskTitle} berhasil diterima!`);
    } catch (error) {
      toast.error(error, 'Gagal menerima undangan');
    }
  };

  const handleReject = async (invite: Invitation) => {
    const taskId = invite.task_id || invite.taskId || invite.task?.id;
    if (!taskId) {
      toast.error('Task ID tidak ditemukan');
      return;
    }
    try {
      await rejectInvite(taskId, invite.id);
      const taskTitle = invite.task?.tugas ? ` "${invite.task.tugas}"` : '';
      toast.info(`Undangan tugas${taskTitle} ditolak`);
    } catch (error) {
      toast.error(error, 'Gagal menolak undangan');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin size="large" tip="Memuat undangan..." />
      </div>
    );
  }

  if (invites.length === 0) {
    return (
      <div className="flex justify-center py-10">
        <Empty
          description={
            <span className="text-gray-500">
              Kamu belum memiliki undangan saat ini ✨
            </span>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invites.map((invite) => (
        <Card
          key={invite.id}
          className="rounded-xl border border-gray-200 shadow-sm hover:shadow transition-all duration-200"
        >
          <div className="flex justify-between items-center gap-3">

            {/* Left */}
            <div className="flex items-start gap-3">
              <Avatar size={42} icon={<UserOutlined />} />
              <div>
                <Text strong className="text-[15px] block">
                  {invite.task.tugas}
                </Text>

                <Text type="secondary" className="text-sm">
                  Diundang oleh <span className="font-medium">{invite.inviter.username}</span>
                </Text>
              </div>
            </div>

            {/* Right */}
            <div>
              {invite.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    type="primary"
                    size="middle"
                    className="rounded-lg"
                    onClick={() => handleAccept(invite)}
                  >
                    Terima
                  </Button>
                  <Button
                    size="middle"
                    danger
                    className="rounded-lg"
                    onClick={() => handleReject(invite)}
                  >
                    Tolak
                  </Button>
                </div>
              )}

              {invite.status === 'accepted' && (
                <Tag color="green" className="rounded-md px-3 py-1">
                  Diterima
                </Tag>
              )}

              {invite.status === 'rejected' && (
                <Tag color="red" className="rounded-md px-3 py-1">
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
