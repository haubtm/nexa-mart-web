import styled from 'styled-components';
import Flex from '../../Flex';

interface RootProps {
  $hidden?: boolean;
}

export const Root = styled(Flex)<RootProps>`
  background: #fafafa;
  padding: 12px 24px;
  border-radius: 6px;

  ${({ $hidden }) => $hidden && 'display: none;'}
`;
