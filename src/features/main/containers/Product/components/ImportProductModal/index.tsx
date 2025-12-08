import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, ModalNew } from '@/lib';
import { Upload } from 'antd';
import { useHook } from './hook';

const ImportProductModal = () => {
  const {
    ref,
    fileList,
    setFileList,
    isImporting,
    handleOpen,
    handleCancel,
    handleSubmit,
  } = useHook();

  return (
    <>
      <Button icon={<UploadOutlined />} onClick={handleOpen}>
        Nhập Excel
      </Button>
      <ModalNew
        ref={ref}
        title="Nhập sản phẩm từ Excel"
        okText="Nhập"
        cancelText="Hủy"
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={isImporting}
        openButton={<></>}
        destroyOnClose
      >
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <a
            href="https://image.hovinhduy.id.vn/import/template_import_san_pham%20(2).xlsx"
            target="_blank"
            rel="noopener noreferrer"
          >
            📥 Tải file mẫu (template)
          </a>
        </div>
        <Upload.Dragger
          accept=".xlsx,.xls"
          fileList={fileList}
          beforeUpload={() => false}
          onChange={({ fileList: newFileList }) => {
            setFileList(newFileList.slice(-1));
          }}
          maxCount={1}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          </p>
          <p className="ant-upload-text">
            Kéo thả hoặc click để chọn file Excel
          </p>
          <p className="ant-upload-hint">Chỉ hỗ trợ file .xlsx, .xls</p>
        </Upload.Dragger>
      </ModalNew>
    </>
  );
};

export default ImportProductModal;
