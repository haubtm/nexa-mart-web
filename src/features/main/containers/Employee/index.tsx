import { SvgReloadIcon, SvgSearchIcon } from '@/assets';
import { employeeKeys } from '@/features/main/react-query';
import { Button } from '@/lib';
import BasePageLayout from '@/lib/components/BasePageLayout';
import { queryClient } from '@/providers/ReactQuery';
import { useCommonHook } from './hook';
import {
  CreateEmployeeModal,
  DetailEmployeeModal,
  EmployeeTable,
} from './components';

const EmployeeContainer = () => {
  const {
    ref,
    record,
    setRecord,
    queryParams,
    setQueryParams,
    isEmployeeListLoading,
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
            disabled={isEmployeeListLoading}
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: employeeKeys.all,
              });
            }}
          />
          <CreateEmployeeModal />
        </>
      }
      tableArea={
        <>
          <EmployeeTable ref={ref} setRecord={setRecord} />
          <DetailEmployeeModal ref={ref} record={record} />
        </>
      }
    />
  );
};

export { EmployeeContainer };
