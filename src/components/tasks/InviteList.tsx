import { useEffect } from 'react';
import { List, Tag, Empty, Spin } from 'antd';
import useInviteStore from '../../store/useInviteStore';
import { toast } from '@/lib/toast';

interface InviteListProps {
  taskId: string;
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'MENUNGGU';
    case 'accepted':
      return 'DITERIMA';
    case 'rejected':
      return 'DITOLAK';
    default:
      return status.toUpperCase();
  }
};

const InviteList = ({ taskId }: InviteListProps) => {
  const { invites, loading, listInvites } = useInviteStore();

  useEffect(() => {
    const loadInvites = async () => {
      try {
        await listInvites(taskId);
      } catch (error: any) {
        // Jika 403 (bukan owner), abaikan secara senyap tanpa menampilkan toast error
        if (error?.response?.status === 403 || error?.status === 403) {
          return;
        }
        toast.error(error, 'Gagal memuat daftar undangan');
      }
    };
    loadInvites();
  }, [taskId, listInvites]);

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Spin size="default" tip="Memuat daftar undangan..." />
      </div>
    );
  }

  if (invites.length === 0) {
    return (
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Daftar Undangan Kolaborator
        </h3>
        <div className="py-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
          <Empty description={<span className="text-gray-500 text-sm">Belum ada undangan kolaborator</span>} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        Daftar Undangan Kolaborator
      </h3>
      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden shadow-sm">
        <List
          dataSource={invites}
          renderItem={(invite) => (
            <List.Item key={invite.id} className="!px-5 !py-3.5 hover:bg-gray-50/60 transition-colors">
              <List.Item.Meta
                title={
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 text-sm">{invite.invitee_email || '-'}</span>
                    <Tag
                      className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      color={
                        invite.status === 'pending'
                          ? 'gold'
                          : invite.status === 'accepted'
                          ? 'green'
                          : 'red'
                      }
                    >
                      {getStatusText(invite.status)}
                    </Tag>
                  </div>
                }
                description={
                  <span className="text-xs text-gray-400">
                    Undangan kolaborasi tugas
                  </span>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default InviteList;