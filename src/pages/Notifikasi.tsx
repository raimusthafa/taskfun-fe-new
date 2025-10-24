import { Card, Button, Tag, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import InviteComponent from "@/components/notifikasi/invite";

const { Title } = Typography;

export default function Notifications() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Title level={3} className="mb-6">
        Notifikasi Undangan
      </Title>
      <InviteComponent/>
    </div>
  );
}
