import {
  ReportCustomerSaleContainer,
  ReportPromotionContainer,
  ReportReturnContainer,
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

const ReportReturnPage = () => {
  return (
    <>
      <title>Báo cáo trả hàng</title>
      <ReportReturnContainer />
    </>
  );
};

const ReportPromotionPage = () => {
  return (
    <>
      <title>Báo cáo khuyến mãi</title>
      <ReportPromotionContainer />
    </>
  );
};

export {
  ReportSaleDailyPage,
  ReportCustomerSalePage,
  ReportReturnPage,
  ReportPromotionPage,
};
