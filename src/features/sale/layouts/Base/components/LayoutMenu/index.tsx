import { ROUTE_PATH, useRoutePath } from '@/common';
import { Flex, type IMenuProps, Link, Menu } from '@/lib';
import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

interface ILayoutMenuProps {
  setPageLabel: (label: string) => void;
}

const LayoutMenu = ({ setPageLabel }: ILayoutMenuProps) => {
  const isStablePathname = useRef<boolean>(false);
  const { pathname } = useRoutePath();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => {
      isStablePathname.current = true;
    }, 1000);
  }, []);

  useEffect(() => {
    if (routePathMapping[pathname]) {
      setPageLabel(routePathMapping[pathname].label);
      setSelectedKeys([routePathMapping[pathname].key]);
      if (!isStablePathname.current) {
        const initialOpenKeys = routePathMapping[pathname].key
          .split('_')
          .map((_: string, i: number, arr: string[]) =>
            arr.slice(0, i).join('_'),
          )
          .filter(Boolean);

        setTimeout(() => {
          setOpenKeys(initialOpenKeys);
        });
      }
    }
  }, [pathname]);

  const routePathMapping = useMemo(() => {
    return {
      [ROUTE_PATH.SALE.ORDER.PATH()]: {
        key: ROUTE_PATH.SALE.ORDER.PATH(),
        label: 'Bán hàng',
      },
      [ROUTE_PATH.SALE.REFUND.PATH()]: {
        key: ROUTE_PATH.SALE.REFUND.PATH(),
        label: 'Trả hàng',
      },
    };
  }, []);

  const menuItems: IMenuProps['items'] = useMemo(
    () => [
      {
        key: routePathMapping[ROUTE_PATH.SALE.ORDER.PATH()].key,
        label: (
          <Link to={ROUTE_PATH.SALE.ORDER.PATH()}>
            {routePathMapping[ROUTE_PATH.SALE.ORDER.PATH()].label}
          </Link>
        ),
      },
      {
        key: routePathMapping[ROUTE_PATH.SALE.REFUND.PATH()].key,
        label: (
          <Link to={ROUTE_PATH.SALE.REFUND.PATH()}>
            {routePathMapping[ROUTE_PATH.SALE.REFUND.PATH()].label}
          </Link>
        ),
      },
    ],
    [selectedKeys],
  );

  return (
    <Flex vertical style={{ padding: 10 }}>
      <MenuStyle
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={(openKeys) => {
          if (isStablePathname.current) {
            setOpenKeys(openKeys);
          }
        }}
        items={menuItems}
      />
    </Flex>
  );
};

const MenuStyle = styled(Menu)`
  .ant-menu-submenu-popup .ant-menu {
    display: flex !important;
  }
`;

export default LayoutMenu;
