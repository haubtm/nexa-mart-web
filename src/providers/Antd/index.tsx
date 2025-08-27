import type { ReactNode } from 'react';
import { ConfigProvider, type ThemeConfig } from 'antd';
import { App as AntdApp } from '@/lib';
import '@ant-design/v5-patch-for-react-19';

interface IAntdProviderProps {
  children: ReactNode;
}

const AntdProvider = (props: IAntdProviderProps) => {
  const { children } = props;

  const themeConfig: ThemeConfig = {
    token: {
      fontFamily: 'Inter, sans-serif',
      colorPrimary: '#2B499E',
      colorPrimaryBg: '#2b499e1a',
    },
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <AntdApp style={{ width: '100%', height: '100%' }}>{children}</AntdApp>
    </ConfigProvider>
  );
};

export default AntdProvider;
