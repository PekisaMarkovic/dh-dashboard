import type { ReactNode } from 'react'
import { Route, Routes as Switch } from 'react-router-dom'
import { ROUTE_NAMES } from '@/src/constatns/routes'
import { RoleEnums } from '@/src/enum'
import WarehousesPage from '@/src/pages/warehouses/WarehousesPage'
import PurchaseImportPage from '@/src/pages/purchase-import/PurchaseImportPage'
import DrinksPage from '@/src/pages/drinks/DrinksPage'
import CategoriesPage from '@/src/pages/categories/CategoriesPage'
import EditProformaPage from '@/src/pages/proformas/EditProformaPage'
import CreateProformaPage from '@/src/pages/proformas/CreateProformaPage'
import CustomersPage from '@/src/pages/customers/CustomersPage'
import ProformasPage from '@/src/pages/proformas/ProformasPage'
import CompanyPage from '@/src/pages/company/CompanyPage'
import WebsitePage from '@/src/pages/website/WebsitePage'
import LogInPage from '@/src/pages/log-in/LogInPage'
import NotFoundPage from '@/src/pages/not-found/NotFoundPage'
import ProtectedRoute from './ProtectedRoute'
import FirstTimeRegisterPage from '@/src/pages/log-in/FirstTimeRegisterPage'
import UserProfilePage from '@/src/pages/profile/UserProfilePage'

const ALL_ROLES = [RoleEnums.USER, RoleEnums.ADMIN, RoleEnums.SUPER_ADMIN]
const ADMIN_ROLES = [RoleEnums.ADMIN, RoleEnums.SUPER_ADMIN]

type Route = {
  path: string
  element: ReactNode
  children?: Route[]
}

const AppRoutes = () => {
  const appRoutes: Route[] = [
    {
      path: ROUTE_NAMES.index,
      element: <LogInPage />,
    },

    {
      path: ROUTE_NAMES.firtTimeRegister,
      element: <FirstTimeRegisterPage />,
    },

    {
      path: ROUTE_NAMES.profile,
      element: (
        <ProtectedRoute allowedRoles={ALL_ROLES}>
          <UserProfilePage />
        </ProtectedRoute>
      ),
    },

    {
      path: ROUTE_NAMES.warehouses,
      element: (
        <ProtectedRoute allowedRoles={ALL_ROLES}>
          <WarehousesPage />
        </ProtectedRoute>
      ),
    },

    {
      path: ROUTE_NAMES.drinks,
      element: (
        <ProtectedRoute allowedRoles={ALL_ROLES}>
          <DrinksPage />
        </ProtectedRoute>
      ),
    },

    {
      path: ROUTE_NAMES.categories,
      element: (
        <ProtectedRoute allowedRoles={ALL_ROLES}>
          <CategoriesPage />
        </ProtectedRoute>
      ),
    },

    {
      path: ROUTE_NAMES.purchaseImport,
      element: (
        <ProtectedRoute allowedRoles={ADMIN_ROLES}>
          <PurchaseImportPage />
        </ProtectedRoute>
      ),
    },

    {
      path: ROUTE_NAMES.customers,
      element: (
        <ProtectedRoute allowedRoles={ALL_ROLES}>
          <CustomersPage />
        </ProtectedRoute>
      ),
    },

    {
      path: ROUTE_NAMES.createProforma,
      element: (
        <ProtectedRoute allowedRoles={ALL_ROLES}>
          <CreateProformaPage />
        </ProtectedRoute>
      ),
    },

    {
      path: ROUTE_NAMES.editProforma,
      element: (
        <ProtectedRoute allowedRoles={ADMIN_ROLES}>
          <EditProformaPage />
        </ProtectedRoute>
      ),
    },

    {
      path: ROUTE_NAMES.proformas,
      element: (
        <ProtectedRoute allowedRoles={ALL_ROLES}>
          <ProformasPage />
        </ProtectedRoute>
      ),
    },

    {
      path: ROUTE_NAMES.website,
      element: (
        <ProtectedRoute allowedRoles={ADMIN_ROLES}>
          <WebsitePage />
        </ProtectedRoute>
      ),
    },

    {
      path: ROUTE_NAMES.company,
      element: (
        <ProtectedRoute allowedRoles={ADMIN_ROLES}>
          <CompanyPage />
        </ProtectedRoute>
      ),
    },

    {
      path: '*',
      element: <NotFoundPage />,
    },
  ]

  return (
    <Switch>
      {appRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element}>
          {route.children?.map((childRoute) => <Route key={childRoute.path} path={childRoute.path} element={childRoute.element} />)}
        </Route>
      ))}
    </Switch>
  )
}

export default AppRoutes
