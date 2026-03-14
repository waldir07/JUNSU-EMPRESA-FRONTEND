// src/features/warehouse/components/WarehouseDashboard.tsx
import { Link } from "react-router-dom";
import {
  useRawStock,
  useFinishedStock,
  useLowStockRaw,
} from "../hooks/useWarehouse";

export default function WarehouseDashboard() {
  const rawQuery = useRawStock();
  const finishedQuery = useFinishedStock();
  const lowStockQuery = useLowStockRaw(50); // threshold ajustable

  const rawCount = rawQuery.data?.length ?? 0;
  const finishedCount = finishedQuery.data?.length ?? 0;
  const lowStockCount = lowStockQuery.data?.low_stocks?.length ?? 0; // ajusta si tu response tiene low_stocks

  const isLoading =
    rawQuery.isLoading || finishedQuery.isLoading || lowStockQuery.isLoading;

  if (isLoading) {
    return (
      <div className="space-y-8 p-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Almacén</h1>
        <div className="text-center py-12 text-gray-600">
          Cargando datos del almacén...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Almacén</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="stock/raw"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-200 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-xl font-semibold mb-2 text-blue-700">
              Stock Materia Prima
            </h3>
            <p className="text-4xl font-bold text-gray-800 mb-1">{rawCount}</p>
            <p className="text-sm text-gray-600">
              {rawCount === 1
                ? "material registrado"
                : "materiales registrados"}
            </p>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Ver y gestionar materias primas
          </p>
        </Link>

        <Link
          to="stock/finished"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-200 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-xl font-semibold mb-2 text-green-700">
              Stock Producto Terminado
            </h3>
            <p className="text-4xl font-bold text-gray-800 mb-1">
              {finishedCount}
            </p>
            <p className="text-sm text-gray-600">
              {finishedCount === 1 ? "producto listo" : "productos listos"}
            </p>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Productos terminados para distribución
          </p>
        </Link>

        <Link
          to="alerts"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-200 flex flex-col justify-between relative"
        >
          <div>
            <h3 className="text-xl font-semibold mb-2 text-red-700">
              Alertas Bajo Stock
            </h3>
            <p className="text-4xl font-bold text-gray-800 mb-1">
              {lowStockCount}
            </p>
            <p className="text-sm text-gray-600">
              {lowStockCount === 1 ? "material crítico" : "materiales críticos"}
            </p>
          </div>
          {lowStockCount > 0 && (
            <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              ¡Atención!
            </span>
          )}
          <p className="mt-4 text-sm text-gray-500">
            Ver materiales con stock bajo
          </p>
        </Link>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-xl font-semibold mb-3 text-indigo-800">
          Acción Rápida
        </h3>
        <Link
          to="transform"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Transformar Materia Prima →
        </Link>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="font-medium">Debug rápido:</p>
        <pre className="text-sm overflow-auto max-h-60">
          Raw: {JSON.stringify(rawQuery.data, null, 2)}
          {"\n\n"}
          Finished: {JSON.stringify(finishedQuery.data, null, 2)}
          {"\n\n"}
          Low Stock Raw: {JSON.stringify(lowStockQuery.data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
