import { Flex, Layout, LayoutContent, LayoutHeader, Text } from '@/lib';

import { Outlet, useNavigate } from 'react-router-dom';
import { Root } from './styles';
import { LayoutMenu, UserDropDown } from './components';
import { SvgNexamartHorizontalIcon } from '@/assets';
import { useState } from 'react';
import { ROUTE_PATH } from '@/common';

const BaseLayout = () => {
  const [pageLabel, setPageLabel] = useState<string>('');
  const navigate = useNavigate();
  return (
    <Root>
      <Layout>
        <LayoutHeader>
          <Flex
            align="center"
            justify="space-between"
            style={{ height: '100%' }}
          >
            <Flex align="flex-end" gap={8}>
              <SvgNexamartHorizontalIcon
                onClick={() => {
                  navigate(ROUTE_PATH.ADMIN.DASHBOARD.PATH());
                }}
                style={{ cursor: 'pointer' }}
              />
              <Text style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
                {pageLabel}
              </Text>
            </Flex>
            <Flex align="center" gap={12}>
              <UserDropDown />
            </Flex>
          </Flex>
        </LayoutHeader>
        <LayoutMenu setPageLabel={setPageLabel} />
        <LayoutContent>
          <Outlet />
        </LayoutContent>
      </Layout>
    </Root>
  );
};

export default BaseLayout;
