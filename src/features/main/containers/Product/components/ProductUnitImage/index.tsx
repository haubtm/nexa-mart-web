import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Empty,
  Image,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Space,
  Upload,
  message,
} from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { PlusOutlined, PictureTwoTone } from '@ant-design/icons';

import {
  useProductImageById, // lấy thư viện ảnh của product (để gán cho unit)
} from '@/features/main/react-query';

import {
  useProductUnitImageAssign, // gán ảnh có sẵn + đặt ảnh chính
  useProductUnitImagePrimary, // đổi ảnh chính
  useProductUnitImageById, // lấy danh sách ảnh của unit
  useProductUnitImageUpload, // upload ảnh mới cho unit
} from '@/features/main/react-query';

import { useNotification } from '@/lib';

type UnitImageManagerProps = {
  productId: number;
  productUnitId: number;
  maxUpload?: number; // mặc định 6
};

const UnitImageManager = ({
  productId,
  productUnitId,
  maxUpload = 6,
}: UnitImageManagerProps) => {
  const { notify } = useNotification();

  // ====== Query data ======
  const { data: unitImageData, refetch } = useProductUnitImageById({
    productUnitId,
  });

  const { data: productImageData, isPending: isProductImageLoading } =
    useProductImageById({ productId });

  // ====== Mutations ======
  const { mutateAsync: assignUnitImage, isPending: isAssigning } =
    useProductUnitImageAssign();
  const { mutateAsync: primaryUnitImage } = useProductUnitImagePrimary();
  const { mutateAsync: uploadUnitImage, isPending: isUploading } =
    useProductUnitImageUpload();

  // ====== Local state ======
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [chooseModalOpen, setChooseModalOpen] = useState(false);
  const [selectedFromLibrary, setSelectedFromLibrary] = useState<number[]>([]);
  const [selectedPrimaryFromLibrary, setSelectedPrimaryFromLibrary] = useState<
    number | null
  >(null);

  // current unit images
  const unitImages = unitImageData?.data?.images ?? [];
  const unitPrimary = unitImageData?.data?.primaryImage ?? null;

  // product image library
  const productLibrary = useMemo(
    () =>
      (productImageData?.data ?? []).map((x: any) => ({
        imageId: x.imageId,
        imageUrl: x.imageUrl,
        imageAlt: x.imageAlt,
      })),
    [productImageData],
  );

  // ====== Upload config (giống style cũ để đồng bộ UX) ======
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    listType: 'picture-card',
    fileList,
    accept: 'image/*',
    beforeUpload: (file) => {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Ảnh phải nhỏ hơn 2MB!');
        return Upload.LIST_IGNORE;
      }

      const okType =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/webp';
      if (!okType) {
        message.error('Chỉ hỗ trợ JPG/PNG/WEBP!');
        return Upload.LIST_IGNORE;
      }

      if (fileList.length >= maxUpload) {
        message.error(`Tối đa ${maxUpload} ảnh/lần tải lên!`);
        return Upload.LIST_IGNORE;
      }

      return false; // để tự control upload
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList.slice(0, maxUpload));
    },
    onPreview: async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as File);
      }
      setPreviewImage(file.url || (file.preview as string) || '');
      setPreviewOpen(true);
    },
    onRemove: (file) => {
      setFileList((lst) => lst.filter((x) => x.uid !== file.uid));
    },
  };

  // ====== Actions ======
  const handleUploadSubmit = async () => {
    try {
      const files = fileList
        .map((f) => f.originFileObj as File | undefined)
        .filter((f): f is File => !!f);

      if (!files.length) {
        message.info('Hãy chọn ít nhất một ảnh để tải lên.');
        return;
      }

      // Nếu unit đang chưa có ảnh chính, ảnh đầu tiên trong batch sẽ set isPrimary = true
      const hasPrimary = !!unitPrimary;
      await Promise.all(
        files.map((file, idx) =>
          uploadUnitImage({
            productUnitId,
            imageAlt: file.name,
            isPrimary: !hasPrimary && idx === 0, // set primary nếu chưa có
            displayOrder: unitImages.length + idx,
            imageFile: file,
          }),
        ),
      );

      notify('success', {
        message: 'Thành công',
        description: 'Tải ảnh lên thành công.',
      });
      setFileList([]);
      await refetch?.();
    } catch (error: any) {
      notify('error', {
        message: 'Thất bại',
        description: error?.message || 'Không thể tải ảnh.',
      });
    }
  };

  const openChooseModal = () => {
    setSelectedFromLibrary([]);
    setSelectedPrimaryFromLibrary(null);
    setChooseModalOpen(true);
  };

  const handleAssignFromLibrary = async () => {
    if (!selectedFromLibrary.length) {
      message.info('Hãy chọn ít nhất một ảnh từ thư viện sản phẩm.');
      return;
    }
    // nếu không chọn primary trong modal, fallback: dùng ảnh đầu tiên
    const primaryImageId = selectedPrimaryFromLibrary ?? selectedFromLibrary[0];

    try {
      await assignUnitImage({
        productUnitId,
        primaryImageId,
        // ✅ GỬI TẤT CẢ ẢNH ĐÃ CHỌN (không loại ảnh chính)
        productImageIds: selectedFromLibrary,
      });

      notify('success', {
        message: 'Đã gán ảnh',
        description: 'Gán ảnh từ thư viện sản phẩm thành công.',
      });
      setChooseModalOpen(false);
      await refetch?.();
    } catch (error: any) {
      notify('error', {
        message: 'Thất bại',
        description: error?.message || 'Không thể gán ảnh.',
      });
    }
  };

  const handleSetPrimary = async (productImageId: number) => {
    try {
      await primaryUnitImage({
        productUnitId,
        productImageId,
      });
      notify('success', {
        message: 'Đã đặt ảnh chính',
        description: 'Cập nhật ảnh chính thành công.',
      });
      await refetch?.();
    } catch (error: any) {
      notify('error', {
        message: 'Thất bại',
        description: error?.message || 'Không thể đặt ảnh chính.',
      });
    }
  };

  // ====== Render helpers ======
  const renderUnitImages = () => {
    if (!unitImages.length) {
      return (
        <Empty
          image={<PictureTwoTone style={{ fontSize: 48 }} />}
          description="Chưa có ảnh cho đơn vị tính này"
        />
      );
    }

    return (
      <Row gutter={[12, 12]}>
        {unitImages.map((it: any) => {
          const pid = it?.productImage?.imageId;
          const url = it?.productImage?.imageUrl;
          const isPrimary = !!it?.isPrimary;

          return (
            <Col span={8} key={it.id}>
              <Card
                size="small"
                cover={
                  <div style={{ padding: 8, textAlign: 'center' }}>
                    <Image
                      src={url}
                      alt={String(pid)}
                      width="100%"
                      height={180}
                      style={{ objectFit: 'contain' }}
                      preview={{ mask: 'Xem' }}
                    />
                  </div>
                }
                actions={[
                  <Radio
                    key="primary"
                    checked={isPrimary}
                    onChange={() => handleSetPrimary(pid)}
                  >
                    Ảnh chính
                  </Radio>,
                ]}
              />
            </Col>
          );
        })}
      </Row>
    );
  };

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Hàng nút hành động */}
        <Space wrap>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openChooseModal}
            loading={isProductImageLoading || isAssigning}
          >
            Thêm từ thư viện sản phẩm
          </Button>

          <Popconfirm
            title="Tải lên ảnh mới cho đơn vị?"
            onConfirm={handleUploadSubmit}
            okText="Tải lên"
            cancelText="Hủy"
            okButtonProps={{ loading: isUploading }}
          >
            <Button loading={isUploading}>Tải lên ảnh mới</Button>
          </Popconfirm>

          <span style={{ color: '#999' }}>
            Mỗi ảnh ≤ 2MB • JPG/PNG/WEBP • Tối đa {maxUpload} ảnh/lần
          </span>
        </Space>

        {/* Upload area */}
        <Upload {...uploadProps}>
          {fileList.length >= maxUpload ? null : (
            <div style={{ width: 100, height: 100 }}>
              <div
                style={{
                  display: 'flex',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <PlusOutlined />
                <div>Thêm ảnh</div>
              </div>
            </div>
          )}
        </Upload>

        {/* Danh sách ảnh của Unit */}
        {renderUnitImages()}

        {/* Preview for upload */}
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (v) => setPreviewOpen(v),
            afterOpenChange: (v) => !v && setPreviewImage(''),
          }}
          src={previewImage || undefined}
        />
      </Space>

      {/* Modal chọn ảnh từ thư viện product */}
      <Modal
        title="Chọn ảnh từ thư viện sản phẩm"
        open={chooseModalOpen}
        onOk={handleAssignFromLibrary}
        okText="Gán ảnh"
        onCancel={() => setChooseModalOpen(false)}
        confirmLoading={isAssigning}
        width={900}
        style={{
          top: 20,
        }}
      >
        {productLibrary.length ? (
          <Row gutter={[12, 12]}>
            {productLibrary.map((img: any) => {
              const checked = selectedFromLibrary.includes(img.imageId);
              const isChosenPrimary =
                selectedPrimaryFromLibrary === img.imageId;

              return (
                <Col span={8} key={img.imageId}>
                  <Card
                    size="small"
                    hoverable
                    onClick={() => {
                      setSelectedFromLibrary((prev) =>
                        checked
                          ? prev.filter((id) => id !== img.imageId)
                          : [...prev, img.imageId],
                      );
                    }}
                    cover={
                      <div style={{ padding: 8, textAlign: 'center' }}>
                        <Image
                          src={img.imageUrl}
                          alt={img.imageAlt ?? `image-${img.imageId}`}
                          width="100%"
                          height={160}
                          style={{ objectFit: 'contain' }}
                          preview={{ mask: 'Xem' }}
                        />
                      </div>
                    }
                    title={
                      <Space align="center">
                        <Radio
                          checked={isChosenPrimary}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() =>
                            setSelectedPrimaryFromLibrary(img.imageId)
                          }
                        >
                          Ảnh chính
                        </Radio>
                      </Space>
                    }
                    extra={
                      <span style={{ color: checked ? '#52c41a' : '#999' }}>
                        {checked ? 'Đã chọn' : 'Chưa chọn'}
                      </span>
                    }
                  />
                </Col>
              );
            })}
          </Row>
        ) : (
          <Empty description="Thư viện ảnh sản phẩm trống" />
        )}
      </Modal>
    </div>
  );
};

export default UnitImageManager;
