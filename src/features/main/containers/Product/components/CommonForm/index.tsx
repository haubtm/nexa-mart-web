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
import type { IProductCreateRequest, IProductCreateResponse } from '@/dtos';
import { Card, Col, Image, Row, TreeSelect, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SetAttributeAndUnitModal from '../SetAtrributeAndUnitModal';
import { useRef } from 'react';

interface IProductFormProps {
  form: IFormProps<IProductCreateRequest>['form'];
  handleSubmit?: (
    values: IProductCreateRequest,
  ) => Promise<IProductCreateResponse | undefined>;
}

const ProductForm = ({ form, handleSubmit }: IProductFormProps) => {
  const {
    rules,
    onFinish,
    fileList,
    uploadProps,
    previewOpen,
    setPreviewOpen,
    previewImage,
    setPreviewImage,
    isCategoriesLoading,
    categoriesData,
    isBrandsLoading,
    brandsData,
    modalForm,
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
                label={'Tên sản phẩm'}
                name="name"
                required
                rules={[rules]}
              >
                <Input placeholder={'Tên sản phẩm'} />
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
                <TreeSelect
                  placeholder={'Chọn danh mục'}
                  treeDefaultExpandAll
                  loading={isCategoriesLoading}
                  treeData={
                    categoriesData?.data.map((category) => ({
                      title: category.name,
                      value: category.id,
                      key: category.id,
                      children: category.children?.map((child) => ({
                        title: child.name,
                        value: child.id,
                        key: child.id,
                      })),
                    })) ?? []
                  }
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem<IProductCreateRequest>
                label={'Thương hiệu'}
                name="productType"
                required
                rules={[rules]}
              >
                <Select
                  placeholder={'Chọn thương hiệu'}
                  options={
                    brandsData?.data?.map((brand) => ({
                      label: brand.name,
                      value: brand.brandId,
                    })) ?? []
                  }
                  loading={isBrandsLoading}
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
      <Card title="Giá vốn, giá bán">
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <FormItem<IProductCreateRequest>
              label={'Đơn vị tính cơ bản'}
              name={['baseUnit', 'unit']}
              rules={[rules]}
            >
              <Input placeholder={'Đơn vị tính'} />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem<IProductCreateRequest>
              label={'Giá bán'}
              name={['baseUnit', 'basePrice']}
              rules={[rules]}
            >
              <Input type="number" placeholder={'Giá bán'} />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem<IProductCreateRequest>
              label={'Giá vốn'}
              name={['baseUnit', 'cost']}
              rules={[rules]}
            >
              <Input placeholder={'Giá vốn'} />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem<IProductCreateRequest>
              label={'Mã vạch'}
              name={['baseUnit', 'barcode']}
              rules={[rules]}
            >
              <Input placeholder={'Mã vạch'} />
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
              <Input />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem<IProductCreateRequest>
              label={'Định mức tồn thấp nhất'}
              name={['inventory', 'minQuantity']}
              rules={[rules]}
            >
              <Input />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem<IProductCreateRequest>
              label={'Định mức tồn tối đa'}
              name={['inventory', 'maxQuantity']}
              rules={[rules]}
            >
              <Input />
            </FormItem>
          </Col>
        </Row>
      </Card>

      <Card
        title={
          <Flex justify="space-between" align="center">
            <Text>Quản lý theo đơn vị và thuộc tính</Text>
            <SetAttributeAndUnitModal
              ref={modalRef}
              form={form}
              rules={rules}
              onFinish={onFinish}
              modalForm={modalForm}
            />
          </Flex>
        }
      ></Card>
      <FormItem noStyle name="additionalUnits" />
      <FormItem noStyle name="attributes" />
      <Image
        wrapperStyle={{ display: 'none' }}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => setPreviewOpen(visible),
          afterOpenChange: (visible) => !visible && setPreviewImage(''),
        }}
        src={previewImage || undefined}
      />
    </Form>
  );
};

export default ProductForm;
