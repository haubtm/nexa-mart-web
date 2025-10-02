import React from 'react';
import { Button, EPromotionStatus, Flex, Table } from '@/lib';
import { EPromotionType, IModalRef, ITableProps } from '@/lib';
import { useHook } from './hook';
import { useCommonHook } from '@/features/main/containers/Promotion/hook';
import { IPromotionListResponse } from '@/dtos';
import { Empty, Tag } from 'antd';
import UpdatePromotionLineModal from '../UpdatePromotionLineModal';
import { SvgTrashIcon } from '@/assets';

interface IPromotionTableProps {
  ref: React.RefObject<IModalRef | null>;
  setRecord: (
    record: IPromotionListResponse['data']['content'][number],
  ) => void;
}

/* -------- helpers để hiển thị gọn Line -------- */
const fmtMoney = (v?: number) =>
  typeof v === 'number' ? v.toLocaleString('vi-VN') + 'đ' : '';

const discountChip = (type?: string, value?: number) => {
  if (!type) return '—';
  if (type === 'FREE') return 'FREE';
  if (type === 'PERCENTAGE') return (value ?? 0) + '%';
  return fmtMoney(value);
};

const LineSummary: React.FC<{
  line: IPromotionListResponse['data']['content'][number]['promotionLines'][number];
}> = ({ line }) => {
  const d = line.detail || {};

  if (line.promotionType === 'ORDER_DISCOUNT') {
    const core = discountChip(d.orderDiscountType, d.orderDiscountValue);
    const cap =
      d.orderDiscountType === 'PERCENTAGE' && d.orderDiscountMaxValue
        ? ` (tối đa ${fmtMoney(d.orderDiscountMaxValue)})`
        : '';
    const conds: string[] = [];
    if (d.orderMinTotalValue)
      conds.push(`Đơn ≥ ${fmtMoney(d.orderMinTotalValue)}`);
    if (d.orderMinTotalQuantity)
      conds.push(`SL KM (đơn) ≥ ${d.orderMinTotalQuantity}`);
    return (
      <span>
        Giảm đơn: <b>{core}</b>
        {cap}
        {conds.length ? ` • ${conds.join(' • ')}` : ''}
      </span>
    );
  }

  if (line.promotionType === 'PRODUCT_DISCOUNT') {
    const core = discountChip(d.productDiscountType, d.productDiscountValue);
    let apply = 'Tất cả SP';
    if (d.applyToType === 'PRODUCT' && d.applyToProduct)
      apply = `SP: ${d.applyToProduct.productName}`;
    if (d.applyToType === 'CATEGORY' && d.applyToCategory)
      apply = `Danh mục: ${d.applyToCategory.categoryName}`;
    const conds: string[] = [];
    if (d.productMinOrderValue)
      conds.push(`Đơn ≥ ${fmtMoney(d.productMinOrderValue)}`);
    if (d.productMinPromotionValue)
      conds.push(`Giá trị SP KM ≥ ${fmtMoney(d.productMinPromotionValue)}`);
    if (d.productMinPromotionQuantity)
      conds.push(`SL SP KM ≥ ${d.productMinPromotionQuantity}`);
    return (
      <span>
        {apply} • Giảm: <b>{core}</b>
        {conds.length ? ` • ${conds.join(' • ')}` : ''}
      </span>
    );
  }

  // BUY_X_GET_Y
  const cond = d.buyProduct
    ? `Mua ${d.buyProduct.productName} x${d.buyMinQuantity ?? 1}`
    : d.buyCategory
      ? `Mua danh mục ${d.buyCategory.categoryName} ≥ ${fmtMoney(d.buyMinValue)}`
      : '';
  const giftCore = discountChip(d.giftDiscountType, d.giftDiscountValue);
  const gift = d.giftProduct
    ? `Tặng ${d.giftProduct.productName} (${giftCore}) x${d.giftMaxQuantity ?? 1}`
    : `Tặng (${giftCore}) x${d.giftMaxQuantity ?? 1}`;
  return (
    <span>
      {cond} → {gift}
    </span>
  );
};

/* -------- bảng con: dùng record.promotionLines trực tiếp -------- */
const LinesSubtable: React.FC<{
  header: IPromotionListResponse['data']['content'][number];
}> = ({ header }) => {
  const lines = header?.promotionLines || [];

  const getPromotionTypeTag = (type: EPromotionType) => {
    switch (type) {
      case EPromotionType.BUY_X_GET_Y:
        return { label: 'Mua X tặng Y', color: '#FFB800' };
      case EPromotionType.ORDER_DISCOUNT:
        return { label: 'Giảm giá đơn hàng', color: '#00BFFF' };
      case EPromotionType.PRODUCT_DISCOUNT:
        return { label: 'Giảm giá sản phẩm', color: '#FF4500' };
      default:
        return type;
    }
  };

  const getStatusTag = (status: EPromotionStatus) => {
    switch (status) {
      case EPromotionStatus.ACTIVE:
        return { label: 'Đang hoạt động', color: 'green' };
      case EPromotionStatus.PAUSED:
        return { label: 'Tạm dừng', color: 'orange' };
      case EPromotionStatus.EXPIRED:
        return { label: 'Hết hạn', color: 'red' };
      case EPromotionStatus.UPCOMING:
        return { label: 'Sắp diễn ra', color: 'blue' };
      case EPromotionStatus.CANCELLED:
        return { label: 'Đã hủy', color: 'darkred' };
      default:
        return status;
    }
  };

  const columns: ITableProps<
    IPromotionListResponse['data']['content'][number]['promotionLines'][number]
  >['columns'] = [
    {
      key: 'idx',
      title: 'STT',
      width: 56,
      render: (_: any, __: any, i: number) => i + 1,
    },
    { key: 'code', title: 'Mã', dataIndex: 'promotionCode', width: 160 },
    {
      key: 'type',
      title: 'Loại',
      width: 160,
      render: (_: any, r) => {
        const tag = getPromotionTypeTag(r.promotionType);
        return <Tag color={tag.color}>{tag.label}</Tag>;
      },
    },
    {
      key: 'summary',
      title: 'Tóm tắt',
      width: 520,
      render: (
        _: any,
        r: IPromotionListResponse['data']['content'][number]['promotionLines'][number],
      ) =>
        r.detail?.promotionSummary ? (
          r.detail.promotionSummary
        ) : (
          <LineSummary line={r} />
        ),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      width: 120,
      render: (
        _: any,
        r: IPromotionListResponse['data']['content'][number]['promotionLines'][number],
      ) => {
        const tag = getStatusTag(r.status);
        return <Tag color={tag.color}>{tag.label}</Tag>;
      },
    },
    {
      key: 'usage',
      title: 'Giới hạn',
      width: 180,
      render: (
        _: any,
        r: IPromotionListResponse['data']['content'][number]['promotionLines'][number],
      ) => {
        const a = r.maxUsagePerCustomer ?? '—';
        const b = r.maxUsageTotal ?? '—';
        return (
          <>
            KH/khách: <b>{a}</b> • Tổng: <b>{b}</b>
          </>
        );
      },
    },

    {
      key: 'action',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_, record) => {
        return (
          <Flex gap={8} style={{ display: 'inline-flex' }}>
            <div onClick={(e) => e.stopPropagation()}>
              <UpdatePromotionLineModal record={record} />
            </div>
            <Button
              type="text"
              icon={<SvgTrashIcon width={18} height={18} />}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </Flex>
        );
      },
    },
  ];

  if (!lines.length)
    return (
      <Empty style={{ margin: 12 }} description="Chưa có promotion line" />
    );
  return (
    <Table
      rowKey="promotionLineId"
      size="small"
      pagination={false}
      columns={columns as any}
      dataSource={lines}
      scroll={{ x: 1100 }}
    />
  );
};

const PromotionTable = ({ ref, setRecord }: IPromotionTableProps) => {
  const { columns } = useHook();
  const {
    queryParams,
    setQueryParams,
    promotionListData,
    isPromotionListLoading,
  } = useCommonHook();

  const dataSource: IPromotionListResponse['data']['content'] =
    promotionListData?.data?.content || [];

  return (
    <Table<IPromotionListResponse['data']['content'][number]>
      rowKey="promotionId"
      columns={columns}
      dataSource={dataSource}
      loading={isPromotionListLoading}
      pagination={{
        total: promotionListData?.data?.totalElements,
        current: (promotionListData?.data?.number ?? 0) + 1,
        pageSize: promotionListData?.data?.size ?? 10,
        onChange: (page, pageSize) =>
          setQueryParams({
            ...queryParams,
            page: page - 1,
            size: pageSize,
          }),
      }}
      expandable={{
        rowExpandable: (record) => Array.isArray(record?.promotionLines),
        expandedRowRender: (record) => (
          <div style={{ padding: 0, background: '#fafafa' }}>
            <LinesSubtable header={record} />
          </div>
        ),
      }}
      onRow={(record) => ({
        // onClick: () => setRecord(record),
        style: { cursor: 'pointer' },
      })}
    />
  );
};

export default PromotionTable;
