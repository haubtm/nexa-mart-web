import { SvgReloadIcon, SvgSearchIcon } from '@/assets';
import { stockTakeKeys } from '@/features/main/react-query';
import { Button } from '@/lib';
import BasePageLayout from '@/lib/components/BasePageLayout';
import { queryClient } from '@/providers/ReactQuery';
import { useCommonHook } from './hook';
import { StockTakeHistoryTable, CreateStockTakeModal } from './components';

const StockTakeContainer = () => {
  const {
    ref,
    setRecord,
    queryParams,
    setQueryParams,
    isStockTakeListLoading,
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
            disabled={isStockTakeListLoading}
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: stockTakeKeys.all,
              });
            }}
          />
          <CreateStockTakeModal />
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
