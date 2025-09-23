import { SvgPlusIcon } from '@/assets';
import { Button, Flex, ModalNew, StockTakeStatus } from '@/lib';
import StockTakeForm from '../CommonForm';
import { useHook } from './hook';

const CreateStockTakeModal = () => {
  const { ref, form, isLoadingCreateRoom, handleSubmit, handleCancel } =
    useHook();

  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Thêm phiếu kiểm kho'}
      confirmLoading={isLoadingCreateRoom}
      onCancel={handleCancel}
      footer={
        <Flex gap={8} justify="end">
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
        </Flex>
      }
      openButton={
        <Button
          type="primary"
          icon={<SvgPlusIcon width={12} height={12} />}
          onClick={() => ref?.current?.open()}
        >
          Thêm phiếu kiểm kho
        </Button>
      }
    >
      <StockTakeForm form={form} handleSubmit={handleSubmit} />
    </ModalNew>
  );
};

export default CreateStockTakeModal;
