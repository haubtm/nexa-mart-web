import { ROUTE_PATH } from '@/common';
import {
  BaseLayout as AdminBaseLayout,
  DashboardPage as AdminDashboardPage,
  ProductPage as AdminProductPage,
  EmployeePage as AdminEmployeePage,
  SettingPage as AdminSettingPage,
  StockTakePage as AdminStockTakePage,
} from '@/features/main';
import { getStorageItem, STORAGE_KEY } from '@/lib';
import QueryParamProvider from '@/providers/QueryParam';
import { Navigate, Route } from 'react-router-dom';

const AdminMiddleware = () => {
  const token = getStorageItem<string>(STORAGE_KEY.TOKEN);

  if (!token) return <Navigate to={ROUTE_PATH.AUTH.LOGIN.PATH()} replace />;

  return (
    <QueryParamProvider>
      <AdminBaseLayout />
    </QueryParamProvider>
  );
};

export const AdminRoute = () => {
  return (
    <Route path={ROUTE_PATH.ADMIN.PATH()} element={<AdminMiddleware />}>
      <Route
        index
        element={<Navigate to={ROUTE_PATH.ADMIN.DASHBOARD.PATH()} replace />}
      />
      <Route
        path={ROUTE_PATH.ADMIN.DASHBOARD.PATH()}
        element={<AdminDashboardPage />}
      />
      <Route
        path={ROUTE_PATH.ADMIN.PRODUCT.PATH()}
        element={<AdminProductPage />}
      />
      <Route
        path={ROUTE_PATH.ADMIN.EMPLOYEE.PATH()}
        element={<AdminEmployeePage />}
      />
      <Route
        path={ROUTE_PATH.ADMIN.SETTING.PATH()}
        element={<AdminSettingPage />}
      />
      <Route
        path={ROUTE_PATH.ADMIN.STOCK_TAKE.PATH()}
        element={<AdminStockTakePage />}
      />
    </Route>
  );
};
