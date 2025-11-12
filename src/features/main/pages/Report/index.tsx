import {
  ReportCustomerSaleContainer,
  ReportSaleDailyContainer,
} from '@/features/main';

const ReportSaleDailyPage = () => {
  return (
    <>
      <title>Doanh số theo ngày</title>
      <ReportSaleDailyContainer />
    </>
  );
};

const ReportCustomerSalePage = () => {
  return (
    <>
      <title>Doanh số theo khách hàng</title>
      <ReportCustomerSaleContainer />
    </>
  );
};

export { ReportSaleDailyPage, ReportCustomerSalePage };
