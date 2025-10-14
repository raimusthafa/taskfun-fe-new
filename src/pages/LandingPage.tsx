import { Layout, Typography, Row, Col, Card } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Highlighter } from '@/components/ui/highlighter';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { BackgroundLines } from '@/components/ui/background-lines';
import Navbar from '@/components/Navbar';

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const LandingPage = () => {

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
      <Navbar/>

      <Content style={{ padding: '80px 50px', textAlign: 'center' }}>
        <BackgroundLines>

        <div>
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
        </div>
        </BackgroundLines>

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

    <div className="mt-32 text-center">
  <Title level={2}>How It Works</Title>
  <Paragraph style={{ color: "#555", maxWidth: 700, margin: "0 auto 40px" }}>
    Get started with TaskFun in just a few easy steps — stay focused and achieve more every day.
  </Paragraph>

  <Row gutter={[32, 32]} justify="center">
    {[
      { step: "1", title: "Sign Up", desc: "Create your free account in seconds." },
      { step: "2", title: "Add Your Tasks", desc: "Organize your projects and set priorities." },
      { step: "3", title: "Track Progress", desc: "Monitor your achievements effortlessly." },
    ].map((item) => (
      <Col xs={24} sm={12} md={6} key={item.step}>
        <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <div className="text-4xl font-bold text-blue-500 mb-3">{item.step}</div>
          <Title level={4}>{item.title}</Title>
          <Paragraph style={{ color: "#555" }}>{item.desc}</Paragraph>
        </div>
      </Col>
    ))}
  </Row>
</div>

<div className="mt-32 text-center">
  <Title level={2}>Why Choose TaskFun?</Title>
  <Paragraph style={{ color: "#555", maxWidth: 700, margin: "0 auto 40px" }}>
    Designed to make your daily workflow smoother, faster, and more enjoyable.
  </Paragraph>

  <Row gutter={[32, 32]} justify="center">
    {[
      { icon: "⚡", title: "Fast & Lightweight", desc: "Built with performance in mind." },
      { icon: "🔒", title: "Secure & Reliable", desc: "Your data stays safe and private." },
      { icon: "🌈", title: "Beautiful UI", desc: "Enjoy a delightful and intuitive interface." },
      { icon: "🤝", title: "Collaboration Ready", desc: "Work together with your teammates easily." },
    ].map((item, i) => (
      <Col xs={24} sm={12} md={6} key={i}>
        <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <div className="text-4xl mb-2">{item.icon}</div>
          <Title level={4}>{item.title}</Title>
          <Paragraph style={{ color: "#555" }}>{item.desc}</Paragraph>
        </div>
      </Col>
    ))}
  </Row>
</div>

<div className="mt-32 text-center">
  <Title level={2}>What Our Users Say</Title>
  <Row gutter={[32, 32]} justify="center" style={{ marginTop: 40 }}>
    {[
      { name: "Alya", role: "Project Manager", text: "TaskFun keeps my team organized and motivated every day!" },
      { name: "Dimas", role: "Freelancer", text: "A minimalist task app that actually makes me more productive." },
      { name: "Sarah", role: "Student", text: "I finally manage deadlines easily without stress." },
    ].map((t, i) => (
      <Col xs={22} md={7} key={i}>
        <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
          <Paragraph style={{ fontStyle: "italic" }}>"{t.text}"</Paragraph>
          <Paragraph strong>- {t.name}, {t.role}</Paragraph>
        </Card>
      </Col>
    ))}
  </Row>
</div>

<div className="mt-32 py-16 text-center bg-gray-50 rounded-2xl">
  <Title level={2}>Ready to Supercharge Your Productivity?</Title>
  <Paragraph style={{ color: "#555", maxWidth: 700, margin: "20px auto" }}>
    Join thousands of users who are getting more done with TaskFun.
  </Paragraph>
  <Link to="/register">
    <RainbowButton>Get Started for Free</RainbowButton>
  </Link>
</div>


        {/* 
        <div style={{ marginTop: 100 }}>
          <Title level={2}>Tampilan Antarmuka</Title>
          <img
            src="/preview-dashboard.png"
            alt="Preview Dashboard"
            style={{ maxWidth: '90%', height: 'auto', marginTop: 30, borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
        </div> */}
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        © 2025 TaskFun — Dibuat dengan ❤️ oleh emkaaaa
      </Footer>
    </Layout>
  );
};

export default LandingPage;
