import { Flex, Menu, Text } from '@/lib';
import styled from 'styled-components';

export const LogoWrapper = styled(Flex)`
  height: 54px;
  padding: 0 20px;
  overflow: hidden;
`;

export const TriggerButton = styled(Flex)`
  max-width: 202px;
  width: 100%;
  height: 32px;
  background: #0a1f441a;
  border-radius: 8px;
`;

interface ITriggerButtonTextProps {
  $collapsed: boolean;
}

export const TriggerButtonText = styled(Text)<ITriggerButtonTextProps>`
  font-size: 13px;
  font-weight: 500;
  color: #0a1f44;
  display: ${(props) => (props.$collapsed ? 'none' : 'block')};
  white-space: nowrap;
`;

export const MenuStyle = styled(Menu)`
  .ant-menu-submenu-popup .ant-menu {
    display: flex !important;
    flex-direction: row !important;
  }
`;
