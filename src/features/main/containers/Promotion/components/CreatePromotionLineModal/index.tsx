import { Button, ModalNew } from '@/lib';
import PromotionForm from '../CommonLineForm';
import { useHook } from './hook';
import { PlusOutlined } from '@ant-design/icons';

interface ICreatePromotionLineModalProps {
  headerId: number;
  headerStartDate: string; // ⬅️ thêm
  headerEndDate: string;
}

const CreatePromotionLineModal = ({
  headerId,
  headerStartDate,
  headerEndDate,
}: ICreatePromotionLineModalProps) => {
  const { ref, form, isLoadingCreatePromotion, handleSubmit, handleCancel } =
    useHook(headerId);

  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Thêm mã khuyến mãi'}
      confirmLoading={isLoadingCreatePromotion}
      onOk={form.submit}
      onCancel={handleCancel}
      openButton={
        <Button
          type="text"
          icon={
            <PlusOutlined width={12} height={12} style={{ color: '#4b5563' }} />
          }
          onClick={() => ref?.current?.open()}
        />
      }
    >
      <PromotionForm
        form={form}
        handleSubmit={handleSubmit}
        headerStartDate={headerStartDate}
        headerEndDate={headerEndDate}
      />
    </ModalNew>
  );
};

export default CreatePromotionLineModal;
