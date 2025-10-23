import {
  Flex,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutSider,
  Text,
} from '@/lib';

import { Outlet } from 'react-router-dom';
import { Root } from './styles';
import { LayoutMenu } from './components';
import { SvgNexamartIcon } from '@/assets';
import { useState } from 'react';

const BaseLayout = () => {
  const [pageLabel, setPageLabel] = useState('');

  return (
    <Root>
      <Layout>
        <LayoutHeader>
          <Flex align="center" style={{ height: '100%' }}>
            <Flex style={{ width: '15%' }}>
              <SvgNexamartIcon height={60} width={60} />
            </Flex>
            <Flex
              align="center"
              gap={12}
              justify="space-between"
              style={{ width: '84%' }}
            >
              {/* <UserDropDown /> */}
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                }}
              >
                {pageLabel}
              </Text>
              <span>Xin chào, Nhân viên bán hàng</span>
            </Flex>
          </Flex>
        </LayoutHeader>
        <Layout>
          <LayoutSider>
            <LayoutMenu setPageLabel={setPageLabel} />
          </LayoutSider>
          <LayoutContent>
            <Outlet />
          </LayoutContent>
        </Layout>
      </Layout>
    </Root>
  );
};

export default BaseLayout;
