import { SvgReloadIcon, SvgSearchIcon } from '@/assets';
import { priceKeys } from '@/features/main/react-query';
import { Button } from '@/lib';
import BasePageLayout from '@/lib/components/BasePageLayout';
import { queryClient } from '@/providers/ReactQuery';
import { useCommonHook } from './hook';
import { CreatePriceModal, PriceTable } from './components';

const PriceContainer = () => {
  const { queryParams, setQueryParams, isPriceListLoading } = useCommonHook();

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
            disabled={isPriceListLoading}
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: priceKeys.all,
              });
            }}
          />
          <CreatePriceModal />
        </>
      }
      tableArea={
        <>
          <PriceTable
          // ref={ref} setRecord={setRecord}
          />
        </>
      }
    />
  );
};

export { PriceContainer };
