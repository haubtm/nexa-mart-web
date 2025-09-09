import {
  Flex,
  Form,
  FormItem,
  type IFormProps,
  IModalRef,
  Input,
  Select,
  Text,
} from '@/lib';
import { useHook } from './hook';
import type { IProductCreateRequest } from '@/dtos';
import { Card, Col, Image, Row, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SetAttributeAndUnitModal from '../SetAtrributeAndUnitModal';
import { useRef } from 'react';

interface IProductFormProps {
  form: IFormProps<IProductCreateRequest>['form'];
  handleSubmit: (values: IProductCreateRequest) => void;
  readonly?: boolean;
}

const ProductForm = ({
  form,
  handleSubmit,
  readonly = false,
}: IProductFormProps) => {
  const {
    rules,
    onFinish,
    fileList,
    uploadProps,
    previewOpen,
    setPreviewOpen,
    previewImage,
    setPreviewImage,
  } = useHook(handleSubmit);

  const modalRef = useRef<IModalRef>(null);

  const uploadButton = (
    <Flex vertical align="center" justify="center">
      <PlusOutlined />
      <Text>Thêm ảnh</Text>
    </Flex>
  );

  return (
    <Form form={form} onFinish={(values) => onFinish(values)}>
      <Row gutter={16}>
        <Col span={12}>
          <Row gutter={16}>
            <Col span={24}>
              <FormItem<IProductCreateRequest>
                label={'Têm sản phẩm'}
                name="name"
                required
                rules={[rules]}
              >
                <Input readOnly={readonly} placeholder={'Tên sản phẩm'} />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem<IProductCreateRequest>
                label={'Danh mục'}
                name="categoryId"
                required
                rules={[rules]}
              >
                <Select
                  placeholder={'Chọn danh mục'}
                  options={[
                    { label: 'Danh mục 1', value: 1 },
                    { label: 'Danh mục 2', value: 2 },
                    { label: 'Danh mục 3', value: 3 },
                    { label: 'Danh mục 4', value: 4 },
                  ]}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem<IProductCreateRequest>
                label={'Loại sản phẩm'}
                name="productType"
                required
                rules={[rules]}
              >
                <Select
                  placeholder={'Chọn loại sản phẩm'}
                  options={[
                    { label: 'Loại 1', value: 1 },
                    { label: 'Loại 2', value: 2 },
                    { label: 'Loại 3', value: 3 },
                    { label: 'Loại 4', value: 4 },
                  ]}
                />
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <label>Hình ảnh sản phẩm</label>
          <Upload {...uploadProps}>
            {fileList.length >= 4 ? null : uploadButton}
          </Upload>
          <div>
            Mỗi ảnh không quá 2 MB
            <br />• Tối đa 4 ảnh <br />• JPG, PNG, WEBP
          </div>
        </Col>
      </Row>
      <Card title="Đơn vị tính cơ bản">
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <FormItem<IProductCreateRequest>
              label={'Đơn vị tính cơ bản'}
              name={['baseUnit', 'unit']}
            >
              <Input readOnly={readonly} placeholder={'Đơn vị tính cơ bản'} />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem<IProductCreateRequest>
              label={'Giá bán lẻ'}
              name={['baseUnit', 'basePrice']}
            >
              <Input readOnly={readonly} placeholder={'Giá bán lẻ'} />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem<IProductCreateRequest>
              label={'Giá vốn'}
              name={['baseUnit', 'cost']}
            >
              <Input readOnly={readonly} placeholder={'Giá vốn'} />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem<IProductCreateRequest>
              label={'Mã vạch'}
              name={['baseUnit', 'barcode']}
            >
              <Input readOnly={readonly} placeholder={'Mã vạch'} />
            </FormItem>
          </Col>
        </Row>
      </Card>
      <Card title="Tồn kho">
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <FormItem<IProductCreateRequest>
              label={'Tồn kho'}
              name={['inventory', 'onHand']}
              rules={[rules]}
            >
              <Input readOnly={readonly} />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem<IProductCreateRequest>
              label={'Định mức tồn thấp nhất'}
              name={['inventory', 'minQuantity']}
              rules={[rules]}
            >
              <Input readOnly={readonly} />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem<IProductCreateRequest>
              label={'Định mức tồn tối đa'}
              name={['inventory', 'maxQuantity']}
              rules={[rules]}
            >
              <Input readOnly={readonly} />
            </FormItem>
          </Col>
        </Row>
      </Card>

      <Card
        title={
          <Flex justify="space-between" align="center">
            <Text>Quản lý theo đơn vị và thuộc tính</Text>
            <SetAttributeAndUnitModal ref={modalRef} />
          </Flex>
        }
      ></Card>
      <Image
        wrapperStyle={{ display: 'none' }}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => setPreviewOpen(visible),
          afterOpenChange: (visible) => !visible && setPreviewImage(''),
        }}
        src={previewImage}
      />
    </Form>
  );
};

export default ProductForm;
