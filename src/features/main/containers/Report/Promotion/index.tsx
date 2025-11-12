import React, { useMemo, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import {
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  Table,
  Typography,
  Empty,
  Spin,
  Divider,
  Button,
  Statistic,
} from 'antd';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { useDebounce } from '@/lib';
import { useReportPromotion } from '@/features/main';

const { RangePicker } = DatePicker;
const { Title } = Typography;

interface IPromotionItem {
  promotionCode: string;
  promotionName: string;
  startDate: string;
  endDate: string;
  promotionType: 'BUY_X_GET_Y' | 'ORDER_DISCOUNT' | 'PRODUCT_DISCOUNT';
  giftProductCode: string | null;
  giftProductName: string | null;
  giftQuantity: number | null;
  giftUnit: string | null;
  discountAmount: number | null;
  usageLimit: number | null;
  usageCount: number;
  remainingCount: number | null;
}

interface IReportResponseData {
  promotionList: IPromotionItem[];
  totalGiftQuantity: number;
  totalDiscountAmount: number;
  totalBudget: number;
  totalUsed: number;
  totalRemaining: number;
}

const fmtMoney = (v?: number) =>
  typeof v === 'number' ? v.toLocaleString('vi-VN') : '—';

const fmtDate = (d?: string) => (d ? dayjs(d).format('DD/MM/YYYY') : '—');

const StyledWrapper = styled.div`
  padding: 16px;
`;

const ReportPromotionContainer: React.FC = () => {
  const [form] = Form.useForm();
  const [promotionCode, setPromotionCode] = useState('');
  const promotionCodeDebounced = useDebounce(promotionCode);
  const [queryParams, setQueryParams] = useState<{
    fromDate?: string;
    toDate?: string;
    promotionCode?: string;
  }>(() => ({
    fromDate: dayjs().format('YYYY-MM-DD'),
    toDate: dayjs().format('YYYY-MM-DD'),
  }));

  const { data: reportResp, isLoading: isReportLoading } = useReportPromotion({
    ...queryParams,
    promotionCode: promotionCodeDebounced,
  } as any);
  const reportData: IReportResponseData | undefined = reportResp?.data;

  const tableRows = useMemo(() => {
    return (reportData?.promotionList ?? []).map((item, idx) => ({
      key: idx,
      stt: idx + 1,
      promotionCode: item.promotionCode,
      promotionName: item.promotionName,
      startDate: fmtDate(item.startDate),
      endDate: fmtDate(item.endDate),
      promotionType: item.promotionType,
      giftProductCode: item.giftProductCode,
      giftProductName: item.giftProductName,
      giftQuantity: item.giftQuantity,
      giftUnit: item.giftUnit,
      discountAmount: item.discountAmount,
      usageLimit: item.usageLimit,
      usageCount: item.usageCount,
      remainingCount: item.remainingCount,
    }));
  }, [reportData]);

  const columns: ColumnsType<any> = [
    { title: 'STT', dataIndex: 'stt', width: 60, align: 'center' },
    { title: 'Mã CTKM', dataIndex: 'promotionCode', width: 150 },
    { title: 'Tên CTKM', dataIndex: 'promotionName', width: 200 },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      width: 130,
      align: 'center',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      width: 130,
      align: 'center',
    },
    {
      title: 'Loại CTKM',
      dataIndex: 'promotionType',
      width: 140,
      render: (v: string) => {
        const typeMap: Record<string, string> = {
          BUY_X_GET_Y: 'Mua X tặng Y',
          ORDER_DISCOUNT: 'Giảm giá đơn',
          PRODUCT_DISCOUNT: 'Giảm giá sản phẩm',
        };
        return typeMap[v] || v;
      },
    },
    {
      title: 'Mã SP tặng',
      dataIndex: 'giftProductCode',
      width: 120,
      render: (v) => v || '—',
    },
    {
      title: 'Tên SP tặng',
      dataIndex: 'giftProductName',
      width: 160,
      render: (v) => v || '—',
    },
    {
      title: 'SL tặng',
      dataIndex: 'giftQuantity',
      width: 100,
      align: 'right',
      render: (v) => v ?? '—',
    },
    {
      title: 'Đơn vị tặng',
      dataIndex: 'giftUnit',
      width: 110,
      render: (v) => v || '—',
    },
    {
      title: 'Số tiền chiết khấu',
      dataIndex: 'discountAmount',
      width: 150,
      align: 'right',
      render: (v) => fmtMoney(v),
    },
    {
      title: 'Giới hạn sử dụng',
      dataIndex: 'usageLimit',
      width: 140,
      align: 'right',
      render: (v) => v ?? '—',
    },
    {
      title: 'Đã sử dụng',
      dataIndex: 'usageCount',
      width: 120,
      align: 'right',
    },
    {
      title: 'Còn lại',
      dataIndex: 'remainingCount',
      width: 120,
      align: 'right',
      render: (v) => v ?? '—',
    },
  ];

  const onFinish = (values: any) => {
    const [from, to] = values.dateRange || [];
    setQueryParams({
      fromDate: from ? dayjs(from).format('YYYY-MM-DD') : undefined,
      toDate: to ? dayjs(to).format('YYYY-MM-DD') : undefined,
      promotionCode: promotionCodeDebounced,
    });
  };

  return (
    <StyledWrapper>
      <Card
        style={{ marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
        bordered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ dateRange: [dayjs(), dayjs()] }}
        >
          <Row gutter={[12, 12]}>
            <Col xs={24} md={10}>
              <Form.Item
                label="Từ ngày - Đến ngày"
                name="dateRange"
                rules={[{ required: true, message: 'Chọn khoảng ngày' }]}
              >
                <RangePicker
                  style={{ width: '100%' }}
                  allowClear={false}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Mã CTKM">
                <Input
                  placeholder="Nhập mã khuyến mãi"
                  value={promotionCode}
                  onChange={(e) => setPromotionCode(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item label=" " style={{ marginBottom: 0 }}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Lấy báo cáo
                  </Button>
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setPromotionCode('');
                      setQueryParams({
                        fromDate: dayjs().format('YYYY-MM-DD'),
                        toDate: dayjs().format('YYYY-MM-DD'),
                      });
                    }}
                  >
                    Làm mới
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }} bordered>
        <Row
          align="middle"
          justify="space-between"
          style={{ marginBottom: 12 }}
        >
          <Col>
            <Title level={5} style={{ margin: 0 }}>
              BÁO CÁO TỔNG KẾT CTKM
            </Title>
          </Col>
          <Col>{isReportLoading && <Spin />}</Col>
        </Row>

        <Table
          columns={columns}
          dataSource={tableRows}
          pagination={false}
          loading={isReportLoading}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có dữ liệu"
              />
            ),
          }}
          scroll={{ x: 1800 }}
          size="small"
        />

        {reportData && (
          <div style={{ marginTop: 24 }}>
            <Divider />
            <Title level={5}>Tóm tắt CTKM</Title>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Tổng SL tặng"
                  value={reportData.totalGiftQuantity}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Tổng chiết khấu"
                  value={fmtMoney(reportData.totalDiscountAmount)}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Ngân sách tổng"
                  value={fmtMoney(reportData.totalBudget)}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Đã sử dụng"
                  value={fmtMoney(reportData.totalUsed)}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Còn lại"
                  value={fmtMoney(reportData.totalRemaining)}
                />
              </Col>
            </Row>
          </div>
        )}
      </Card>
    </StyledWrapper>
  );
};

export { ReportPromotionContainer };
