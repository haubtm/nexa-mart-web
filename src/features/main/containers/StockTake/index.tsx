import { SvgReloadIcon, SvgSearchIcon } from '@/assets';
import { inventoryKeys } from '@/features/main/react-query';
import { Button } from '@/lib';
import BasePageLayout from '@/lib/components/BasePageLayout';
import { queryClient } from '@/providers/ReactQuery';
import { useCommonHook } from './hook';
import { StockTakeHistoryTable } from './components';

const StockTakeContainer = () => {
  const {
    ref,
    setRecord,
    queryParams,
    setQueryParams,
    isInventoryListLoading,
  } = useCommonHook();

  return (
    <BasePageLayout
      searchProps={{
        defaultValue: queryParams.search,
        placeholder: 'Tìm kiếm',
        prefix: <SvgSearchIcon />,
        onSearchChange: (value) => {
          setQueryParams({
            ...queryParams,
            search: value.trim().toLowerCase(),
          });
        },
      }}
      headerActions={
        <>
          <Button
            icon={<SvgReloadIcon width={16} height={16} />}
            disabled={isInventoryListLoading}
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: inventoryKeys.all,
              });
            }}
          />
        </>
      }
      tableArea={
        <>
          <StockTakeHistoryTable ref={ref} setRecord={setRecord} />
        </>
      }
    />
  );
};

export { StockTakeContainer };
