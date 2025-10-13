import { Layout, Button, Typography, Row, Col, Card } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Highlighter } from '@/components/ui/highlighter';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { useEffect, useState } from 'react';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const LandingPage = () => {

    const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Sticky Header */}
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: '#fff',
          transition: 'all 0.3s ease',
          boxShadow: isScrolled ? '0 2px 12px rgba(0,0,0,0.05)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 64,
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: 22, color: '#111' }}>
            TaskFun
          </div>

          <div>
            <Link to="/login">
              <Button type="text" style={{ marginRight: 20, color: '#111' }}>
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button
                type="primary"
                size="middle"
                style={{
                  backgroundColor: '#16a34a',
                  borderColor: '#16a34a',
                  borderRadius: 24,
                  fontWeight: 500,
                }}
              >
                Start for FREE
              </Button>
            </Link>
          </div>
        </div>
      </Header>

      <Content style={{ padding: '80px 50px', textAlign: 'center' }}>
        <Title level={1} style={{ fontSize: '3.2rem', fontWeight: 700 }}>
          Take The Next Step In Your Productivity
        </Title>

        <Paragraph
          style={{
            maxWidth: 700,
            margin: '20px auto 40px',
            fontSize: 18,
            color: '#555',
          }}
        >
          Nowadays, professionals are expected to have great{' '}
          {/* <Text mark style={{ backgroundColor: '#fef08a' }}>
            organizational, focus, and collaboration skills
          </Text> */}
          <Highlighter action="underline" color="#FF9800">
              organizational, focus, and collaboration skills
          </Highlighter>{" "}
          . TaskFun’s 💡 smart tools help you stay on top of your work and boost
          productivity every day.
        </Paragraph>
        <Link to="/dashboard">
          <RainbowButton >
            Mulai Sekarang
          </RainbowButton>
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
