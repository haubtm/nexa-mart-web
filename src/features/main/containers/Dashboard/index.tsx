import { useState } from 'react';
import { Card, Col, Row, Select, Statistic, Table, Skeleton } from 'antd';
import {
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserAddOutlined,
  DollarOutlined,
  SwapOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import {
  useMetrics,
  useRevenueChart,
  useTopProduct,
} from '@/features/main/react-query';
import { EDashboardSortDirection, EPeriod } from '@/lib';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const DashboardWrapper = styled.div`
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
`;

const StatsCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: none;

  .ant-statistic-title {
    font-size: 14px;
    color: #8c92a4;
    margin-bottom: 12px;
  }

  .ant-statistic-content {
    font-size: 28px;
    font-weight: 600;
    color: #2c3e50;
  }
`;

const ChartCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: none;

  .ant-card-head {
    padding: 20px;
    border-bottom: 1px solid #f0f2f5;
  }

  .ant-card-body {
    padding: 20px;
  }
`;

const TopProductsCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: none;

  .ant-card-head {
    padding: 20px;
    border-bottom: 1px solid #f0f2f5;
  }

  .ant-card-body {
    padding: 20px;
  }
`;

const DashboardContainer = () => {
  const [period, setPeriod] = useState<EPeriod>(EPeriod.TODAY);
  const [sortBy, setSortBy] = useState<EDashboardSortDirection>(
    EDashboardSortDirection.REVENUE,
  );

  const { data: topProducts, isFetching: isFetchingTopProducts } =
    useTopProduct({
      period,
      sortBy,
    });

  const { data: revenueChart, isFetching: isFetchingRevenueChart } =
    useRevenueChart({
      period,
    });

  const { data: metrics, isFetching: isFetchingMetrics } = useMetrics({
    period,
  });

  const isLoading =
    isFetchingTopProducts || isFetchingRevenueChart || isFetchingMetrics;

  interface TopProduct {
    productUnitId: number;
    productId: number;
    productName: string;
    unitName: string;
    barcode: string;
    totalQuantitySold: number;
    totalRevenue: number;
    rank: number;
  }

  const topProductsColumns = [
    {
      title: 'Xếp hạng',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      align: 'center' as const,
      render: (rank: number) => (
        <span
          style={{
            backgroundColor:
              rank === 1 ? '#ffd666' : rank === 2 ? '#d9d9d9' : '#ff7a45',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 'bold',
          }}
        >
          #{rank}
        </span>
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (_text: string, record: TopProduct) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.productName}</div>
          <div style={{ fontSize: '12px', color: '#8c92a4' }}>
            {record.unitName} - {record.barcode}
          </div>
        </div>
      ),
    },
    {
      title: 'Số lượng bán',
      dataIndex: 'totalQuantitySold',
      key: 'totalQuantitySold',
      align: 'right' as const,
      render: (quantity: number) => (
        <span style={{ fontWeight: 500, color: '#0050b3' }}>
          {quantity.toLocaleString('vi-VN')}
        </span>
      ),
    },
    {
      title: 'Doanh thu',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      align: 'right' as const,
      render: (revenue: number) => (
        <span style={{ fontWeight: 500, color: '#52c41a' }}>
          {revenue.toLocaleString('vi-VN')} đ
        </span>
      ),
    },
  ];

  const chartData = revenueChart?.details || [];

  return (
    <DashboardWrapper>
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '28px',
                  fontWeight: 600,
                  color: '#2c3e50',
                }}
              >
                Bảng điều khiển
              </h1>
              <p
                style={{
                  margin: '8px 0 0 0',
                  color: '#8c92a4',
                  fontSize: '14px',
                }}
              >
                Tổng quan kinh doanh của bạn
              </p>
            </div>
            <Select
              value={period}
              onChange={setPeriod}
              style={{ width: 250 }}
              options={[
                { label: 'Hôm nay', value: EPeriod.TODAY },
                { label: 'Hôm qua', value: EPeriod.YESTERDAY },
                { label: 'Tuần này', value: EPeriod.THIS_WEEK },
                { label: 'Tháng này', value: EPeriod.THIS_MONTH },
                { label: 'Năm này', value: EPeriod.THIS_YEAR },
              ]}
              size="large"
            />
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard loading={isLoading}>
            <Statistic
              title="Doanh thu"
              value={metrics?.totalRevenue || 0}
              prefix={<DollarOutlined style={{ color: '#1890ff' }} />}
              suffix="đ"
              valueStyle={{ color: '#1890ff' }}
              formatter={(value) =>
                typeof value === 'number'
                  ? value.toLocaleString('vi-VN')
                  : value
              }
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard loading={isLoading}>
            <Statistic
              title="Hóa đơn"
              value={metrics?.invoicesCount || 0}
              prefix={<ShoppingCartOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) =>
                typeof value === 'number'
                  ? value.toLocaleString('vi-VN')
                  : value
              }
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard loading={isLoading}>
            <Statistic
              title="Đơn hàng"
              value={metrics?.ordersCount || 0}
              prefix={<ShoppingOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
              formatter={(value) =>
                typeof value === 'number'
                  ? value.toLocaleString('vi-VN')
                  : value
              }
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard loading={isLoading}>
            <Statistic
              title="Khách hàng mới"
              value={metrics?.newCustomersCount || 0}
              prefix={<UserAddOutlined style={{ color: '#f5222d' }} />}
              valueStyle={{ color: '#f5222d' }}
            />
          </StatsCard>
        </Col>
      </Row>

      {/* Additional Metrics */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <StatsCard loading={isLoading}>
            <Statistic
              title="Giá trị đơn hàng"
              value={metrics?.ordersTotalAmount || 0}
              prefix={<DollarOutlined />}
              suffix="đ"
              valueStyle={{ color: '#1890ff', fontSize: '20px' }}
              formatter={(value) =>
                typeof value === 'number'
                  ? value.toLocaleString('vi-VN')
                  : value
              }
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatsCard loading={isLoading}>
            <Statistic
              title="Lợi suất doanh thu"
              value={
                metrics?.invoicesTotalAmount && metrics?.ordersTotalAmount
                  ? (
                      (metrics.invoicesTotalAmount /
                        metrics.ordersTotalAmount) *
                      100
                    ).toFixed(1)
                  : 0
              }
              suffix="%"
              valueStyle={{ color: '#52c41a', fontSize: '20px' }}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatsCard loading={isLoading}>
            <Statistic
              title="Hoàn trả"
              value={metrics?.returnsCount || 0}
              prefix={<SwapOutlined />}
              valueStyle={{ color: '#f5222d', fontSize: '20px' }}
            />
          </StatsCard>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <ChartCard
            title="Doanh thu theo ngày"
            loading={isFetchingRevenueChart}
          >
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" stroke="#8c92a4" />
                  <YAxis stroke="#8c92a4" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                    }}
                    formatter={(value) =>
                      typeof value === 'number'
                        ? value.toLocaleString('vi-VN')
                        : value
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1890ff"
                    strokeWidth={2}
                    dot={false}
                    name="Doanh thu (đ)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton active />
            )}
          </ChartCard>
        </Col>
        <Col xs={24} lg={12}>
          <ChartCard
            title="Số hóa đơn theo ngày"
            loading={isFetchingRevenueChart}
          >
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" stroke="#8c92a4" />
                  <YAxis stroke="#8c92a4" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="invoiceCount"
                    fill="#52c41a"
                    radius={[8, 8, 0, 0]}
                    name="Số hóa đơn"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton active />
            )}
          </ChartCard>
        </Col>
      </Row>

      {/* Top Products */}
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <TopProductsCard
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <LineChartOutlined
                  style={{ marginRight: 8, color: '#1890ff' }}
                />
                <span>Top sản phẩm bán chạy</span>
              </div>
            }
            extra={
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 250 }}
                options={[
                  {
                    label: 'Theo doanh thu',
                    value: EDashboardSortDirection.REVENUE,
                  },
                  {
                    label: 'Theo số lượng',
                    value: EDashboardSortDirection.QUANTITY,
                  },
                ]}
                size="large"
              />
            }
            loading={isFetchingTopProducts}
          >
            <Table
              columns={topProductsColumns}
              dataSource={topProducts?.topProducts || []}
              rowKey={(record) => `${record.productUnitId}`}
              pagination={false}
              loading={isFetchingTopProducts}
              scroll={{ x: 600 }}
            />
          </TopProductsCard>
        </Col>
      </Row>
    </DashboardWrapper>
  );
};

export { DashboardContainer };
