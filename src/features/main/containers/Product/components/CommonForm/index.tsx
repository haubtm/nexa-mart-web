import {
  Tabs,
  Row,
  Col,
  Space,
  Checkbox,
  Upload,
  Image,
  TreeSelect,
  message,
} from 'antd';

import {
  Button,
  Flex,
  Form,
  FormItem,
  IFormProps,
  Input,
  InputNumber,
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

  const onFinishFailed = ({ errorFields }: any) => {
    const unitsErr = errorFields.find((e: any) =>
      Array.isArray(e.name) ? e.name.includes('units') : e.name === 'units',
    );
    if (unitsErr?.errors?.length) {
      // Ưu tiên thông điệp từ validator
      message.error(unitsErr.errors[0]);
    }
  };

  const validateUnits = (_: any, units?: any[]) => {
    if (!units || units.length === 0)
      return Promise.reject('Vui lòng thêm ít nhất một đơn vị');

    const baseUnits = units.filter((u) => u?.isBaseUnit);
    if (baseUnits.length === 0)
      return Promise.reject('Cần chọn 1 đơn vị cơ bản');
    if (baseUnits.length > 1)
      return Promise.reject('Chỉ được chọn đúng 1 đơn vị cơ bản');

    if (Number(baseUnits[0]?.conversionValue || 0) !== 1)
      return Promise.reject('Đơn vị cơ bản phải có hệ số quy đổi = 1');

    return Promise.resolve();
  };

  const uploadButton = (
    <Flex vertical align="center" justify="center">
      <PlusOutlined />
      <Text>Thêm ảnh</Text>
    </Flex>
  );

  return (
    <Form
      form={form}
      onFinish={(values) => onFinish(values)}
      onFinishFailed={onFinishFailed}
    >
      <Tabs
        defaultActiveKey="info"
        size="small"
        items={[
          {
            key: 'info',
            label: 'Thông tin',
            children: (
              <>
                <Row gutter={16}>
                  <Col span={14}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <FormItem<IProductCreateRequest>
                          label="Tên hàng hóa"
                          name="name"
                          required
                          rules={[rules]}
                        >
                          <Input placeholder="Tên sản phẩm" />
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem<IProductCreateRequest>
                          label="Mã hàng hóa"
                          name="code"
                          rules={[rules]}
                        >
                          <Input placeholder="Mã hàng hóa tự động" />
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
                              Danh mục
                              <CreateCategoryModal />
                            </Flex>
                          }
                          name="categoryId"
                          rules={[rules]}
                          required
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
                          required
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

                  <Col span={10}>
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

                {/* Ẩn field units để validator tổng hoạt động như cũ */}
                <FormItem
                  name="units"
                  rules={[{ validator: validateUnits }]}
                  style={{ margin: 0 }}
                  hidden
                >
                  <Input style={{ display: 'none' }} />
                </FormItem>

                <Form.List name="units">
                  {(fields, { add, remove }) => {
                    const units = form?.getFieldValue('units') || [];
                    const ensureUnitsValidityAndToast = () => {
                      const list = form?.getFieldValue('units') || [];
                      if (!list.length) {
                        message.error('Vui lòng thêm ít nhất một đơn vị');
                        return false;
                      }
                      const baseCount = list.filter(
                        (u: any) => u?.isBaseUnit,
                      ).length;
                      if (baseCount === 0) {
                        message.error('Cần chọn 1 đơn vị cơ bản');
                        return false;
                      }
                      if (baseCount > 1) {
                        message.error('Chỉ được chọn đúng 1 đơn vị cơ bản');
                        return false;
                      }
                      return true;
                    };

                    const handleAdd = () => {
                      add({
                        unitName: '',
                        conversionValue: fields.length === 0 ? 1 : 1, // giữ 1 mặc định
                        isBaseUnit: fields.length === 0, // dòng đầu là đơn vị cơ bản
                        barcode: '',
                      });
                      // sau khi add không cần toast trừ khi cố submit
                    };

                    const handleRemove = (name: number) => {
                      remove(name);
                      // kiểm tra ngay sau khi xoá
                      setTimeout(() => {
                        ensureUnitsValidityAndToast();
                      }, 0);
                    };
                    return (
                      <>
                        <Flex
                          align="center"
                          justify="space-between"
                          style={{ padding: '0 16px' }}
                        >
                          <Text strong style={{ fontSize: 16 }}>
                            Đơn vị tính
                          </Text>
                          <Button
                            type="primary"
                            size="middle"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                          >
                            Thêm đơn vị
                          </Button>
                        </Flex>

                        {/* Khung cuộn cho danh sách đơn vị */}
                        <div
                          style={{
                            maxHeight: 'calc(100vh - 460px)',
                            overflowY: 'auto',
                            paddingRight: 8,
                          }}
                        >
                          <Space direction="vertical" style={{ width: '100%' }}>
                            {fields.map(({ key, name, ...rest }) => {
                              const isBase = Boolean(units?.[name]?.isBaseUnit);

                              return (
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
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            'Mã vạch không được để trống',
                                        },
                                        {
                                          whitespace: true,
                                          message:
                                            'Mã vạch không được để trống',
                                        },
                                      ]}
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
                                        {
                                          required: true,
                                          message: 'Nhập hệ số quy đổi',
                                        },
                                      ]}
                                    >
                                      <InputNumber
                                        min={1}
                                        style={{ width: '100%' }}
                                        placeholder="VD: 1, 6, 24"
                                        // Chỉ đọc & khóa khi là đơn vị cơ bản
                                        readOnly={isBase}
                                      />
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
                                        onChange={() => {
                                          const list =
                                            form?.getFieldValue('units') || [];
                                          list.forEach(
                                            (u: any, idx: number) => {
                                              if (idx === name) {
                                                u.isBaseUnit = true;
                                                u.conversionValue = 1; // ép =1
                                              } else {
                                                u.isBaseUnit = false;
                                              }
                                            },
                                          );
                                          form?.setFieldsValue({ units: list });

                                          // Thông báo để người dùng thấy ngay
                                          const baseCount = list.filter(
                                            (u: any) => u?.isBaseUnit,
                                          ).length;
                                          if (baseCount !== 1) {
                                            message.error(
                                              'Phải có đúng 1 đơn vị cơ bản',
                                            );
                                          }
                                        }}
                                      />
                                    </FormItem>
                                  </Col>

                                  <Col span={1}>
                                    <Button
                                      icon={<DeleteOutlined />}
                                      type="text"
                                      danger
                                      onClick={() => handleRemove(name)}
                                    />
                                  </Col>
                                </Row>
                              );
                            })}
                          </Space>
                        </div>
                      </>
                    );
                  }}
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
