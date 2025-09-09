import { SvgPlusIcon } from '@/assets';
import { IProductCreateRequest } from '@/dtos';
import { Button, FormList, IModalRef, ModalNew } from '@/lib';
import { Card } from 'antd';
import { RefObject, useState } from 'react';

interface ISetAttributeAndUnitModalProps {
  ref: RefObject<IModalRef | null>;
}

const SetAttributeAndUnitModal = ({ ref }: ISetAttributeAndUnitModalProps) => {
  const [attribute, setAttribute] = useState<
    IProductCreateRequest['attributes'][]
  >([]);
  const [unit, setUnit] = useState<IProductCreateRequest['baseUnit'][]>([]);

  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Thiết lập thuộc tính và đơn vị'}
      onCancel={() => ref?.current?.hide()}
      openButton={
        <Button
          type="primary"
          icon={<SvgPlusIcon width={12} height={12} />}
          onClick={() => ref?.current?.open()}
        >
          Thiết lập
        </Button>
      }
    ></ModalNew>
  );
};

export default SetAttributeAndUnitModal;
