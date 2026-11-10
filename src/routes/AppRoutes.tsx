import type { ReactNode } from 'react'
import { Route, Routes as Switch } from 'react-router-dom'
import { ROUTE_NAMES } from '@/src/constatns/a-routes'
import { RoleEnums } from '@/src/enum'
import WarehousesPage from '@/src/pages/warehouses/WarehousesPage'
import DrinksPage from '@/src/pages/drinks/DrinksPage'
import ProformasPage from '@/src/pages/proformas/ProformasPage'
import CompanyPage from '@/src/pages/company/CompanyPage'
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
      path: ROUTE_NAMES.proformas,
      element: (
        <ProtectedRoute allowedRoles={ALL_ROLES}>
          <ProformasPage />
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
