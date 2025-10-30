import { Typography } from "antd";
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
