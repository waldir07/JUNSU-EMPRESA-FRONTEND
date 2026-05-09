import { Route, Routes } from "react-router-dom";
import StoreLayout from "./components/StoreLayout";
import StoreDashboard from "./components/StoreDashboard";
import ReceiveInventoryPage from "./components/ReceiveInventoryPage";
import StoreStockList from "./components/StoreStockList";

export default function StoreRoutes() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<StoreDashboard />} />
        <Route path="receive" element={<ReceiveInventoryPage />} />
        <Route path="stock" element={<StoreStockList />} />
        {/* Aquí irán las rutas de Ventas más adelante */}
      </Route>
    </Routes>
  );
}