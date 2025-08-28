import { Table as AntdTable } from 'antd';
import styled from 'styled-components';
import Flex from '../../Flex';

export const Root = styled(Flex)``;

export const StyledTable = styled(AntdTable)`
  .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(
      .ant-table-row-expand-icon-cell
    ):not([colspan])::before {
    display: none;
  }

  .ant-table-pagination.ant-pagination {
    margin: 16px 0 0 0;
  }
`;

interface SelectionActionsBarProps {
  $hidden?: boolean;
}

export const SelectionActionsBar = styled(Flex)<SelectionActionsBarProps>`
  background: #fafafa;
  padding: 12px 24px;
  border-radius: 6px;
  ${({ $hidden }) => $hidden && 'display: none;'}
`;
