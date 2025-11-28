import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Badge, Dropdown, List, Button, Tabs, message } from 'antd';
import type { MenuProps } from 'antd';
import { BellIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useNotifikasiStore from '../../store/useNotifikasiStore';
import useInviteStore from '../../store/useInviteStore';
import { useBoardInvitationStore } from '../../store/useBoardInvitationStore';
import { useBoardStore } from '../../store/useBoardStore';

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const { invites, listInvitesUser } = useNotifikasiStore();
  const { acceptInvite, rejectInvite } = useInviteStore();
  const { invitations: boardInvitations, fetchInvitations, acceptInvitation, declineInvitation } = useBoardInvitationStore();
  const { fetchBoards } = useBoardStore();

  useEffect(() => {
    listInvitesUser();
    fetchInvitations('pending');
  }, [listInvitesUser]);

  useEffect(() => {
    if (open) {
      fetchInvitations('pending');
    }
  }, [open]);

  const handleAccept = async (inviteId: string, taskId: string) => {
    try {
      await acceptInvite(taskId, inviteId);
    } catch (error) {
      console.error('Failed to accept invite:', error);
    }
  };

  const handleReject = async (inviteId: string, taskId: string) => {
    try {
      await rejectInvite(taskId, inviteId);
    } catch (error) {
      console.error('Failed to reject invite:', error);
    }
  };

  const handleAcceptBoardInvite = async (invitationId: number) => {
    try {
      const invitation = boardInvitations.find(inv => inv.id_boardinvitation === invitationId);
      await acceptInvitation(invitationId);
      await fetchBoards();
      await fetchInvitations('pending');
      if (invitation?.board?.title) {
        message.success(`Anda sekarang member dari "${invitation.board.title}"!`);
      }
    } catch (error) {
      console.error('Failed to accept board invitation:', error);
      message.error('Gagal menerima invitation');
    }
  };

  const handleDeclineBoardInvite = async (invitationId: number) => {
    try {
      const invitation = boardInvitations.find(inv => inv.id_boardinvitation === invitationId);
      await declineInvitation(invitationId);
      await fetchInvitations('pending');
      if (invitation?.board?.title) {
        message.info(`Invitation dari "${invitation.board.title}" ditolak`);
      }
    } catch (error) {
      console.error('Failed to decline board invitation:', error);
      message.error('Gagal menolak invitation');
    }
  };

  // Filter only pending invites for the badge
  const pendingInvites = invites.filter(invite => invite.status === 'pending');
  const pendingBoardInvites = boardInvitations.filter(inv => inv.status === 'pending');
  const totalPending = pendingInvites.length + pendingBoardInvites.length;

  const items: MenuProps['items'] = [
    {
      key: 'notif-list',
      label: (
        <div className="w-96">
          <Tabs
            defaultActiveKey="tasks"
            items={[
              {
                key: 'tasks',
                label: `Task Invites (${pendingInvites.length})`,
                children: (
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <List
                      dataSource={pendingInvites.slice(0, 5)}
                      locale={{ emptyText: "Tidak ada undangan task" }}
                      renderItem={(invite) => (
                        <List.Item
                          className="hover:bg-gray-50 p-2 rounded-lg transition"
                          actions={[
                            <Button
                              size="small"
                              type="link"
                              icon={<CheckOutlined />}
                              onClick={() => handleAccept(invite.id, invite.taskId)}
                            />,
                            <Button
                              size="small"
                              type="link"
                              danger
                              icon={<CloseOutlined />}
                              onClick={() => handleReject(invite.id, invite.taskId)}
                            />,
                          ]}
                        >
                          <List.Item.Meta
                            title={<span className="font-semibold">{invite.task.tugas}</span>}
                            description={<span>Dari {invite.inviter.username}</span>}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                ),
              },
              {
                key: 'boards',
                label: `Board Invites (${pendingBoardInvites.length})`,
                children: (
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <List
                      dataSource={pendingBoardInvites.slice(0, 5)}
                      locale={{ emptyText: "Tidak ada undangan board" }}
                      renderItem={(invitation) => (
                        <List.Item
                          className="hover:bg-gray-50 p-2 rounded-lg transition"
                          actions={[
                            <Button
                              size="small"
                              type="link"
                              icon={<CheckOutlined />}
                              onClick={() => handleAcceptBoardInvite(invitation.id_boardinvitation)}
                            />,
                            <Button
                              size="small"
                              type="link"
                              danger
                              icon={<CloseOutlined />}
                              onClick={() => handleDeclineBoardInvite(invitation.id_boardinvitation)}
                            />,
                          ]}
                        >
                          <List.Item.Meta
                            title={<span className="font-semibold">{invitation.board?.title}</span>}
                            description={<span>Dari {invitation.inviter?.fullname} ({invitation.role})</span>}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                ),
              },
            ]}
          />
          <div className="text-center mt-2 pt-2 border-t">
            <Link to="/notifikasi" className="text-blue-500">
              Lihat semua notifikasi
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomRight"
      trigger={['click']}
      open={open}
      onOpenChange={setOpen}
      arrow
    >
      <Badge count={totalPending} size="small">
        <BellIcon className="text-xl cursor-pointer" />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;
