// src/features/warehouse/WarehouseRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import WarehouseDashboard from './components/WarehouseDashboard';
import StockList from './components/StockList';
import TransformForm from './components/TransformForm';
import MovementsList from './components/MovementsList';
import LowStockAlerts from './components/LowStockAlerts';

export default function WarehouseRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WarehouseDashboard />} />
      <Route path="stock/raw" element={<StockList type="raw" />} />
      <Route path="stock/finished" element={<StockList type="finished" />} />
      <Route path="transform" element={<TransformForm />} />
      <Route path="movements" element={<MovementsList />} />
      <Route path="alerts" element={<LowStockAlerts />} />
      <Route path="*" element={<Navigate to="/warehouse" replace />} />
    </Routes>
  );
}