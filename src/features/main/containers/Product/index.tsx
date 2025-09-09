import { SvgReloadIcon, SvgSearchIcon } from '@/assets';
import { productKeys } from '@/features/main/react-query';
import { Button } from '@/lib';
import BasePageLayout from '@/lib/components/BasePageLayout';
import { queryClient } from '@/providers/ReactQuery';
import { useCommonHook } from './hook';
import {
  CreateProductModal,
  DetailProductModal,
  ProductTable,
} from './components';

const ProductContainer = () => {
  const {
    ref,
    record,
    setRecord,
    queryParams,
    setQueryParams,
    isProductListLoading,
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
            disabled={isProductListLoading}
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: productKeys.all,
              });
            }}
          />
          <CreateProductModal />
        </>
      }
      tableArea={
        <>
          <ProductTable ref={ref} setRecord={setRecord} />
          <DetailProductModal ref={ref} record={record} />
        </>
      }
    />
  );
};

export { ProductContainer };
