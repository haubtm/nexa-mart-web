import {
  Tabs,
  Row,
  Col,
  Button,
  Space,
  Divider,
  InputNumber,
  Checkbox,
  Upload,
  Image,
  TreeSelect,
} from 'antd';

import {
  Flex,
  Form,
  FormItem,
  IFormProps,
  Input,
  RichText,
  Select,
  Text,
} from '@/lib';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import type { IProductCreateRequest, IProductCreateResponse } from '@/dtos';
import { useHook } from './hook';
import CreateCategoryModal from '../CreateCategoryModal';
import CreateBrandModal from '../CreateBrandModal';

interface ProductFormProps {
  form: IFormProps<IProductCreateRequest>['form'];
  handleSubmit?: (
    v: IProductCreateRequest,
  ) => Promise<IProductCreateResponse | undefined>;
  productId?: number;
}

const ProductForm = ({ form, handleSubmit, productId }: ProductFormProps) => {
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
  } = useHook(handleSubmit, productId);

  const validateUnits = (_: any, units?: any[]) => {
    if (!units || units.length === 0)
      return Promise.reject('Vui lòng thêm ít nhất một đơn vị');
    const baseUnits = units.filter((u) => u?.isBaseUnit);
    if (baseUnits.length === 0)
      return Promise.reject('Cần chọn 1 đơn vị cơ bản');
    if (baseUnits.length > 1)
      return Promise.reject('Chỉ được chọn đúng 1 đơn vị cơ bản');
    if (Number(baseUnits[0]?.conversionValue || 0) !== 1) {
      return Promise.reject('Đơn vị cơ bản phải có hệ số quy đổi = 1');
    }
    return Promise.resolve();
  };

  const uploadButton = (
    <Flex vertical align="center" justify="center">
      <PlusOutlined />
      <Text>Thêm ảnh</Text>
    </Flex>
  );

  return (
    <Form form={form} onFinish={(values) => onFinish(values)}>
      <Tabs
        defaultActiveKey="info"
        items={[
          {
            key: 'info',
            label: 'Thông tin',
            children: (
              <>
                <Row gutter={16}>
                  <Col span={12}>
                    <Row gutter={16}>
                      <Col span={24}>
                        <FormItem<IProductCreateRequest>
                          label="Tên hàng hóa"
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
                            <Flex
                              align="center"
                              justify="space-between"
                              gap={8}
                            >
                              Nhóm hàng
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
                              categoriesData?.data?.map((category) => ({
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
                            options={(brandsData?.data ?? []).map((b: any) => ({
                              label: b.name,
                              value: b.brandId,
                            }))}
                            allowClear
                            loading={isBrandsLoading}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>

                  <Col span={12}>
                    <label>Hình ảnh sản phẩm</label>
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      {...uploadProps}
                    >
                      {fileList.length >= 4 ? null : uploadButton}
                    </Upload>
                    <div>Mỗi ảnh ≤ 2MB • Tối đa 4 ảnh • JPG/PNG/WEBP</div>

                    <Image
                      wrapperStyle={{ display: 'none' }}
                      preview={{
                        visible: previewOpen,
                        onVisibleChange: (v) => setPreviewOpen(v),
                        afterOpenChange: (v) => !v && setPreviewImage(''),
                      }}
                      src={previewImage || undefined}
                    />
                  </Col>
                </Row>
                <Divider orientation="left">Đơn vị tính</Divider>

                <FormItem
                  name="units"
                  rules={[{ validator: validateUnits }]}
                  style={{ margin: 0 }}
                  hidden
                >
                  <Input style={{ display: 'none' }} />
                </FormItem>

                <Form.List name="units">
                  {(fields, { add, remove }) => (
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {fields.map(({ key, name, ...rest }) => (
                        <Row key={key} gutter={8} align="middle">
                          <FormItem
                            {...rest}
                            name={[name, 'id']}
                            label="ID"
                            hidden
                          >
                            <Input />
                          </FormItem>
                          <Col span={5}>
                            <FormItem
                              {...rest}
                              name={[name, 'unitName']}
                              label="Tên đơn vị"
                              rules={[
                                {
                                  required: true,
                                  message: 'Nhập tên đơn vị',
                                },
                              ]}
                            >
                              <Input placeholder="VD: lon, lốc, thùng…" />
                            </FormItem>
                          </Col>
                          <Col span={4}>
                            <FormItem
                              {...rest}
                              name={[name, 'barcode']}
                              label="Mã vạch"
                            >
                              <Input placeholder="Nhập mã vạch" />
                            </FormItem>
                          </Col>
                          <Col span={4}>
                            <FormItem
                              {...rest}
                              name={[name, 'conversionValue']}
                              label="Giá trị quy đổi"
                              rules={[
                                { required: true, message: 'Nhập hệ số' },
                              ]}
                            >
                              <InputNumber
                                min={1}
                                style={{ width: '100%' }}
                                placeholder="VD: 1, 6, 24"
                              />
                            </FormItem>
                          </Col>
                          <Col span={6}>
                            <FormItem
                              {...rest}
                              name={[name, 'code']}
                              label="Mã hàng"
                            >
                              <Input placeholder="Tự động" />
                            </FormItem>
                          </Col>
                          <Col span={3}>
                            <FormItem
                              valuePropName="checked"
                              name={[name, 'isBaseUnit']}
                              {...rest}
                              label="Đơn vị cơ bản"
                            >
                              <Checkbox
                                style={{ alignItems: 'center' }}
                                onChange={() => {
                                  const list =
                                    form?.getFieldValue('units') || [];
                                  list.forEach((u: any, idx: number) => {
                                    if (idx === name) {
                                      u.isBaseUnit = true;
                                      u.conversionValue = 1;
                                    } else {
                                      u.isBaseUnit = false;
                                    }
                                  });
                                  form?.setFieldsValue({ units: list });
                                }}
                              />
                            </FormItem>
                          </Col>
                          <Col span={1}>
                            <Button
                              icon={<DeleteOutlined />}
                              type="text"
                              danger
                              onClick={() => remove(name)}
                            />
                          </Col>
                        </Row>
                      ))}

                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() =>
                          add({
                            unitName: '',
                            conversionValue: 1,
                            isBaseUnit: fields.length === 0,
                          })
                        }
                        block
                      >
                        Thêm đơn vị
                      </Button>
                    </Space>
                  )}
                </Form.List>
              </>
            ),
          },
          {
            key: 'desc',
            label: 'Mô tả chi tiết',
            children: (
              <FormItem<IProductCreateRequest>
                name="description"
                label="Mô tả"
                valuePropName="value"
                trigger="onChange"
                getValueFromEvent={(v) => v}
              >
                <RichText />
              </FormItem>
            ),
          },
        ]}
      />
    </Form>
  );
};

export default ProductForm;
