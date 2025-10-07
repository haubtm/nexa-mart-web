import { Button, EPromotionType, ModalNew } from '@/lib';
import { useHook } from './hook';
import { PlusOutlined } from '@ant-design/icons';
import PromotionDetailCreateForm from '../CommonDetailForm';

interface ICreatePromotionDetailModalProps {
  lineId: number;
  promotionType: EPromotionType;
}

const CreatePromotionDetailModal = ({
  lineId,
  promotionType,
}: ICreatePromotionDetailModalProps) => {
  const { ref, form, isLoadingCreatePromotion, handleSubmit, handleCancel } =
    useHook(lineId);

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
      <PromotionDetailCreateForm
        form={form}
        handleSubmit={handleSubmit}
        promotionType={promotionType}
      />
    </ModalNew>
  );
};

export default CreatePromotionDetailModal;
