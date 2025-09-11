import { Button, Form, FormItem, Input, ModalNew, Text } from '@/lib';
import { useHook } from './hook';
import { Col, Row } from 'antd';
import { IBrandCreateRequest } from '@/dtos';

const CreateBrandModal = () => {
  const { ref, form, rules, submitForm, handleCancel, isLoadingCreateBrand } =
    useHook();

  return (
    <ModalNew
      ref={ref}
      width={600}
      title="Thêm thương hiệu"
      confirmLoading={isLoadingCreateBrand}
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
            <FormItem<IBrandCreateRequest>
              label="Tên thương hiệu"
              name="name"
              required
              rules={[rules]}
            >
              <Input placeholder="Nhập tên thương hiệu" />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </ModalNew>
  );
};

export default CreateBrandModal;
