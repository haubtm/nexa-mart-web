import { Divider, Flex, Button } from '@/lib';
import styled from 'styled-components';

export const DropDownWrapper = styled(Flex)`
  height: auto;
  padding: 16px;
  overflow: hidden;
  gap: 16px;
  width: 320px;
  align-items: center;
  justify-content: flex-start;
  background-color: white;
  flex-direction: column;
`;
export const StyledButton = styled(Button)`
  border: none;
  box-shadow: none;
  .right-icon {
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  &:hover .right-icon,
  &:focus .right-icon {
    opacity: 1;
  }
  &:hover,
  &:focus {
    border: 1px solid;
    box-shadow: none;
  }
`;

export const StyledDivider = styled(Divider)`
  margin: 64px 0 16px 0;
  background: #0a1f441a;
`;
