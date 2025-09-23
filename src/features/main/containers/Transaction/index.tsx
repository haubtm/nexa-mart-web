import { SvgReloadIcon, SvgSearchIcon } from '@/assets';
import { warehouseKeys } from '@/features/main/react-query';
import { Button } from '@/lib';
import BasePageLayout from '@/lib/components/BasePageLayout';
import { queryClient } from '@/providers/ReactQuery';
import { useCommonHook } from './hook';
import { TransactionTable } from './components';

const TransactionContainer = () => {
  const {
    ref,
    setRecord,
    queryParams,
    setQueryParams,
    isTransactionListLoading,
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
            disabled={isTransactionListLoading}
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: warehouseKeys.all,
              });
            }}
          />
        </>
      }
      tableArea={
        <>
          <TransactionTable ref={ref} setRecord={setRecord} />
        </>
      }
    />
  );
};

export { TransactionContainer };
