import { Route, Routes } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import PublicLayout from '../layouts/PublicLayout'
import CatalogPage from '../pages/admin/CatalogPage'
import CustomerDetailPage from '../pages/admin/CustomerDetailPage'
import CustomersPage from '../pages/admin/CustomersPage'
import DashboardPage from '../pages/admin/DashboardPage'
import EmployeesPage from '../pages/admin/EmployeesPage'
import FinancePage from '../pages/admin/FinancePage'
import InventoryPage from '../pages/admin/InventoryPage'
import OrderDetailPage from '../pages/admin/OrderDetailPage'
import OrdersPage from '../pages/admin/OrdersPage'
import ProjectDetailPage from '../pages/admin/ProjectDetailPage'
import ProjectsPage from '../pages/admin/ProjectsPage'
import QuotationEditorPage from '../pages/admin/QuotationEditorPage'
import QuotationPrintPage from '../pages/admin/QuotationPrintPage'
import QuotationsPage from '../pages/admin/QuotationsPage'
import ReportsPage from '../pages/admin/ReportsPage'
import RequestDetailPage from '../pages/admin/RequestDetailPage'
import SettingsPage from '../pages/admin/SettingsPage'
import LoginPage from '../pages/auth/LoginPage'
import ContactPage from '../pages/public/ContactPage'
import HomePage from '../pages/public/HomePage'
import NotFoundPage from '../pages/public/NotFoundPage'
import PortfolioPage from '../pages/public/PortfolioPage'
import ProductsPage from '../pages/public/ProductsPage'
import QuotePage from '../pages/public/QuotePage'
import ServicesPage from '../pages/public/ServicesPage'
import { RequireAdmin, RequireAuth } from './RequireAuth'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="projects" element={<PortfolioPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="quote" element={<QuotePage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route
        path="admin/quotations/:id/print"
        element={
          <RequireAuth>
            <RequireAdmin>
              <QuotationPrintPage />
            </RequireAdmin>
          </RequireAuth>
        }
      />
      <Route
        path="admin"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route
          path="customers"
          element={
            <RequireAdmin>
              <CustomersPage />
            </RequireAdmin>
          }
        />
        <Route
          path="customers/:id"
          element={
            <RequireAdmin>
              <CustomerDetailPage />
            </RequireAdmin>
          }
        />
        <Route
          path="quotations"
          element={
            <RequireAdmin>
              <QuotationsPage />
            </RequireAdmin>
          }
        />
        <Route
          path="quotations/new"
          element={
            <RequireAdmin>
              <QuotationEditorPage />
            </RequireAdmin>
          }
        />
        <Route
          path="quotations/:id"
          element={
            <RequireAdmin>
              <QuotationEditorPage />
            </RequireAdmin>
          }
        />
        <Route
          path="requests/:id"
          element={
            <RequireAdmin>
              <RequestDetailPage />
            </RequireAdmin>
          }
        />
        <Route
          path="orders"
          element={
            <RequireAdmin>
              <OrdersPage />
            </RequireAdmin>
          }
        />
        <Route
          path="orders/:id"
          element={
            <RequireAdmin>
              <OrderDetailPage />
            </RequireAdmin>
          }
        />
        <Route
          path="finance"
          element={
            <RequireAdmin>
              <FinancePage />
            </RequireAdmin>
          }
        />
        <Route
          path="reports"
          element={
            <RequireAdmin>
              <ReportsPage />
            </RequireAdmin>
          }
        />
        <Route
          path="catalog"
          element={
            <RequireAdmin>
              <CatalogPage />
            </RequireAdmin>
          }
        />
        <Route
          path="employees"
          element={
            <RequireAdmin>
              <EmployeesPage />
            </RequireAdmin>
          }
        />
        <Route
          path="settings"
          element={
            <RequireAdmin>
              <SettingsPage />
            </RequireAdmin>
          }
        />
      </Route>
    </Routes>
  )
}
