import { Link as ReactLink } from 'react-router-dom';
import styled from 'styled-components';

export const Root = styled(ReactLink)`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.color};
`;
