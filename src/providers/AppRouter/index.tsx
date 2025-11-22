import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AdminRoute, AuthRoute, SaleRoute } from './routes';
import { NotFoundPage, ROUTE_PATH } from '@/common';
import QueryParamProvider from '../QueryParam';
import { getStorageItem, STORAGE_KEY, clearStorage, ERole } from '@/lib';
import type { RootState } from '@/redux/store';

const WithQueryParams = () => (
  <QueryParamProvider>
    <Outlet />
  </QueryParamProvider>
);

const isTokenExpired = (): boolean => {
  const token = getStorageItem<string>(STORAGE_KEY.TOKEN);
  const tokenExpiry = getStorageItem<number>(STORAGE_KEY.TOKEN_EXPIRY);

  if (!token || !tokenExpiry) return false;

  // Kiểm tra xem token đã hết hạn hay chưa
  const currentTime = Date.now();
  return currentTime > tokenExpiry;
};

const RoleBasedRedirect = () => {
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const userRole = userProfile?.userRole;

  // Nếu là ADMIN, chuyển hướng đến admin
  if (userRole === ERole.ADMIN) {
    return <Navigate to={ROUTE_PATH.ADMIN.PATH()} replace />;
  }

  // Nếu là STAFF, chuyển hướng đến sale
  if (userRole === ERole.STAFF) {
    return <Navigate to={ROUTE_PATH.SALE.ORDER.PATH()} replace />;
  }

  // Nếu không có role hoặc role không xác định, chuyển về login
  return <Navigate to={ROUTE_PATH.AUTH.LOGIN.PATH()} replace />;
};

const PrivateRoute = () => {
  const token = getStorageItem<string>(STORAGE_KEY.TOKEN);

  // Nếu không có token hoặc token hết hạn
  if (!token || isTokenExpired()) {
    clearStorage();
    return <Navigate to={ROUTE_PATH.AUTH.LOGIN.PATH()} replace />;
  }

  return <WithQueryParams />;
};

const AdminOnlyRoute = () => {
  const token = getStorageItem<string>(STORAGE_KEY.TOKEN);
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const userRole = userProfile?.userRole;

  // Kiểm tra token
  if (!token || isTokenExpired()) {
    clearStorage();
    return <Navigate to={ROUTE_PATH.AUTH.LOGIN.PATH()} replace />;
  }

  // Nếu có profile và không phải ADMIN, redirect /sale
  // Nếu chưa có profile, để render (sẽ load profile trong App.tsx)
  if (userProfile && userRole !== ERole.ADMIN) {
    return <Navigate to={ROUTE_PATH.SALE.PATH()} replace />;
  }

  return <WithQueryParams />;
};

const SaleAndAdminRoute = () => {
  const token = getStorageItem<string>(STORAGE_KEY.TOKEN);

  // Kiểm tra token
  if (!token || isTokenExpired()) {
    clearStorage();
    return <Navigate to={ROUTE_PATH.AUTH.LOGIN.PATH()} replace />;
  }

  // ADMIN và STAFF đều được vào
  return <WithQueryParams />;
};

const AppRouterProvider = () => {
  return (
    <BrowserRouter>
      <Routes>
        {AuthRoute()}

        {/* Route chính - redirect dựa vào role */}
        <Route path={ROUTE_PATH.HOME.PATH()} element={<PrivateRoute />}>
          <Route index element={<RoleBasedRedirect />} />
        </Route>

        {/* Admin routes - chỉ ADMIN được vào, STAFF redirect /sale */}
        <Route element={<AdminOnlyRoute />}>{AdminRoute()}</Route>

        {/* Sale routes - ADMIN và STAFF đều được vào */}
        <Route element={<SaleAndAdminRoute />}>{SaleRoute()}</Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouterProvider;
