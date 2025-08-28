import { type ReactNode, useEffect, useState } from 'react';
import { Text } from '../../typography';
import { Root } from './styles';
import Flex from '../../Flex';

export interface ITableSelectionActionsBarProps {
  selectedCount: number;
  selectedText?: string;
  actionButtons?: ReactNode;
}

const TableSelectionActionsBar = (props: ITableSelectionActionsBarProps) => {
  const { selectedCount, selectedText, actionButtons } = props;
  const [keepShow, setKeepShow] = useState(false);

  useEffect(() => {
    if (selectedCount > 0) {
      setKeepShow(true);
    }
  }, [selectedCount]);

  return (
    <Root
      align="center"
      justify="space-between"
      $hidden={selectedCount <= 0 && !keepShow}
    >
      <Text italic>{selectedText ?? `Đã chọn ${selectedCount} bản ghi1`}</Text>
      <Flex gap={8}>{actionButtons}</Flex>
    </Root>
  );
};

export default TableSelectionActionsBar;
