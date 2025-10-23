import { ROUTE_PATH } from '@/common';
import {
  BaseLayout as SaleBaseLayout,
  SalePage as SaleOrderPage,
} from '@/features/sale';
import { DashboardPage as AdminDashboardPage } from '@/features/main';
import { getStorageItem, STORAGE_KEY } from '@/lib';
import QueryParamProvider from '@/providers/QueryParam';
import { Navigate, Route } from 'react-router-dom';

const SaleMiddleware = () => {
  const token = getStorageItem<string>(STORAGE_KEY.TOKEN);

  if (!token) return <Navigate to={ROUTE_PATH.AUTH.LOGIN.PATH()} replace />;

  return (
    <QueryParamProvider>
      <SaleBaseLayout />
    </QueryParamProvider>
  );
};

export const SaleRoute = () => {
  return (
    <Route path={ROUTE_PATH.SALE.PATH()} element={<SaleMiddleware />}>
      <Route
        index
        element={<Navigate to={ROUTE_PATH.SALE.DASHBOARD.PATH()} replace />}
      />
      <Route
        path={ROUTE_PATH.SALE.DASHBOARD.PATH()}
        element={<AdminDashboardPage />}
      />
      <Route path={ROUTE_PATH.SALE.ORDER.PATH()} element={<SaleOrderPage />} />
    </Route>
  );
};
