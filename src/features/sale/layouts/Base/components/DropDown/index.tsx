import { Dropdown, Avatar, Space, Row } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link, Flex, clearStorage, useModal, BaseText } from '@/lib';
import { BaseAvatar } from '@/lib/components/BaseAvatar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { resetProfile } from '@/redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/common';
import { DropDownWrapper, StyledDivider, StyledButton } from './styles';
import {
  SvgAccountIcon,
  SvgLogoutIcon,
  SvgDatabaseIcon,
  SvgKeyIcon,
} from '@/assets';
const UserDropdown = () => {
  const user = useAppSelector((state) => state.user).profile;
  const dispatch = useAppDispatch();

  const { modal } = useModal();
  const navigate = useNavigate();
  const handleLogout = () => {
    return modal('confirm', {
      title: 'Đăng xuất',
      content: 'Bạn chắc chắn muốn đăng xuất?',
      onOk: () => {
        dispatch(resetProfile());
        clearStorage();
        navigate(ROUTE_PATH.AUTH.LOGIN.PATH());
      },
    });
  };
  const customItems = [
    {
      key: 'profile',
      icon: <SvgDatabaseIcon />,
      label: 'Quản trị hệ thống',
      to: ROUTE_PATH.ADMIN.DASHBOARD.PATH(),
    },
    {
      key: 'change-password',
      icon: <SvgKeyIcon />,
      label: 'Đổi mật khẩu',
      to: ROUTE_PATH.ADMIN.DASHBOARD.PATH(),
    },
    {
      key: 'account-settings',
      icon: <SvgAccountIcon />,
      label: 'Thiết lập tài khoản',
      to: ROUTE_PATH.ADMIN.DASHBOARD.PATH(),
    },
    {
      key: 'logout',
      icon: <SvgLogoutIcon />,
      label: 'Đăng xuất',
      isDanger: true,
      onClick: handleLogout,
    },
  ];
  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      arrow
      popupRender={() => (
        <DropDownWrapper>
          <Avatar size={40}>{user?.name?.[0]}</Avatar>
          <BaseText fontSize={'xxxl'} fontWeight={'semibold'}>
            {user?.name}
          </BaseText>

          {customItems.map((item) =>
            item.to ? (
              <Link key={item.key} to={item.to} style={{ width: '100%' }}>
                <StyledButton
                  variant="solid"
                  type="default"
                  block
                  style={{ padding: '8px 12px' }}
                >
                  <Flex
                    justify="space-between"
                    align="center"
                    style={{ width: '100%' }}
                  >
                    <Flex align="center" gap={8}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Flex>
                    <Flex align="center" gap={4}>
                      <RightOutlined className="right-icon" />
                    </Flex>
                  </Flex>
                </StyledButton>
              </Link>
            ) : (
              <Row key={item.key} style={{ width: '100%' }}>
                <StyledDivider />
                <StyledButton
                  type="default"
                  icon={item.icon}
                  block
                  onClick={item.onClick}
                  style={{ justifyContent: 'center' }}
                >
                  {item.label}
                </StyledButton>
              </Row>
            ),
          )}
        </DropDownWrapper>
      )}
    >
      <Space style={{ cursor: 'pointer' }}>
        <BaseAvatar alt={user?.name?.[0]} size={32} />
      </Space>
    </Dropdown>
  );
};

export default UserDropdown;
