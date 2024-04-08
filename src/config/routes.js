export const ROUTES_AUTH = {
  LOGIN: '/auth/login',
}

export const ROUTES_ADMIN = {
  HOME: '/admin',
  DASHBOARD: '/admin/dashboard',
  MOTOTYPE: '/admin/mototype',
  MOTO: {
    INDEX: '/admin/motos',
    CREATE: '/admin/motos/create',
    UPDATE: '/admin/motos/:id',
  },
  PRODUCTS: {
    INDEX: '/admin/products',
    CREATE: '/admin/products/create',
    UPDATE: '/admin/products/:id',
  },
  ORDER: {
    INDEX: '/admin/orders',
    UPDATE: '/admin/orders/:id',
  },
  USER: {
    INDEX: '/admin/users',
    UPDATE: '/admin/users/:id',
  },
  ROLES: {
    INDEX: '/admin/roles',
    CREATE: '/admin/roles/create',
    UPDATE: '/admin/roles/:id',
  },
  RENT_PACKAGES: '/admin/rent-packages',
}

export const ROUTES_USER = {
  HOME: '/',
}
