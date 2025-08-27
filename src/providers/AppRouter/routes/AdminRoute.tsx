import { ROUTE_PATH } from '@/common';
import {
  BaseLayout as AdminBaseLayout,
  DashboardPage as AdminDashboardPage,
  ProductPage as AdminProductPage,
} from '@/features/main';

// import { getStorageItem, STORAGE_KEY } from '@/lib';
import QueryParamProvider from '@/providers/QueryParam';
import { Navigate, Route } from 'react-router-dom';

const AdminMiddleware = () => {
  //   const token = getStorageItem<string>(STORAGE_KEY.TOKEN);
  //   const platform = getStorageItem<RoleEnum>(STORAGE_KEY.PLATFORM);

  //   if (!token) return <Navigate to={ROUTE_PATH.AUTH.LOGIN.PATH()} replace />;

  //   if (platform !== RoleEnum.MANAGER) {
  //     return <Navigate to={ROUTE_PATH.HOME.PATH()} replace />;
  //   }

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
    </Route>
  );
};
