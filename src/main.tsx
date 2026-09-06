import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider, App as AntdApp } from 'antd';
import { ToastConfigurator } from './lib/toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 8,
          fontFamily: 'inherit',
        },
      }}
    >
      <AntdApp>
        <ToastConfigurator />
        <App />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
)

