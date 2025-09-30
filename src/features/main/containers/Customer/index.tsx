import { SvgReloadIcon, SvgSearchIcon } from '@/assets';
import { customerKeys } from '@/features/main/react-query';
import { Button } from '@/lib';
import BasePageLayout from '@/lib/components/BasePageLayout';
import { queryClient } from '@/providers/ReactQuery';
import { useCommonHook } from './hook';
import {
  CreateCustomerModal,
  DetailCustomerModal,
  CustomerTable,
} from './components';

const CustomerContainer = () => {
  const {
    ref,
    record,
    setRecord,
    queryParams,
    setQueryParams,
    isCustomerListLoading,
  } = useCommonHook();

  return (
    <BasePageLayout
      searchProps={{
        defaultValue: queryParams.searchTerm,
        placeholder: 'Tìm kiếm',
        prefix: <SvgSearchIcon />,
        onSearchChange: (value) => {
          setQueryParams({
            ...queryParams,
            searchTerm: value.trim().toLowerCase(),
          });
        },
      }}
      headerActions={
        <>
          <Button
            icon={<SvgReloadIcon width={16} height={16} />}
            disabled={isCustomerListLoading}
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: customerKeys.all,
              });
            }}
          />
          <CreateCustomerModal />
        </>
      }
      tableArea={
        <>
          <CustomerTable ref={ref} setRecord={setRecord} />
          <DetailCustomerModal ref={ref} record={record} />
        </>
      }
    />
  );
};

export { CustomerContainer };
