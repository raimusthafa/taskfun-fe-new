import { Typography, Tabs } from "antd";
import { UserAddOutlined, TeamOutlined } from "@ant-design/icons";
import InviteComponent from "@/components/notifikasi/invite";
import BoardInviteComponent from "@/components/notifikasi/board-invite";

const { Title } = Typography;

export default function Notifications() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Title level={3} className="mb-6">
        Notifikasi
      </Title>
      <Tabs
        defaultActiveKey="tasks"
        items={[
          {
            key: 'tasks',
            label: (
              <span className="flex items-center gap-2">
                <UserAddOutlined />
                Undangan Task
              </span>
            ),
            children: <InviteComponent />,
          },
          {
            key: 'boards',
            label: (
              <span className="flex items-center gap-2">
                <TeamOutlined />
                Undangan Board
              </span>
            ),
            children: <BoardInviteComponent />,
          },
        ]}
      />
    </div>
  );
}
