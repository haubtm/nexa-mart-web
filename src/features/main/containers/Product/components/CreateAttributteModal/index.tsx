import { Button, Form, FormItem, Input, ModalNew } from '@/lib';
import { useHook } from './hook';
import { Col, Row } from 'antd';
import { IAttributeCreateRequest } from '@/dtos';

const CreateAttributeModal = () => {
  const {
    ref,
    form,
    rules,
    submitForm,
    handleCancel,
    isLoadingCreateAttribute,
  } = useHook();

  return (
    <ModalNew
      ref={ref}
      width={600}
      title="Thêm thuộc tính"
      confirmLoading={isLoadingCreateAttribute}
      onOk={form.submit}
      onCancel={handleCancel}
      openButton={
        <Button
          style={{ width: '100%' }}
          type="primary"
          onClick={() => ref.current?.open()}
        >
          Tạo mới
        </Button>
      }
    >
      <Form form={form} onFinish={submitForm}>
        <Row gutter={16}>
          <Col span={24}>
            <FormItem<IAttributeCreateRequest>
              label="Tên thuộc tính"
              name="name"
              required
              rules={[rules]}
            >
              <Input placeholder="Nhập tên thuộc tính" />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </ModalNew>
  );
};

export default CreateAttributeModal;
