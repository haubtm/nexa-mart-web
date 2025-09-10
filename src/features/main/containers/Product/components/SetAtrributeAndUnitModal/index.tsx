import { SvgPlusIcon } from '@/assets';
import { IProductCreateRequest } from '@/dtos';
import {
  Button,
  Form,
  FormItem,
  FormList,
  IModalRef,
  Input,
  ModalNew,
  Select,
} from '@/lib';
import { Card, FormInstance, Space } from 'antd';
import { RuleRender } from 'antd/es/form';
import { RefObject } from 'react';
import { useHook } from './hook';

interface ISetAttributeAndUnitModalProps {
  ref: RefObject<IModalRef | null>;
  form?: FormInstance<IProductCreateRequest>;
  rules: RuleRender;
  onFinish: (values: IProductCreateRequest) => void;
  modalForm: FormInstance<IProductCreateRequest>;
}

const SetAttributeAndUnitModal = ({
  ref,
  form,
  rules,
  modalForm,
}: ISetAttributeAndUnitModalProps) => {
  const { attributesData, isAttributesLoading } = useHook();

  const handleFinish = (values: IProductCreateRequest) => {
    const normalizedAttributes =
      values.attributes?.flatMap((attr) =>
        (Array.isArray(attr.value) ? attr.value : [attr.value]).map((v) => ({
          attributeId: attr.attributeId,
          value: v,
        })),
      ) ?? [];

    form?.setFieldsValue({
      additionalUnits: values.additionalUnits,
      attributes: normalizedAttributes,
    });

    ref?.current?.hide();
  };

  return (
    <ModalNew
      ref={ref}
      width={1000}
      title={'Thiết lập thuộc tính và đơn vị'}
      onCancel={() => ref?.current?.hide()}
      onOk={() => modalForm?.submit()}
      openButton={
        <Button
          type="primary"
          icon={<SvgPlusIcon width={12} height={12} />}
          onClick={() => {
            const parentValues = form?.getFieldsValue([
              'additionalUnits',
              'attributes',
            ]);

            // map lại attributes để Select tags hiểu (phải là mảng string[])
            const groupedAttrs =
              parentValues.attributes?.reduce((acc: any[], cur: any) => {
                const existing = acc.find(
                  (a) => a.attributeId === cur.attributeId,
                );
                if (existing) {
                  existing.value.push(cur.value);
                } else {
                  acc.push({
                    attributeId: cur.attributeId,
                    value: [cur.value], // luôn là mảng
                  });
                }
                return acc;
              }, []) ?? []; // 🔑 đảm bảo không undefined

            // set vào modal form
            modalForm.setFieldsValue({
              additionalUnits: parentValues.additionalUnits ?? [],
              attributes: groupedAttrs,
            });

            ref?.current?.open();
          }}
        >
          Thiết lập
        </Button>
      }
    >
      <Form form={modalForm} onFinish={handleFinish}>
        {/* ĐƠN VỊ TÍNH */}
        <Card title="Đơn vị tính bổ sung">
          <FormList name="additionalUnits">
            {(fields: any, { add, remove }: any) => (
              <>
                {fields.map(({ key, name, ...restField }: any) => (
                  <Space
                    key={key}
                    align="baseline"
                    style={{ display: 'flex', marginBottom: 8 }}
                  >
                    <FormItem
                      {...restField}
                      name={[name, 'unit']}
                      rules={[{ required: true, message: 'Nhập đơn vị' }]}
                    >
                      <Input placeholder="Đơn vị" style={{ width: 120 }} />
                    </FormItem>

                    <FormItem
                      {...restField}
                      name={[name, 'basePrice']}
                      rules={[rules]}
                    >
                      <Input placeholder="Giá bán lẻ" style={{ width: 120 }} />
                    </FormItem>

                    <FormItem
                      {...restField}
                      name={[name, 'conversionValue']}
                      rules={[rules]}
                    >
                      <Input
                        placeholder="Giá trị quy đổi"
                        style={{ width: 120 }}
                      />
                    </FormItem>

                    <FormItem
                      {...restField}
                      name={[name, 'barcode']}
                      rules={[rules]}
                    >
                      <Input placeholder="Mã vạch" style={{ width: 120 }} />
                    </FormItem>

                    <Button danger onClick={() => remove(name)}>
                      Xóa
                    </Button>
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<SvgPlusIcon width={12} height={12} />}
                >
                  Thêm đơn vị
                </Button>
              </>
            )}
          </FormList>
        </Card>

        {/* THUỘC TÍNH */}
        <Card title="Thuộc tính" style={{ marginBottom: 20 }}>
          <FormList name="attributes" rules={[rules]}>
            {(
              fields: IProductCreateRequest['attributes'],
              {
                add,
                remove,
              }: { add: () => void; remove: (index: number) => void },
            ) => (
              <>
                {fields?.map(({ key, name, ...restField }: any) => (
                  <Space
                    key={key}
                    align="baseline"
                    style={{ display: 'flex', marginBottom: 8 }}
                  >
                    <FormItem
                      {...restField}
                      name={[name, 'attributeId']}
                      rules={[rules]}
                    >
                      <Select
                        loading={isAttributesLoading}
                        placeholder="Chọn thuộc tính"
                        options={attributesData?.data?.map((attribute) => ({
                          label: attribute.name,
                          value: attribute.id,
                        }))}
                        style={{ width: 200 }}
                      />
                    </FormItem>

                    <FormItem {...restField} name={[name, 'value']}>
                      <Select
                        placeholder="Chọn giá trị"
                        mode="tags"
                        style={{ width: 400 }}
                      />
                    </FormItem>

                    <Button danger onClick={() => remove(name)}>
                      Xóa
                    </Button>
                  </Space>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<SvgPlusIcon width={12} height={12} />}
                >
                  Thêm thuộc tính
                </Button>
              </>
            )}
          </FormList>
        </Card>
      </Form>
    </ModalNew>
  );
};

export default SetAttributeAndUnitModal;
