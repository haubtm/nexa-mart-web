import { SvgReloadIcon, SvgSearchIcon } from '@/assets';
import { promotionKeys } from '@/features/main/react-query';
import { Button } from '@/lib';
import BasePageLayout from '@/lib/components/BasePageLayout';
import { queryClient } from '@/providers/ReactQuery';
import { useCommonHook } from './hook';
import { CreatePromotionHeaderModal, PromotionTable } from './components';

const PromotionContainer = () => {
  const { queryParams, setQueryParams, isPromotionListLoading } =
    useCommonHook();

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
            disabled={isPromotionListLoading}
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: promotionKeys.all,
              });
            }}
          />
          <CreatePromotionHeaderModal />
        </>
      }
      tableArea={
        <>
          <PromotionTable
          // ref={ref}
          // setRecord={setRecord}
          />
          {/* <DetailPromotionModal ref={ref} record={record} /> */}
        </>
      }
    />
  );
};

export { PromotionContainer };
