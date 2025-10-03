import React from 'react';
import { Button, EPromotionStatus, Flex, formatDate, Table } from '@/lib';
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
const toNum = (v?: number | string) =>
  v === null || v === undefined || v === '' ? undefined : Number(v);

const fmtMoney = (v?: number | string) => {
  const n = toNum(v);
  if (n === undefined || Number.isNaN(n)) return '';
  // Hiển thị tối đa 2 số thập phân, nhưng bỏ nếu .00
  let s = n.toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  // vi-VN dùng dấu phẩy làm phần thập phân => cắt ,00 hoặc .00 nếu có
  s = s.replace(/([,.])00$/, '');
  return s + 'đ';
};

const fmtPercent = (v?: number | string) => {
  const n = toNum(v);
  if (n === undefined || Number.isNaN(n)) return '—';
  // Giữ phần thập phân nếu khác 0 (vd 22.5%), bỏ nếu .00
  let s = n.toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  s = s.replace(/([,.])00$/, '');
  return `${s}%`;
};

const discountChip = (type?: string, value?: number | string) => {
  if (!type) return '—';
  if (type === 'FREE') return 'FREE';
  if (type === 'PERCENTAGE') return fmtPercent(value);
  return fmtMoney(value);
};

const normalizeSummary = (s?: string) => {
  if (!s) return s;
  let out = s;

  // 1) Phần trăm: "22.00%" | "22,00 %" | "22 %"
  out = out.replace(/(\d+(?:[.,]\d+)?)(\s*)%/g, (_m, num: string) => {
    // Chuẩn hoá "." là thập phân; bỏ mọi nhóm nghìn khác nếu có
    const canon = num.replace(/\s/g, '').replace(/,/g, '.');
    const n = Number(canon);
    if (Number.isFinite(n)) {
      let p = n.toLocaleString('vi-VN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
      p = p.replace(/([,.])00$/, ''); // bỏ .00 hoặc ,00 ở cuối
      return `${p}%`;
    }
    // Fallback: bỏ đuôi .00/,00 rồi giữ nguyên
    return `${num.replace(/([.,]00)$/, '')}%`;
  });

  // 2) Tiền tệ: "20000.00 đ" | "20000đ" | "1,000,000.00₫" | "20000.00đ)"
  //   - BỎ \b, dùng lookahead cho mọi dấu kết thúc hợp lý ( ) , . ; ! ? - khoảng trắng hoặc hết chuỗi )
  out = out.replace(
    /(\d+(?:[.,]\d+)?)(\s*)(đ|₫|vnđ|VNĐ)(?=[)\s,.;:!?-]|$)/gi,
    (_m, num: string, _sp: string, unit: string) => {
      // Chuẩn hoá chuỗi số:
      // - Nếu có cả ',' và '.' => giả định ',' là ngăn cách nghìn, '.' là thập phân -> bỏ ','
      // - Nếu chỉ có ',' => thường là ngăn cách nghìn trong dữ liệu BE -> bỏ ','
      // - Nếu chỉ có '.' => giữ '.' (thập phân)
      let canon = num.replace(/\s/g, '');
      if (canon.includes(',') && canon.includes('.')) {
        canon = canon.replace(/,/g, '');
      } else if (canon.includes(',')) {
        canon = canon.replace(/,/g, ''); // coi ',' là thousand sep
      }
      // Parse số, nếu NaN thì fallback: cắt .00 hoặc ,00 ở cuối
      const n = Number(canon);
      if (Number.isFinite(n)) {
        // Luôn hiển thị tiền VND không có thập phân + chấm mỗi 3 số
        const money = n.toLocaleString('vi-VN', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        const normalizedUnit =
          unit.toLowerCase() === 'vnđ' || unit === '₫' ? 'đ' : 'đ';
        return `${money}${normalizedUnit}`;
      }
      // Fallback: chỉ bỏ đuôi .00/,00 rồi giữ nguyên
      const normalizedUnit =
        unit.toLowerCase() === 'vnđ' || unit === '₫' ? 'đ' : 'đ';
      return `${num.replace(/([.,]00)$/, '')}${normalizedUnit}`;
    },
  );

  return out;
};

const LineSummary: React.FC<{
  line: IPromotionListResponse['data']['content'][number]['promotionLines'][number];
}> = ({ line }) => {
  const d = line.detail || {};

  // BUY_X_GET_Y -> "Mua x{buyMinQuantity} {unit} {name} tặng x{giftMaxQuantity} {unit} {name}"
  if (line.promotionType === EPromotionType.BUY_X_GET_Y) {
    // 1) Mua theo sản phẩm + số lượng
    if (d.buyProduct && d.buyMinQuantity) {
      const buy =
        `Mua x${d.buyMinQuantity} ${d.buyProduct.unitName ?? ''} ${d.buyProduct.productName}`.trim();
      const giftQty = d.giftMaxQuantity ?? 1;
      const giftLabel = d.giftProduct
        ? `x${giftQty} ${d.giftProduct.unitName ?? ''} ${d.giftProduct.productName}`
        : `x${giftQty}`;
      const giftOffer =
        d.giftDiscountType && d.giftDiscountType !== 'FREE'
          ? `, ${d.giftDiscountType === 'PERCENTAGE' ? fmtPercent(d.giftDiscountValue) : fmtMoney(d.giftDiscountValue)}`
          : '';
      return <span>{`${buy} tặng ${giftLabel}${giftOffer}`}</span>;
    }

    // 2) Mua theo danh mục + giá trị
    if (d.buyCategory && d.buyMinValue) {
      const buy = `Mua danh mục ${d.buyCategory.categoryName} từ ${fmtMoney(d.buyMinValue)}`;
      const giftQty = d.giftMaxQuantity ?? 1;
      const giftLabel = d.giftProduct
        ? `x${giftQty} ${d.giftProduct.unitName ?? ''} ${d.giftProduct.productName}`
        : `x${giftQty}`;
      const giftOffer =
        d.giftDiscountType && d.giftDiscountType !== 'FREE'
          ? `, ${d.giftDiscountType === 'PERCENTAGE' ? fmtPercent(d.giftDiscountValue) : fmtMoney(d.giftDiscountValue)}`
          : '';
      return <span>{`${buy} tặng ${giftLabel}${giftOffer}`}</span>;
    }

    // fallback cũ
    const cond = d.buyProduct
      ? `Mua ${d.buyProduct.productName} x${d.buyMinQuantity ?? 1}`
      : d.buyCategory
        ? `Mua danh mục ${d.buyCategory.categoryName} ≥ ${fmtMoney(d.buyMinValue)}`
        : '';
    const giftCore = discountChip(d.giftDiscountType, d.giftDiscountValue);
    const gift = d.giftProduct
      ? `Tặng ${d.giftProduct.productName} (${giftCore}) x${d.giftMaxQuantity ?? 1}`
      : `Tặng (${giftCore}) x${d.giftMaxQuantity ?? 1}`;
    return <span>{cond ? `${cond} → ${gift}` : gift}</span>;
  }

  // PRODUCT_DISCOUNT
  if (line.promotionType === EPromotionType.PRODUCT_DISCOUNT) {
    // Trường hợp yêu cầu: "giảm {value} khi mua x{qty} {unit} {name}"
    if (d.applyToType === 'PRODUCT' && d.applyToProduct) {
      const valueStr = discountChip(
        d.productDiscountType,
        d.productDiscountValue,
      );
      // Ưu tiên điều kiện theo số lượng sản phẩm được khuyến mại
      if (d.productMinPromotionQuantity) {
        return (
          <span>
            {`Giảm ${valueStr} khi mua x${d.productMinPromotionQuantity} ${d.applyToProduct.unitName ?? ''} ${d.applyToProduct.productName}`}
          </span>
        );
      }
      // Điều kiện theo giá trị sản phẩm KM
      if (d.productMinPromotionValue) {
        return (
          <span>
            {`Giảm ${valueStr} khi giá trị sản phẩm KM ≥ ${fmtMoney(d.productMinPromotionValue)} (${d.applyToProduct.productName})`}
          </span>
        );
      }
      // Điều kiện theo tổng giá trị đơn
      if (d.productMinOrderValue) {
        return (
          <span>
            {`Giảm ${valueStr} cho ${d.applyToProduct.productName} (Đơn ≥ ${fmtMoney(d.productMinOrderValue)})`}
          </span>
        );
      }
      // Không có điều kiện: nói ngắn gọn
      return (
        <span>{`Giảm ${valueStr} cho ${d.applyToProduct.productName}`}</span>
      );
    }

    // Các applyTo khác (ALL / CATEGORY) giữ format cũ rút gọn
    const valueStr = discountChip(
      d.productDiscountType,
      d.productDiscountValue,
    );
    let apply = 'Tất cả SP';
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
        {apply} • Giảm: <b>{valueStr}</b>
        {conds.length ? ` • ${conds.join(' • ')}` : ''}
      </span>
    );
  }

  // ORDER_DISCOUNT: giữ format cô đọng (đã bỏ .00 nhờ fmt*)
  if (line.promotionType === EPromotionType.ORDER_DISCOUNT) {
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

  return null;
};

/* -------- bảng con: dùng record.promotionLines trực tiếp -------- */
const LinesSubtable: React.FC<{
  header: IPromotionListResponse['data']['content'][number];
  headerStartDate: string;
  headerEndDate: string;
}> = ({ header, headerStartDate, headerEndDate }) => {
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
      // render: (
      //   _: any,
      //   r: IPromotionListResponse['data']['content'][number]['promotionLines'][number],
      // ) =>
      //   r.detail?.promotionSummary ? (
      //     normalizeSummary(r.detail.promotionSummary)
      //   ) : (
      //     <LineSummary line={r} />
      //   ),
      render: (_: any, r) => <LineSummary line={r} />,
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
      width: 200,
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
      key: 'start_at',
      title: 'Ngày bắt đầu',
      width: 130,
      render: (_, record) => formatDate(record?.startDate as string),
    },
    {
      key: 'end_at',
      title: 'Ngày kết thúc',
      width: 130,
      render: (_, record) => formatDate(record?.endDate as string),
    },
    {
      key: 'action',
      width: 90,
      fixed: 'right',
      align: 'center',
      render: (_, record) => {
        return (
          <Flex gap={8} style={{ display: 'inline-flex' }}>
            <div onClick={(e) => e.stopPropagation()}>
              <UpdatePromotionLineModal
                record={record}
                headerStartDate={headerStartDate}
                headerEndDate={headerEndDate}
              />
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
            <LinesSubtable
              header={record}
              headerStartDate={record.startDate}
              headerEndDate={record.endDate}
            />
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
