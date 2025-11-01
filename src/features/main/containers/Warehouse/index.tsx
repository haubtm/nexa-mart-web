import { SvgReloadIcon, SvgSearchIcon } from '@/assets';
import { warehouseKeys } from '@/features/main/react-query';
import { Button } from '@/lib';
import BasePageLayout from '@/lib/components/BasePageLayout';
import { queryClient } from '@/providers/ReactQuery';
import { useCommonHook } from './hook';
import { WarehouseTable } from './components';

const WarehouseContainer = () => {
  const {
    // ref,
    // setRecord,
    queryParams,
    setQueryParams,
    isWarehouseListLoading,
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
            disabled={isWarehouseListLoading}
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
          <WarehouseTable
          //  ref={ref} setRecord={setRecord}
          />
        </>
      }
    />
  );
};

export { WarehouseContainer };
