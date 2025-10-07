import type { IStockTakeListResponse } from '@/dtos';
import { SvgPencilIcon } from '@/assets';
import { Button, ModalNew, StockTakeStatus } from '@/lib';
import StockTakeForm from '../CommonForm';
import { useHook } from './hook';
import { useState } from 'react';

interface IUpdateStockTakeModalProps {
  record?: IStockTakeListResponse['data']['content'][number] | null;
}

const UpdateStockTakeModal = ({ record }: IUpdateStockTakeModalProps) => {
  const {
    ref,
    form,
    isLoadingUpdateStockTake,
    handleOpen,
    handleSubmit,
    handleCancel,
  } = useHook(record);

  const [renderKey, setRenderKey] = useState(0);

  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Cập nhật phiếu kiểm kho'}
      confirmLoading={isLoadingUpdateStockTake}
      onCancel={handleCancel}
      footer={
        <>
          <Button onClick={handleCancel}>Hủy</Button>
          <Button
            style={{ backgroundColor: 'green' }}
            type="primary"
            onClick={() => {
              form.setFieldValue('status', StockTakeStatus.PENDING);
              form.submit();
            }}
          >
            Lưu tạm
          </Button>
          <Button
            type="primary"
            onClick={() => {
              form.setFieldValue('status', StockTakeStatus.COMPLETED);
              form.submit();
            }}
          >
            Hoàn thành
          </Button>
        </>
      }
      openButton={
        <Button
          type="text"
          icon={<SvgPencilIcon width={18} height={18} />}
          onClick={() => {
            setRenderKey((k) => k + 1);
            handleOpen();
          }}
        />
      }
    >
      <StockTakeForm key={renderKey} form={form} handleSubmit={handleSubmit} />
    </ModalNew>
  );
};

export default UpdateStockTakeModal;
