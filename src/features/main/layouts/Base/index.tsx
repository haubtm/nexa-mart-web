import { Flex, Layout, LayoutContent, LayoutHeader } from '@/lib';

import { Outlet } from 'react-router-dom';
import { Root } from './styles';
import Logo from '@/assets/svg_nexamart _horizontal.svg';
import { LayoutMenu } from './components';

const BaseLayout = () => {
  return (
    <Root>
      <Layout>
        <LayoutHeader>
          <Flex
            align="center"
            justify="space-between"
            style={{ height: '100%' }}
          >
            <img src={Logo} alt="Logo" />

            <Flex align="center" gap={12}>
              Avatar
            </Flex>
          </Flex>
        </LayoutHeader>
        <LayoutMenu />
        <LayoutContent>
          <Outlet />
        </LayoutContent>
      </Layout>
    </Root>
  );
};

export default BaseLayout;
