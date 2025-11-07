import type { TableProps as AntdTableProps, TablePaginationConfig } from 'antd';
import { Root, SelectionActionsBar, StyledTable } from './styles';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/lib';
import { type ReactNode, useEffect, useState } from 'react';
import { Text } from '../../typography';
import Flex from '../../Flex';

export interface ITableProps<T = any> extends AntdTableProps<T> {
  selectionBar?: {
    selectedText?: string;
    actionButtons?: ReactNode;
  };
}

const Table = <T,>(props: ITableProps<T>) => {
  const { selectionBar, pagination, bordered, size, rowKey, scroll, ...rest } =
    props;
  const [keepShow, setKeepShow] = useState(false);
  const selectedCount = props.rowSelection?.selectedRowKeys?.length ?? 0;
  useEffect(() => {
    if (selectedCount > 0) {
      setKeepShow(true);
    } else {
      setKeepShow(false);
    }
  }, [selectedCount]);

  return (
    <Root vertical gap={16}>
      {selectedCount > 0 && (
        <SelectionActionsBar
          align="center"
          justify="space-between"
          $hidden={selectedCount <= 0 && !keepShow}
        >
          <Text italic>
            {selectionBar?.selectedText ?? `Đã chọn ${selectedCount} bản ghi`}
          </Text>
          <Flex gap={8}>{selectionBar?.actionButtons}</Flex>
        </SelectionActionsBar>
      )}
      <StyledTable<any>
        rowKey={rowKey ?? 'id'}
        size={size ?? 'small'}
        bordered={bordered ?? false}
        pagination={
          pagination === false
            ? false
            : {
                showSizeChanger: true,
                responsive: true,
                showQuickJumper: true,
                size: 'default',
                position: ['bottomRight'],
                defaultCurrent: DEFAULT_PAGE + 1,
                defaultPageSize: DEFAULT_PAGE_SIZE,
                pageSizeOptions: [20, 50, 100],
                showTotal: (total: number) => `Tổng số ${total} kết quả`,
                ...pagination,
                locale: {
                  items_per_page: `/ ${'Trang'}`,
                  ...(pagination as TablePaginationConfig)?.locale,
                },
              }
        }
        scroll={{
          x: 768,
          ...scroll,
        }}
        {...rest}
      />
    </Root>
  );
};

export default Table;
