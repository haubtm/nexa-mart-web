import { type ReactNode, useEffect, useState } from 'react';
import Flex from '../Flex';
import { type IInputProps, Input } from '../inputs';
import styled from 'styled-components';
import { useDebounce } from '@/lib/hooks';

interface ISearchProps
  extends Pick<
    IInputProps,
    'placeholder' | 'prefix' | 'style' | 'defaultValue'
  > {
  onSearchChange: (value: string) => void;
}

export interface IBasePageLayoutProps {
  searchProps?: ISearchProps;
  headerActions?: ReactNode;
  tableArea?: ReactNode;
  children?: ReactNode;
}

const BasePageLayout = (props: IBasePageLayoutProps) => {
  const { searchProps, headerActions, tableArea, children } = props;

  const [search, setSearch] = useState<string | undefined>(undefined);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    if (typeof debouncedSearch === 'string') {
      searchProps?.onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <ContainerFlex vertical>
      <HeaderFlex align="center" justify="space-between">
        {searchProps ? (
          <Input
            defaultValue={searchProps.defaultValue}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchProps.placeholder}
            prefix={searchProps.prefix}
            style={{ width: 240, ...searchProps.style }}
          />
        ) : (
          <span></span>
        )}
        <Flex gap={10}>{headerActions}</Flex>
      </HeaderFlex>
      {tableArea}
      {children}
    </ContainerFlex>
  );
};

const ContainerFlex = styled(Flex)`
  background-color: #fff;
  border-radius: 8px;
`;

const HeaderFlex = styled(Flex)`
  padding: 12px 16px;
  height: 100%;
`;

export default BasePageLayout;
