import { Layout, Button, Typography, Row, Col, Card } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, TeamOutlined, LoginOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const LandingPage = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ backgroundColor: '#fff', boxShadow: '0 2px 8px #f0f1f2', zIndex: 1000 }}>
        <div className="logo" style={{ float: 'left', fontWeight: 'bold', fontSize: 20 }}>
          TaskFun
        </div>
        <div style={{ float: 'right' }}>
          <Link to="/login">
            <Button type="primary" icon={<LoginOutlined />} size="large">
              Login
            </Button>
          </Link>
        </div>
      </Header>

      <Content style={{ padding: '80px 50px', textAlign: 'center' }}>
        <Title level={1}>Kelola Tugasmu dengan Mudah dan Cepat</Title>
        <Paragraph style={{ maxWidth: 600, margin: '0 auto 40px' }}>
          TaskFun adalah aplikasi manajemen tugas yang membantu kamu tetap fokus, teratur, dan produktif setiap hari.
        </Paragraph>
        <Link to="/login">
          <Button type="primary" size="large" icon={<LoginOutlined />}>
            Mulai Sekarang
          </Button>
        </Link>

        {/* Fitur Section */}
        <div style={{ marginTop: 80 }}>
          <Title level={2}>Fitur Unggulan</Title>
          <Row gutter={[24, 24]} justify="center" style={{ marginTop: 30 }}>
            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} hoverable>
                <CheckCircleOutlined style={{ fontSize: 36, color: '#1890ff' }} />
                <Title level={4}>Manajemen Tugas</Title>
                <Paragraph>Tambahkan, tandai, dan hapus tugas dengan mudah.</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} hoverable>
                <ClockCircleOutlined style={{ fontSize: 36, color: '#1890ff' }} />
                <Title level={4}>Deadline Reminder</Title>
                <Paragraph>Ingatkan kamu tentang deadline yang mendekat.</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} hoverable>
                <TeamOutlined style={{ fontSize: 36, color: '#1890ff' }} />
                <Title level={4}>Kolaborasi Tim</Title>
                <Paragraph>Kerja sama dalam proyek bersama tim kamu.</Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Preview Dashboard Section */}
        <div style={{ marginTop: 100 }}>
          <Title level={2}>Tampilan Antarmuka</Title>
          <img
            src="/preview-dashboard.png"
            alt="Preview Dashboard"
            style={{ maxWidth: '90%', height: 'auto', marginTop: 30, borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        © 2025 TaskFun — Dibuat dengan ❤️ oleh emkaaaa
      </Footer>
    </Layout>
  );
};

export default LandingPage;
