import { SvgPlusIcon } from '@/assets';
import { Button, ModalNew } from '@/lib';
import PromotionHeaderForm from '../CommonHeaderForm';
import { useHook } from './hook';

const CreatePromotionModal = () => {
  const {
    ref,
    form,
    isLoadingCreatePromotionHeader,
    handleSubmit,
    handleCancel,
  } = useHook();

  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Thêm chương trình khuyến mãi'}
      confirmLoading={isLoadingCreatePromotionHeader}
      onOk={form.submit}
      onCancel={handleCancel}
      openButton={
        <Button
          type="primary"
          icon={<SvgPlusIcon width={12} height={12} />}
          onClick={() => ref?.current?.open()}
        >
          Thêm chương trình khuyến mãi
        </Button>
      }
    >
      <PromotionHeaderForm form={form} handleSubmit={handleSubmit} />
    </ModalNew>
  );
};

export default CreatePromotionModal;
