// src/routes/index.tsx
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";

import LoginForm from "@/features/auth/components/LoginForm"; // sin llaves si es default export
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Role } from "@/types/user";
import AppLayout from "@/layouts/AppLayout";
import WarehouseRoutes from "@/features/warehouse/WarehouseRoutes";

// Componente dummy (corrige la sintaxis)
const Dashboard = ({ title }: { title: string }) => (
  <div className="p-8 text-2xl font-bold">{title} Dashboard</div>
);
const AdminDashboard = () => (
  <AppLayout
    title="Admin Dashboard"
    sidebarItems={[
      { label: "Usuarios", path: "/admin/users" },
      { label: "Reportes", path: "/admin/reports" },
      // agrega más después
    ]}
  >
    <p className="text-lg">Contenido del admin: usuarios, reportes, etc.</p>
  </AppLayout>
);

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

  // Admin
  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [{ path: "/admin", element: <AdminDashboard /> }],
  },

  // Warehouse - ¡aquí está la clave!
  {
    element: <ProtectedRoute allowedRoles={["WAREHOUSE", "ADMIN"]} />,
    children: [
      {
        path: "/warehouse/*", // ← el * permite todas las sub-rutas
        element: <WarehouseRoutes />,
      },
    ],
  },

  // Store
  {
    element: <ProtectedRoute allowedRoles={["STORE", "ADMIN"]} />,
    children: [{ path: "/store", element: <StoreDashboard /> }],
  },

  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "*", element: <div>404 - Página no encontrada</div> }, // fallback global
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
