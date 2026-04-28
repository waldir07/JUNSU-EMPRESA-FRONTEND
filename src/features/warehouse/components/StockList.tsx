// src/features/warehouse/components/StockList.tsx
import { useRawStock, useFinishedStock } from '../hooks/useWarehouse';
import { StockItem } from '../types';

interface StockListProps {
  type: 'raw' | 'finished';
}

export default function StockList({ type }: StockListProps) {
  const rawQuery = useRawStock();
  const finishedQuery = useFinishedStock();

  const query = type === 'raw' ? rawQuery : finishedQuery;
  const { data: rawData = [], isLoading, error } = query;

  // Transformamos aquí (TS ahora entiende que rawData es StockItem[])
  const stock = rawData
    .filter((item: StockItem) => item.is_raw === (type === 'raw' ? 1 : 0))
    .map((item: StockItem) => ({
      id: item.id,
      name: item.product_variant?.product?.name || 'Sin nombre',
      quantity: item.quantity,
      unit: 'unidades',
      amperage: item.product_variant?.amperage,
      is_raw: item.is_raw,
      sku: item.product_variant?.sku,
      product_variant_id: item.product_variant_id,
    }));

  const title = type === 'raw' ? 'Stock de Materia Prima' : 'Stock de Producto Terminado';

  if (isLoading) {
    return <div className="text-center py-12 text-gray-600">Cargando {title.toLowerCase()}...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 bg-red-50 rounded-lg p-6">
        Error: {error.message || 'No se pudo cargar el stock'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">Total: {stock.length}</span>
      </div>

      {stock.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-500 text-lg">No hay elementos disponibles</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Nombre</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Cantidad</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Amperaje</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Unidad</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stock.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.amperage ?? '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.unit || 'unidades'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}