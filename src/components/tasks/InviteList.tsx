import { useEffect } from 'react';
import { List, Tag, Space, Empty, Spin, message } from 'antd';
import useInviteStore from '../../store/useInviteStore';

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
        message.error(error || 'Gagal memuat daftar undangan');
      }
    };
    loadInvites();
  }, [taskId, listInvites]);

  if (loading) {
    return <Spin size="large" tip="Memuat..." />;
  }

  if (invites.length === 0) {
    return (
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>
          Daftar Kolaborator
        </h3>
        <Empty description="Belum ada undangan" />
      </div>
    );
  }

  // const handleAccept = async (inviteId: string) => {
  //   try {
  //     await acceptInvite(taskId, inviteId);
  //     message.success('Undangan diterima');
  //   } catch (error: any) {
  //     message.error(error || 'Gagal menerima undangan');
  //   }
  // };

  // const handleReject = async (inviteId: string) => {
  //   try {
  //     await rejectInvite(taskId, inviteId);
  //     message.success('Undangan ditolak');
  //   } catch (error: any) {
  //     message.error(error || 'Gagal menolak undangan');
  //   }
  // };

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 500}}>
        Daftar Kolaborator
      </h3>
      <List
        dataSource={invites}
        renderItem={(invite) => (
          <List.Item
            key={invite.id}
          >
            <List.Item.Meta
                            title={
                <div>
                  <div style={{ fontWeight: 500 }}>{invite.invitee_email || '-'}</div>
                  {/* <div style={{ fontSize: 13, color: '#888' }}>{invite.inviteeUsername ? `@${invite.inviteeUsername}` : ''}</div> */}
                  {/* <div style={{ fontSize: 13 }}>{invite.inviteeEmail}</div> */}
                </div>
              }
              description={
                <Space>
                  Status:{' '}
                  <Tag
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
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default InviteList;