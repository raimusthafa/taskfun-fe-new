import { Layout, Button, Typography, Row, Col, Card } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
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

    const features = [
    {
      title: "Task Management",
      description:
        "Easily create, organize, and track your daily tasks with a clean and intuitive interface.",
      image: "/manage.jpg",
      reverse: false,
    },
    {
      title: "Smart Deadline Reminders",
      description:
        "Never miss a deadline again — get automatic reminders and stay on top of your priorities.",
      image: "/deadline.jpg",
      reverse: true,
    },
    {
      title: "Team Collaboration",
      description:
        "Collaborate effortlessly with your teammates and boost productivity together in one workspace.",
      image: "/collab.jpg",
      reverse: false,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Sticky Header */}
      <Header
        className='mx-28 rounded-xl'
        style={{
          position: 'sticky', 
          top: 5,
          zIndex: 1000,
          backgroundColor: '#ffff',
          transition: 'all 0.3s ease',
          boxShadow: isScrolled ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        <div
          style={{
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
              <Button variant='text' color='default'>
                Login
              </Button>
            </Link>
        <Link to="/register">
          <RainbowButton >
            Mulai Sekarang
          </RainbowButton>
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
            Mulai Sekarang <ArrowRightOutlined />
          </RainbowButton>
        </Link>

{/* feature section */}
 <div style={{ marginTop: 100, marginBottom: 100 }}>
      {/* <Title level={2} style={{ textAlign: "center", marginBottom: 60 }}>
        Key Features
      </Title> */}

      {features.map((feature, index) => (
        <Row
          key={index}
          gutter={[48, 48]}
          align="middle"
          justify="center"
          style={{
            marginBottom: 40,
            flexDirection: feature.reverse ? "row-reverse" : "row",
          }}
        >
          <Col xs={22} md={8}>
            <Card
              hoverable
              bordered={false}
              style={{
                overflow: "hidden",
                borderRadius: 20,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              cover={
                <img
                  src={feature.image}
                  alt={feature.title}
                  style={{
                    width: "100%",
                    height: 300,
                    objectFit: "cover",
                    borderRadius: 20,
                  }}
                />
              }
            />
          </Col>

          <Col xs={24} md={10}>
            <div>
              <Title
                level={3}
                style={{
                  fontWeight: 700,
                  color: "#1e293b",
                  marginBottom: 20,
                }}
              >
                {feature.title}
              </Title>
              <Paragraph
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "#475569",
                  maxWidth: 500,
                }}
              >
                {feature.description}
              </Paragraph>
            </div>
          </Col>
        </Row>
      ))}
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
