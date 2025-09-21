import { ROUTE_PATH, useRoutePath } from '@/common';
import { Flex, type IMenuProps, Link, Menu } from '@/lib';
import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

const LayoutMenu = () => {
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
      [ROUTE_PATH.ADMIN.DASHBOARD.PATH()]: {
        key: ROUTE_PATH.ADMIN.DASHBOARD.PATH(),
        label: 'dashboard',
      },
      [ROUTE_PATH.ADMIN.PRODUCT.PATH()]: {
        key: ROUTE_PATH.ADMIN.PRODUCT.PATH(),
        label: 'Danh sách sản phẩm',
      },
      [ROUTE_PATH.ADMIN.EMPLOYEE.PATH()]: {
        key: ROUTE_PATH.ADMIN.EMPLOYEE.PATH(),
        label: 'Danh sách nhân viên',
      },
      [ROUTE_PATH.ADMIN.STOCK_TAKE.PATH()]: {
        key: ROUTE_PATH.ADMIN.STOCK_TAKE.PATH(),
        label: 'Kiểm kho',
      },
      [ROUTE_PATH.ADMIN.SUPPLIER.PATH()]: {
        key: ROUTE_PATH.ADMIN.SUPPLIER.PATH(),
        label: 'Nhà cung cấp',
      },
    };
  }, []);

  const menuItems: IMenuProps['items'] = useMemo(
    () => [
      {
        key: routePathMapping[ROUTE_PATH.ADMIN.DASHBOARD.PATH()].key,
        label: (
          <Link to={ROUTE_PATH.ADMIN.DASHBOARD.PATH()}>
            {routePathMapping[ROUTE_PATH.ADMIN.DASHBOARD.PATH()].label}
          </Link>
        ),
      },
      {
        key: 'sub1',
        label: 'Sản phẩm',
        children: [
          {
            key: '1-1',
            label: 'Sản phẩm',
            type: 'group',
            children: [
              {
                key: routePathMapping[ROUTE_PATH.ADMIN.PRODUCT.PATH()].key,
                label: (
                  <Link to={ROUTE_PATH.ADMIN.PRODUCT.PATH()}>
                    {routePathMapping[ROUTE_PATH.ADMIN.PRODUCT.PATH()].label}
                  </Link>
                ),
              },
            ],
          },
          {
            key: '1-2',
            label: 'Kho hàng',
            type: 'group',
            children: [
              {
                key: routePathMapping[ROUTE_PATH.ADMIN.STOCK_TAKE.PATH()].key,
                label: (
                  <Link to={ROUTE_PATH.ADMIN.STOCK_TAKE.PATH()}>
                    {routePathMapping[ROUTE_PATH.ADMIN.STOCK_TAKE.PATH()].label}
                  </Link>
                ),
              },
            ],
          },
        ],
      },
      {
        key: routePathMapping[ROUTE_PATH.ADMIN.SUPPLIER.PATH()].key,
        label: 'Quản lý kho',
        children: [
          {
            key: '5',
            label: (
              <Link to={ROUTE_PATH.ADMIN.SUPPLIER.PATH()}>
                {routePathMapping[ROUTE_PATH.ADMIN.SUPPLIER.PATH()].label}
              </Link>
            ),
          },
        ],
      },
      {
        key: routePathMapping[ROUTE_PATH.ADMIN.EMPLOYEE.PATH()].key,
        label: 'Nhân viên',
        children: [
          {
            key: '5',
            label: (
              <Link to={ROUTE_PATH.ADMIN.EMPLOYEE.PATH()}>
                {routePathMapping[ROUTE_PATH.ADMIN.EMPLOYEE.PATH()].label}
              </Link>
            ),
          },
        ],
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
        mode="horizontal"
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
