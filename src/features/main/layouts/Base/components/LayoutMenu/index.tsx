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
      [ROUTE_PATH.ADMIN.DASHBOARD.PATH()]: {
        key: ROUTE_PATH.ADMIN.DASHBOARD.PATH(),
        label: 'Tổng quan',
      },
      [ROUTE_PATH.ADMIN.PRODUCT.PATH()]: {
        key: ROUTE_PATH.ADMIN.PRODUCT.PATH(),
        label: 'Danh sách sản phẩm',
      },
      [ROUTE_PATH.ADMIN.PROMOTION.PATH()]: {
        key: ROUTE_PATH.ADMIN.PROMOTION.PATH(),
        label: 'Khuyến mãi',
      },
      [ROUTE_PATH.ADMIN.CUSTOMER.PATH()]: {
        key: ROUTE_PATH.ADMIN.CUSTOMER.PATH(),
        label: 'Danh sách khách hàng',
      },
      [ROUTE_PATH.ADMIN.EMPLOYEE.PATH()]: {
        key: ROUTE_PATH.ADMIN.EMPLOYEE.PATH(),
        label: 'Danh sách nhân viên',
      },
      [ROUTE_PATH.ADMIN.PRICE.PATH()]: {
        key: ROUTE_PATH.ADMIN.PRICE.PATH(),
        label: 'Thiết lập giá',
      },
      [ROUTE_PATH.ADMIN.TRANSACTION.PATH()]: {
        key: ROUTE_PATH.ADMIN.TRANSACTION.PATH(),
        label: 'Lịch sử kho',
      },
      [ROUTE_PATH.ADMIN.STOCK_TAKE.PATH()]: {
        key: ROUTE_PATH.ADMIN.STOCK_TAKE.PATH(),
        label: 'Kiểm kho',
      },
      [ROUTE_PATH.ADMIN.SUPPLIER.PATH()]: {
        key: ROUTE_PATH.ADMIN.SUPPLIER.PATH(),
        label: 'Nhà cung cấp',
      },
      [ROUTE_PATH.ADMIN.IMPORTS.PATH()]: {
        key: ROUTE_PATH.ADMIN.IMPORTS.PATH(),
        label: 'Nhập kho',
      },
      [ROUTE_PATH.ADMIN.IMPORTS.PATH()]: {
        key: ROUTE_PATH.ADMIN.IMPORTS.PATH(),
        label: 'Nhập kho',
      },
      [ROUTE_PATH.ADMIN.WAREHOUSE.PATH()]: {
        key: ROUTE_PATH.ADMIN.WAREHOUSE.PATH(),
        label: 'Tồn kho',
      },
      [ROUTE_PATH.ADMIN.REPORT.PATH()]: {
        key: ROUTE_PATH.ADMIN.REPORT.PATH(),
        label: 'Doanh số',
      },
      [ROUTE_PATH.ADMIN.ORDER.PATH()]: {
        key: ROUTE_PATH.ADMIN.ORDER.PATH(),
        label: 'Danh sách bán hàng',
      },
      [ROUTE_PATH.ADMIN.REFUND.PATH()]: {
        key: ROUTE_PATH.ADMIN.REFUND.PATH(),
        label: 'Danh sách trả hàng',
      },
      [ROUTE_PATH.ADMIN.ORDER_ADMIN.PATH()]: {
        key: ROUTE_PATH.ADMIN.ORDER_ADMIN.PATH(),
        label: 'Danh sách đơn đặt hàng',
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
        key: 'product',
        label: 'Sản phẩm',
        children: [
          {
            key: routePathMapping[ROUTE_PATH.ADMIN.PRODUCT.PATH()].key,
            label: (
              <Link to={ROUTE_PATH.ADMIN.PRODUCT.PATH()}>
                {routePathMapping[ROUTE_PATH.ADMIN.PRODUCT.PATH()].label}
              </Link>
            ),
          },
          {
            key: routePathMapping[ROUTE_PATH.ADMIN.PRICE.PATH()].key,
            label: (
              <Link to={ROUTE_PATH.ADMIN.PRICE.PATH()}>
                {routePathMapping[ROUTE_PATH.ADMIN.PRICE.PATH()].label}
              </Link>
            ),
          },
          {
            key: routePathMapping[ROUTE_PATH.ADMIN.PROMOTION.PATH()].key,
            label: (
              <Link to={ROUTE_PATH.ADMIN.PROMOTION.PATH()}>
                {routePathMapping[ROUTE_PATH.ADMIN.PROMOTION.PATH()].label}
              </Link>
            ),
          },
        ],
      },
      {
        key: 'stock_management',
        label: 'Quản lý kho',
        children: [
          {
            key: routePathMapping[ROUTE_PATH.ADMIN.SUPPLIER.PATH()].key,
            label: (
              <Link to={ROUTE_PATH.ADMIN.SUPPLIER.PATH()}>
                {routePathMapping[ROUTE_PATH.ADMIN.SUPPLIER.PATH()].label}
              </Link>
            ),
          },
          {
            key: routePathMapping[ROUTE_PATH.ADMIN.STOCK_TAKE.PATH()].key,
            label: (
              <Link to={ROUTE_PATH.ADMIN.STOCK_TAKE.PATH()}>
                {routePathMapping[ROUTE_PATH.ADMIN.STOCK_TAKE.PATH()].label}
              </Link>
            ),
          },
          {
            key: routePathMapping[ROUTE_PATH.ADMIN.IMPORTS.PATH()].key,
            label: (
              <Link to={ROUTE_PATH.ADMIN.IMPORTS.PATH()}>
                {routePathMapping[ROUTE_PATH.ADMIN.IMPORTS.PATH()].label}
              </Link>
            ),
          },
          {
            key: routePathMapping[ROUTE_PATH.ADMIN.TRANSACTION.PATH()].key,
            label: (
              <Link to={ROUTE_PATH.ADMIN.TRANSACTION.PATH()}>
                {routePathMapping[ROUTE_PATH.ADMIN.TRANSACTION.PATH()].label}
              </Link>
            ),
          },
          {
            key: routePathMapping[ROUTE_PATH.ADMIN.WAREHOUSE.PATH()].key,
            label: (
              <Link to={ROUTE_PATH.ADMIN.WAREHOUSE.PATH()}>
                {routePathMapping[ROUTE_PATH.ADMIN.WAREHOUSE.PATH()].label}
              </Link>
            ),
          },
        ],
      },
      {
        key: 'report',
        label: 'Báo cáo',
        children: [
          {
            key: routePathMapping[ROUTE_PATH.ADMIN.REPORT.PATH()].key,
            label: (
              <Link to={ROUTE_PATH.ADMIN.REPORT.PATH()}>
                {routePathMapping[ROUTE_PATH.ADMIN.REPORT.PATH()].label}
              </Link>
            ),
          },
        ],
      },
      {
        key: 'order',
        label: 'Đơn hàng',
        children: [
          {
            key: routePathMapping[ROUTE_PATH.ADMIN.ORDER.PATH()].key,
            label: (
              <Link to={ROUTE_PATH.ADMIN.ORDER.PATH()}>
                {routePathMapping[ROUTE_PATH.ADMIN.ORDER.PATH()].label}
              </Link>
            ),
          },
          {
            key: routePathMapping[ROUTE_PATH.ADMIN.REFUND.PATH()].key,
            label: (
              <Link to={ROUTE_PATH.ADMIN.REFUND.PATH()}>
                {routePathMapping[ROUTE_PATH.ADMIN.REFUND.PATH()].label}
              </Link>
            ),
          },
          {
            key: routePathMapping[ROUTE_PATH.ADMIN.ORDER_ADMIN.PATH()].key,
            label: (
              <Link to={ROUTE_PATH.ADMIN.ORDER_ADMIN.PATH()}>
                {routePathMapping[ROUTE_PATH.ADMIN.ORDER_ADMIN.PATH()].label}
              </Link>
            ),
          },
        ],
      },
      {
        key: 'employee',
        label: 'Nhân viên',
        children: [
          {
            key: routePathMapping[ROUTE_PATH.ADMIN.EMPLOYEE.PATH()].key,
            label: (
              <Link to={ROUTE_PATH.ADMIN.EMPLOYEE.PATH()}>
                {routePathMapping[ROUTE_PATH.ADMIN.EMPLOYEE.PATH()].label}
              </Link>
            ),
          },
        ],
      },
      {
        key: 'customer',
        label: 'Khách hàng',
        children: [
          {
            key: routePathMapping[ROUTE_PATH.ADMIN.CUSTOMER.PATH()].key,
            label: (
              <Link to={ROUTE_PATH.ADMIN.CUSTOMER.PATH()}>
                {routePathMapping[ROUTE_PATH.ADMIN.CUSTOMER.PATH()].label}
              </Link>
            ),
          },
        ],
      },
    ],
    [selectedKeys],
  );

  return (
    <Flex
      style={{ padding: 10 }}
      justify="space-between"
      align="center"
      gap={10}
    >
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
        style={{ flex: 1 }}
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
