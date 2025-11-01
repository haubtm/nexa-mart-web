import { SvgReloadIcon, SvgSearchIcon } from '@/assets';
import { importsKeys } from '@/features/main/react-query';
import { Button } from '@/lib';
import BasePageLayout from '@/lib/components/BasePageLayout';
import { queryClient } from '@/providers/ReactQuery';
import { useCommonHook } from './hook';
import { CreateImportsModal, ImportsTable } from './components';

const ImportsContainer = () => {
  const { queryParams, setQueryParams, isImportsListLoading } = useCommonHook();

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
            disabled={isImportsListLoading}
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: importsKeys.all,
              });
            }}
          />
          <CreateImportsModal />
        </>
      }
      tableArea={
        <>
          <ImportsTable
          // ref={ref}
          // setRecord={setRecord}
          />
        </>
      }
    />
  );
};

export { ImportsContainer };
