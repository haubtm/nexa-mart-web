import { Flex, Layout, LayoutContent, LayoutHeader } from '@/lib';

import { Outlet } from 'react-router-dom';
import { Root } from './styles';
import { LayoutMenu } from './components';
import { SvgNexamartHorizontalIcon } from '@/assets';

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
            <SvgNexamartHorizontalIcon />

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
