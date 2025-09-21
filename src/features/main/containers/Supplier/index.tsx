import { SvgReloadIcon, SvgSearchIcon } from '@/assets';
import { supplierKeys } from '@/features/main/react-query';
import { Button } from '@/lib';
import BasePageLayout from '@/lib/components/BasePageLayout';
import { queryClient } from '@/providers/ReactQuery';
import { useCommonHook } from './hook';
import {
  CreateSupplierModal,
  DetailSupplierModal,
  SupplierTable,
} from './components';

const SupplierContainer = () => {
  const {
    ref,
    record,
    setRecord,
    queryParams,
    setQueryParams,
    isSupplierListLoading,
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
            disabled={isSupplierListLoading}
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: supplierKeys.all,
              });
            }}
          />
          <CreateSupplierModal />
        </>
      }
      tableArea={
        <>
          <SupplierTable ref={ref} setRecord={setRecord} />
          <DetailSupplierModal ref={ref} record={record} />
        </>
      }
    />
  );
};

export { SupplierContainer };
