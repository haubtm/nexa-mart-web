import { Table } from '@/lib';
import { Button } from 'antd';

const ProductPage = () => {
  return (
    <>
      <title>Product</title>
      <Table
        selectionBar={{
          actionButtons: (
            <Button type="primary" danger icon={<></>}>
              xóa
            </Button>
          ),
        }}
      />
    </>
  );
};

export default ProductPage;
