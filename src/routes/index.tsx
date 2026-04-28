// src/routes/index.tsx
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  Link,
} from "react-router-dom";

import LoginForm from "@/features/auth/components/LoginForm"; // sin llaves si es default export
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Role } from "@/types/user";
import AppLayout from "@/layouts/AppLayout";
import WarehouseRoutes from "@/features/warehouse/WarehouseRoutes";
import AdminProductsList from "@/features/admin/components/AdminProductsList"; // ← nuevo import
import AdminProductForm from "@/features/admin/components/AdminProductForm"; // ← nuevo import (si lo usas como página)

import AdminLayout from "@/features/admin/AdminLayout";
import WarehouseLayout from "@/features/warehouse/WarehouseLayout";
import StockList from "@/features/warehouse/components/StockList";
import TransformForm from "@/features/warehouse/components/TransformForm";
import AdminDashboardContent from "@/features/admin/components/AdminDashboardContent";
import AdminUsers from "@/features/admin/components/AdminUsers";
import AdminProducts from "@/features/admin/components/AdminProducts";
import ImportacionesPage from "@/features/admin/components/ImportacionesPage";
import WarehouseDashboardContent from "@/features/warehouse/components/WarehouseDashboardContent";

// Componente dummy (corrige la sintaxis)

const WarehouseDashboard = () => (
  <AppLayout
    title="Warehouse Dashboard"
    sidebarItems={[
      { label: "Stock Raw", path: "/warehouse/stock" },
      { label: "Transformaciones", path: "/warehouse/transform" },
    ]}
  >
    <p className="text-lg">
      Contenido del warehouse: stock raw materials, transformaciones.
    </p>
  </AppLayout>
);

const StoreDashboard = () => (
  <AppLayout
    title="Store Dashboard"
    sidebarItems={[
      { label: "Ventas", path: "/store/sales" },
      { label: "Stock Finished", path: "/store/stock" },
    ]}
  >
    <p className="text-lg">
      Contenido del store: ventas, stock finished products.
    </p>
  </AppLayout>
);

function ProtectedRoute({ allowedRoles }: { allowedRoles: Role[] }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

// src/routes/index.tsx
// ... imports iguales ...

const router = createBrowserRouter([
  { path: "/login", element: <LoginForm /> },

  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardContent /> },
          { path: "users", element: <AdminUsers /> },
          { path: "products", element: <AdminProducts /> },

          // ← NUEVA RUTA AQUÍ
          { path: "importaciones", element: <ImportacionesPage /> },

          { path: "reports", element: <div>Reportes (en construcción)</div> },
          // Agrega más rutas aquí
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={["WAREHOUSE", "ADMIN"]} />,
    children: [
      {
        path: "/warehouse",
        element: <WarehouseLayout />,
        children: [
          { index: true, element: <WarehouseDashboardContent /> },
          // Tus rutas de warehouse
          { path: "stock/raw", element: <StockList type="raw" /> },
          { path: "stock/finished", element: <StockList type="finished" /> },
          { path: "transform", element: <TransformForm /> },
          // ...
        ],
      },
    ],
  },

  // Store
  {
    element: <ProtectedRoute allowedRoles={["STORE", "ADMIN"]} />,
    children: [{ path: "/store", element: <StoreDashboard /> }],
  },

  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "*", element: <div>404 - Página no encontrada</div> },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
