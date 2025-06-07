import React from 'react';
import { SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { UserIcon } from 'lucide-react';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: 'My Account',
    disabled: true,
  },
  {
    type: 'divider',
  },
  {
    key: '2',
    label: 'Profile',
    extra: '⌘P',
  },
  {
    key: '3',
    label: 'Billing',
    extra: '⌘B',
  },
  {
    key: '4',
    label: 'Settings',
    icon: <SettingOutlined />,
    extra: '⌘S',
  },
  {
    key: '5',
    label: 'Logout',
    icon: <LogoutOutlined />,
    danger: true,
  },
];

const DropdownUser: React.FC = () => (
  <Dropdown menu={{ items }} placement="bottomRight">
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        <div className="cursor-pointer w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <UserIcon size={16} />
       </div>
        <span className="cursor-pointer font-medium text-gray-700">Pengguna</span>
      </Space>
    </a>
  </Dropdown>
);

export default DropdownUser;