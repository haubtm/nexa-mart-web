import { SvgReloadIcon, SvgSearchIcon } from '@/assets';
import { productKeys, useProductExport } from '@/features/main/react-query';
import { Button } from '@/lib';
import BasePageLayout from '@/lib/components/BasePageLayout';
import { queryClient } from '@/providers/ReactQuery';
import { useCommonHook } from './hook';
import {
  CreateProductModal,
  DetailProductModal,
  ProductTable,
  ImportProductModal,
} from './components';
import { DownloadOutlined } from '@ant-design/icons';
import { message } from 'antd';

const ProductContainer = () => {
  const { ref, record, queryParams, setQueryParams, isProductListLoading } =
    useCommonHook();

  const { mutate: exportProducts, isPending: isExporting } = useProductExport();

  const handleExport = () => {
    exportProducts(undefined, {
      onSuccess: () => {
        message.success('Xuất file Excel thành công');
      },
      onError: (error: any) => {
        message.error(error?.message || 'Có lỗi xảy ra khi xuất file');
      },
    });
  };

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
            disabled={isProductListLoading}
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: productKeys.all,
              });
            }}
          />
          <Button
            icon={<DownloadOutlined />}
            loading={isExporting}
            onClick={handleExport}
          >
            Xuất Excel
          </Button>
          <ImportProductModal />
          <CreateProductModal />
        </>
      }
      tableArea={
        <>
          <ProductTable
          //  ref={ref} setRecord={setRecord}
          />
          <DetailProductModal ref={ref} record={record} />
        </>
      }
    />
  );
};

export { ProductContainer };
