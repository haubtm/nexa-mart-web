import type { IStockTakeListResponse } from '@/dtos';
import { SvgPencilIcon } from '@/assets';
import { Button, ModalNew } from '@/lib';
import StockTakeForm from '../CommonForm';
import { useHook } from './hook';

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

  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Cập nhật phiếu kiểm kho'}
      confirmLoading={isLoadingUpdateStockTake}
      onOk={form.submit}
      onCancel={handleCancel}
      openButton={
        <Button
          type="text"
          icon={<SvgPencilIcon width={18} height={18} />}
          onClick={handleOpen}
        />
      }
    >
      <StockTakeForm form={form} handleSubmit={handleSubmit} />
    </ModalNew>
  );
};

export default UpdateStockTakeModal;
