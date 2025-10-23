import { BellOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Badge, Dropdown, List, Button } from 'antd';
import type { MenuProps } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);

  // Data statis dulu
  const notifications = [
    { id: 1, title: 'Undangan Kolaborasi', task: 'Tugas Frontend Landing Page', from: 'Raihan Musthafa' },
    { id: 2, title: 'Undangan Kolaborasi', task: 'API Management Dashboard', from: 'Nanda Putra' },
  ];

  const items: MenuProps['items'] = [
    {
      key: 'notif-list',
      label: (
        <div className="w-72">
          <List
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                className="hover:bg-gray-50 p-2 rounded-lg transition"
                actions={[
                  <Button size="small" type="link" icon={<CheckOutlined />} />,
                  <Button size="small" type="link" danger icon={<CloseOutlined />} />,
                ]}
              >
                <List.Item.Meta
                  title={<span className="font-semibold">{item.task}</span>}
                  description={<span>Dari {item.from}</span>}
                />
              </List.Item>
            )}
          />
          <div className="text-center mt-2">
            <Link to="/notifikasi" type="link" className="text-blue-500">
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
      <Badge count={notifications.length} size="small">
        <BellOutlined className="text-xl cursor-pointer" />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;
