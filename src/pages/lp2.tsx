import { Layout, Typography, Row, Col, Card } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { RainbowButton } from "@/components/ui/rainbow-button";

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const LandingPage2 = () => {
  const features = [
    {
      icon: "🗂️",
      title: "Task Management",
      desc: "Atur dan pantau tugasmu dengan tampilan sederhana dan efisien.",
    },
    {
      icon: "🔔",
      title: "Deadline Reminder",
      desc: "Jangan lewatkan tenggat waktu penting dengan pengingat otomatis.",
    },
    {
      icon: "👥",
      title: "Kolaborasi Tim",
      desc: "Kerjakan proyek bersama tim tanpa hambatan komunikasi.",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <Navbar />

      {/* HERO */}
      <Content className="bg-gradient-to-b from-blue-50 to-white pt-24 pb-32 text-center">
        <Row justify="center" align="middle" gutter={[64, 32]}>
          <Col xs={24} md={10}>
            <Title level={1} style={{ fontWeight: 700, fontSize: "3rem" }}>
              Kelola Tugasmu dengan Lebih Mudah bersama{" "}
              <span style={{ color: "#1677ff" }}>TaskFun</span>
            </Title>
            <Paragraph
              style={{
                fontSize: 17,
                color: "#555",
                margin: "20px auto",
                maxWidth: 500,
              }}
            >
              Tingkatkan produktivitasmu, atur proyek, dan berkolaborasi dengan
              tim menggunakan satu platform yang cepat dan intuitif.
            </Paragraph>
            <Link to="/register">
              <RainbowButton>
                Mulai Sekarang <ArrowRightOutlined />
              </RainbowButton>
            </Link>
          </Col>

          <Col xs={24} md={10}>
            <img
              src="/ss/dashboardfix.jpg"
              alt="Dashboard Preview"
              style={{
                width: "100%",
                borderRadius: 20,
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              }}
            />
          </Col>
        </Row>
      </Content>

      {/* FEATURES */}
      <div className="py-24 bg-white text-center">
        <Title level={2}>Fitur Utama TaskFun</Title>
        <Paragraph style={{ color: "#555", marginBottom: 60 }}>
          Semua yang kamu butuhkan untuk mengatur tugas dan timmu dengan efektif.
        </Paragraph>

        <Row gutter={[32, 32]} justify="center">
          {features.map((f, i) => (
            <Col xs={22} sm={12} md={6} key={i}>
              <Card
                bordered={false}
                className="rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <div className="text-4xl mb-3">{f.icon}</div>
                <Title level={4}>{f.title}</Title>
                <Paragraph style={{ color: "#555" }}>{f.desc}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* HOW IT WORKS */}
      <div className="py-24 bg-gray-50 text-center">
        <Title level={2}>Cara Kerja</Title>
        <Paragraph style={{ color: "#555", marginBottom: 60 }}>
          Mulai dalam tiga langkah mudah dan nikmati alur kerja yang lebih rapi.
        </Paragraph>

        <Row gutter={[32, 32]} justify="center">
          {[
            { step: "1", title: "Daftar Akun", desc: "Buat akun TaskFun secara gratis." },
            { step: "2", title: "Tambahkan Tugas", desc: "Atur pekerjaan dan prioritasmu." },
            { step: "3", title: "Pantau Progress", desc: "Lihat sejauh mana pencapaianmu." },
          ].map((item) => (
            <Col xs={22} sm={12} md={6} key={item.step}>
              <div className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
                <div className="text-4xl font-bold text-blue-500 mb-3">
                  {item.step}
                </div>
                <Title level={4}>{item.title}</Title>
                <Paragraph style={{ color: "#555" }}>{item.desc}</Paragraph>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* CTA */}
      <div className="py-24 text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-3xl">
        <Title level={2} style={{ color: "white" }}>
          Siap Meningkatkan Produktivitasmu?
        </Title>
        <Paragraph style={{ color: "#f1f5f9", marginBottom: 40 }}>
          Bergabunglah bersama ribuan pengguna TaskFun yang lebih produktif setiap hari.
        </Paragraph>
        <Link to="/register">
          <RainbowButton style={{ backgroundColor: "white", color: "#1677ff" }}>
            Coba Gratis Sekarang
          </RainbowButton>
        </Link>
      </div>

      <Footer style={{ textAlign: "center" }}>
        © 2025 TaskFun — Dibuat dengan ❤️ oleh emkaaaa
      </Footer>
    </Layout>
  );
};

export default LandingPage2;
