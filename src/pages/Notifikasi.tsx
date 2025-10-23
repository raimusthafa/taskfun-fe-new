import { Card, Button, Tag, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const dummyInvites = [
  {
    id: 1,
    taskName: "Design Landing Page",
    inviterName: "Raihan Musthafa",
    status: "pending",
  },
  {
    id: 2,
    taskName: "API Integration",
    inviterName: "Dewi Rahma",
    status: "accepted",
  },
  {
    id: 3,
    taskName: "Testing Feature Login",
    inviterName: "Budi Santoso",
    status: "rejected",
  },
];

export default function Notifications() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Title level={3} className="mb-6">
        Notifikasi Undangan
      </Title>

      {dummyInvites.map((invite) => (
        <Card
          key={invite.id}
          className="mb-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
        >
          <div className="flex justify-between items-center">
            {/* Kiri: Detail undangan */}
            <div>
              <Text strong className="text-lg block">
                {invite.taskName}
              </Text>
              <div className="flex items-center gap-1 text-gray-500 mt-1">
                <UserOutlined />
                <Text className="text-sm">Dari {invite.inviterName}</Text>
              </div>
            </div>

            {/* Kanan: Status / Aksi */}
            <div className="text-right">
              {invite.status === "pending" && (
                <div className="flex gap-2">
                  <Button type="primary" size="small">
                    Terima
                  </Button>
                  <Button danger size="small">
                    Tolak
                  </Button>
                </div>
              )}

              {invite.status === "accepted" && (
                <Tag color="green" className="text-sm">
                  Diterima
                </Tag>
              )}

              {invite.status === "rejected" && (
                <Tag color="red" className="text-sm">
                  Ditolak
                </Tag>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
