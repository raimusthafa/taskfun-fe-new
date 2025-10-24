import { BellOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Badge, Dropdown, List, Button } from 'antd';
import type { MenuProps } from 'antd';
import { BellIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useNotifikasiStore from '../../store/useNotifikasiStore';
import useInviteStore from '../../store/useInviteStore';

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const { invites, listInvitesUser } = useNotifikasiStore();
  const { acceptInvite, rejectInvite } = useInviteStore();

  useEffect(() => {
    listInvitesUser();
  }, [listInvitesUser]);

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

  // Filter only pending invites for the badge
  const pendingInvites = invites.filter(invite => invite.status === 'pending');

  const items: MenuProps['items'] = [
    {
      key: 'notif-list',
      label: (
        <div className="w-72">
          <List
            dataSource={pendingInvites.slice(0, 5)} // Show only first 5 pending invites
            locale={{ emptyText: "Tidak ada undangan baru" }}
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
          <div className="text-center mt-2">
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
      <Badge count={pendingInvites.length} size="small">
        <BellIcon className="text-xl cursor-pointer" />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;
