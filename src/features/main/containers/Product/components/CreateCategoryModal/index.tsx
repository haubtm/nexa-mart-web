import { Button, Form, FormItem, Input, ModalNew, Text } from '@/lib';
import { useHook } from './hook';
import { Col, Row, TreeSelect } from 'antd';
import { ICategoryCreateRequest } from '@/dtos';

const CreateCategoryModal = () => {
  const {
    ref,
    form,
    isLoadingCreateCategory,
    rules,
    submitForm,
    handleCancel,
    isLoadingCategories,
    categories,
  } = useHook();

  return (
    <ModalNew
      ref={ref}
      width={600}
      title="Thêm danh mục"
      confirmLoading={isLoadingCreateCategory}
      onOk={form.submit}
      onCancel={handleCancel}
      openButton={
        <Button onClick={() => ref.current?.open()} type="link">
          <Text style={{ color: '#1890ff', fontSize: 14 }}>Tạo mới</Text>
        </Button>
      }
    >
      <Form form={form} onFinish={submitForm}>
        <Row gutter={16}>
          <Col span={24}>
            <FormItem<ICategoryCreateRequest>
              label="Tên danh mục"
              name="name"
              required
              rules={[rules]}
            >
              <Input placeholder="Nhập tên danh mục" />
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem<ICategoryCreateRequest>
              label="Danh mục cha"
              name="parentId"
              rules={[rules]}
            >
              <TreeSelect
                placeholder="Chọn danh mục"
                treeDefaultExpandAll
                allowClear
                loading={isLoadingCategories}
                treeData={
                  categories?.data.map((category) => ({
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
        </Row>
      </Form>
    </ModalNew>
  );
};

export default CreateCategoryModal;
