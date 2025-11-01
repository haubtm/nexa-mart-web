import React from 'react';
import { Button, EPromotionStatus, Flex, formatDate, Table } from '@/lib';
import { EPromotionType, ITableProps } from '@/lib';
import { useHook } from './hook';
import { useCommonHook } from '@/features/main/containers/Promotion/hook';
import { IPromotionListResponse } from '@/dtos';
import { Empty, Tag } from 'antd';
import UpdatePromotionLineModal from '../UpdatePromotionLineModal';
import { SvgTrashIcon } from '@/assets';
import CreatePromotionDetailModal from '../CreatePromotionDetailModal';
import UpdatePromotionDetailModal from '../UpdatePromotionDetailModal';

// interface IPromotionTableProps {
//   ref: React.RefObject<IModalRef | null>;
//   setRecord: (
//     record: IPromotionListResponse['data']['content'][number],
//   ) => void;
// }

/* ---------- helpers (reuse from your current table) ---------- */
// const toNum = (v?: number | string) =>
//   v === null || v === undefined || v === '' ? undefined : Number(v);
// const fmtMoney = (v?: number | string) => {
//   const n = toNum(v);
//   if (n === undefined || Number.isNaN(n)) return '';
//   let s = n.toLocaleString('vi-VN', {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 2,
//   });
//   s = s.replace(/([,.])00$/, '');
//   return s + 'đ';
// };
// const fmtPercent = (v?: number | string) => {
//   const n = toNum(v);
//   if (n === undefined || Number.isNaN(n)) return '—';
//   let s = n.toLocaleString('vi-VN', {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 2,
//   });
//   s = s.replace(/([,.])00$/, '');
//   return `${s}%`;
// };
// const discountChip = (type?: string, value?: number | string) => {
//   if (!type) return '—';
//   if (type === 'FREE') return 'FREE';
//   if (type === 'PERCENTAGE') return fmtPercent(value);
//   return fmtMoney(value);
// };

/* ---------- Subtable level 2: Details under a Line ---------- */
const DetailsSubtable: React.FC<{
  line: IPromotionListResponse['data']['content'][number]['promotionLines'][number];
}> = ({ line }) => {
  const { handleDeleteDetail } = useHook();

  const details = (line as any)?.details || []; // theo response bạn đưa

  const columns: ITableProps<
    IPromotionListResponse['data']['content'][number]['promotionLines'][number]['details'][number]
  >['columns'] = [
    {
      key: 'summary',
      title: 'Tóm tắt',
      width: 300,
      dataIndex: 'promotionSummary',
      ellipsis: true,
    },
    {
      key: 'action',
      width: 20,
      fixed: 'right',
      align: 'center',
      render: (_: any, r) => (
        <Flex gap={8}>
          <div onClick={(e) => e.stopPropagation()}>
            <UpdatePromotionDetailModal
              record={r}
              promotionType={line.promotionType}
            />
          </div>
          <Button
            type="text"
            icon={<SvgTrashIcon width={18} height={18} />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteDetail([r.detailId], r);
            }}
          />
        </Flex>
      ),
    },
  ];

  if (!details.length)
    return (
      <Empty style={{ margin: 12 }} description="Chưa có chi tiết (detail)" />
    );

  return (
    <Table
      rowKey="detailId"
      size="small"
      pagination={false}
      columns={columns as any}
      dataSource={details}
      scroll={{ x: 1400 }}
    />
  );
};

const LinesSubtableV2: React.FC<{
  header: IPromotionListResponse['data']['content'][number];
  headerStartDate: string;
  headerEndDate: string;
}> = ({ header, headerStartDate, headerEndDate }) => {
  const { handleDeleteLine } = useHook();

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
        return { label: String(type), color: 'default' };
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
        return { label: String(status), color: 'default' };
    }
  };

  const columns: ITableProps<
    IPromotionListResponse['data']['content'][number]['promotionLines'][number]
  >['columns'] = [
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
      key: 'status',
      title: 'Trạng thái',
      width: 120,
      render: (_: any, r) => {
        const tag = getStatusTag(r.status);
        return <Tag color={tag.color}>{tag.label}</Tag>;
      },
    },
    {
      key: 'usage',
      title: 'Giới hạn',
      width: 200,
      render: (_: any, r) => (
        <>
          KH/khách: <b>{r.maxUsagePerCustomer ?? '—'}</b> • Tổng:{' '}
          <b>{r.maxUsageTotal ?? '—'}</b>
        </>
      ),
    },
    {
      key: 'start_at',
      title: 'Bắt đầu',
      width: 130,
      render: (_: any, r) => formatDate(r.startDate as string),
    },
    {
      key: 'end_at',
      title: 'Kết thúc',
      width: 130,
      render: (_: any, r) => formatDate(r.endDate as string),
    },
    {
      key: 'action',
      width: 110,
      fixed: 'right',
      align: 'center',
      render: (_: any, r) => (
        <Flex gap={8}>
          <div onClick={(e) => e.stopPropagation()}>
            <CreatePromotionDetailModal
              lineId={r.promotionLineId!}
              promotionType={r.promotionType}
            />
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <UpdatePromotionLineModal
              record={r}
              headerStartDate={headerStartDate}
              headerEndDate={headerEndDate}
            />
          </div>
          <Button
            type="text"
            icon={<SvgTrashIcon width={18} height={18} />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteLine([r.promotionLineId], r);
            }}
          />
        </Flex>
      ),
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
      expandable={{
        rowExpandable: (r) => Array.isArray((r as any)?.details),
        expandedRowRender: (r) => (
          <div style={{ padding: 0, background: '#fff' }}>
            <DetailsSubtable line={r as any} />
          </div>
        ),
      }}
    />
  );
};

const PromotionTable = () =>
  // { ref, setRecord }: IPromotionTableProps
  {
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
              <LinesSubtableV2
                header={record}
                headerStartDate={record.startDate}
                headerEndDate={record.endDate}
              />
            </div>
          ),
        }}
      />
    );
  };

export default PromotionTable;
