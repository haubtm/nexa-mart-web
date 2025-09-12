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
import SetAttributeAndUnitModal from '../SetAtrributeAndUnitModal';
import { useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import CreateCategoryModal from '../CreateCategoryModal';
import CreateBrandModal from '../CreateBrandModal';

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
                label="Tên sản phẩm"
                name="name"
                required
                rules={[rules]}
              >
                <Input placeholder="Tên sản phẩm" />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem<IProductCreateRequest>
                label={
                  <Flex align="center" justify="space-between" gap={8}>
                    Danh mục
                    <CreateCategoryModal />
                  </Flex>
                }
                name="categoryId"
                rules={[rules]}
              >
                <TreeSelect
                  placeholder="Chọn danh mục"
                  treeDefaultExpandAll
                  loading={isCategoriesLoading}
                  allowClear
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
                label={
                  <Flex align="center" justify="space-between">
                    Thương hiệu
                    <CreateBrandModal />
                  </Flex>
                }
                name="brandId"
                rules={[rules]}
              >
                <Select
                  placeholder="Chọn thương hiệu"
                  options={
                    brandsData?.data.map((brand) => ({
                      label: brand.name,
                      value: brand.brandId,
                    })) ?? []
                  }
                  allowClear
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

      <Card title="Đơn vị cơ bản (bắt buộc)">
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <FormItem<IProductCreateRequest>
              label="Đơn vị"
              name={['baseUnit', 'unit']}
              rules={[{ required: true, message: 'Nhập đơn vị cơ bản' }]}
            >
              <Input placeholder="vd: lon" />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem<IProductCreateRequest>
              label="Giá bán"
              name={['baseUnit', 'basePrice']}
              rules={[{ required: true, message: 'Nhập giá bán' }]}
            >
              <Input type="number" placeholder="10000" />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem<IProductCreateRequest>
              label="Giá vốn"
              name={['baseUnit', 'cost']}
              rules={[{ required: true, message: 'Nhập giá vốn' }]}
            >
              <Input type="number" placeholder="0" />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem<IProductCreateRequest>
              label="Tồn kho"
              name={['baseUnit', 'onHand']}
              rules={[{ required: true, message: 'Nhập tồn kho' }]}
            >
              <Input type="number" placeholder="10" />
            </FormItem>
          </Col>

          {/* conversionValue = 1 (mặc định, ẩn) */}
          <FormItem
            name={['baseUnit', 'conversionValue']}
            initialValue={1}
            hidden
          >
            <Input type="hidden" />
          </FormItem>
        </Row>
        <Text type="secondary">
          Đơn vị cơ bản luôn được áp vào tất cả biến thể (quy đổi = 1).
        </Text>
      </Card>

      {/* KHU VỰC THIẾT LẬP BIẾN THỂ */}
      <Card title={<Text>Thiết lập biến thể (thuộc tính & đơn vị)</Text>}>
        <Flex align="center" justify="space-between">
          <Text type="secondary">
            Nhấn <b>Thiết lập</b> để chọn thuộc tính (màu, size, ...) và các đơn
            vị (lon, lốc, thùng, ...).
          </Text>

          {/* Modal vẫn được mount sẵn để ref hoạt động */}
          <SetAttributeAndUnitModal
            ref={modalRef}
            form={form}
            rules={rules}
            onFinish={onFinish}
            modalForm={modalForm}
          />
        </Flex>
      </Card>

      {/* Field ẩn để submit lên server */}
      <FormItem
        name="variants"
        hidden
        rules={[
          // Nếu productType = 2 (có biến thể) thì bắt buộc có variants
          ({ getFieldValue }) => ({
            validator(_, v) {
              if (getFieldValue('productType') !== 2) return Promise.resolve();
              return Array.isArray(v) && v.length > 0
                ? Promise.resolve()
                : Promise.reject(new Error('Vui lòng thiết lập biến thể'));
            },
          }),
        ]}
      >
        {/* input ẩn để field được “register” */}
        <Input type="hidden" />
      </FormItem>

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
