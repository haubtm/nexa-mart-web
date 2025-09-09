import { Layout, LayoutContent, LayoutSider } from '@/lib';
import { Outlet } from 'react-router-dom';

const SettingContainer = () => {
  return (
    <Layout>
      <LayoutSider width="25%">hello</LayoutSider>
      <LayoutContent>
        <Outlet />
      </LayoutContent>
    </Layout>
  );
};

export { SettingContainer };
