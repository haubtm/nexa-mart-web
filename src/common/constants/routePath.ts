export const ROUTE_PATH = {
  HOME: {
    PATH: () => `/`,
  },
  ADMIN: {
    PATH: () => `/admin`,
    DASHBOARD: {
      PATH: () => `/admin/dashboard`,
    },
    PRODUCT: {
      PATH: () => `/admin/product`,
    },
    EMPLOYEE: {
      PATH: () => `/admin/employee`,
    },
    SETTING: {
      PATH: () => `/admin/setting`,
    },
  },
  AUTH: {
    PATH: () => `/auth`,
    LOGIN: {
      PATH: () => `${ROUTE_PATH.AUTH.PATH()}/login`,
    },
    FORGOT_PASSWORD: {
      PATH: () => `${ROUTE_PATH.AUTH.PATH()}/forgot-password`,
    },
  },
  EMPLOYEE: {
    PATH: () => `/employee`,
    DASHBOARD: {
      PATH: () => `${ROUTE_PATH.EMPLOYEE.PATH()}/dashboard`,
    },
  },
};
