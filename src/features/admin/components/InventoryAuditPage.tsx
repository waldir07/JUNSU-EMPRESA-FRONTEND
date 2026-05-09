import { useEffect, useState } from 'react';
import { getPendingAdjustments, approveAdjustment, rejectAdjustment } from '@/features/inventory/api/inventoryApi';
import { useToast } from '@/components/ToastProvider';

interface Adjustment {
  id: number;
  product: { name: string; base_code: string };
  user: { name: string };
  warehouse: { name: string };
  quantity: number;
  reason: string;
  notes: string;
  created_at: string;
}

export default function InventoryAuditPage() {
  const [pending, setPending] = useState<Adjustment[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  const loadData = async () => {
    try {
      const data = await getPendingAdjustments();
      setPending(data);
    } catch (err) {
      error("No se pudieron cargar los ajustes pendientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAction = async (id: number, type: 'APPROVE' | 'REJECT') => {
    try {
      if (type === 'APPROVE') {
        await approveAdjustment(id);
        success("¡Ajuste aprobado! El stock ha sido actualizado.");
      } else {
        await rejectAdjustment(id);
        success("Ajuste rechazado.");
      }
      setPending(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      error("Error al procesar la acción.");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Cargando solicitudes de Dios...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800">Auditoría de Inventario</h1>
        <p className="text-gray-500 font-medium">Revisa y autoriza los movimientos de merma o ajustes manuales.</p>
      </div>

      {pending.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-200 text-center">
          <span className="text-5xl">🎉</span>
          <p className="mt-4 text-gray-500 font-bold">¡Todo al día! No hay ajustes pendientes de aprobación.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white text-[11px] uppercase tracking-widest">
                <th className="px-6 py-4">Operario</th>
                <th className="px-6 py-4">Producto / SKU</th>
                <th className="px-6 py-4">Ubicación</th>
                <th className="px-6 py-4 text-center">Cantidad</th>
                <th className="px-6 py-4">Motivo y Notas</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pending.map((adj) => (
                <tr key={adj.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{adj.user.name}</div>
                    <div className="text-[10px] text-gray-400">{new Date(adj.created_at).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-blue-700">{adj.product.name}</div>
                    <div className="text-xs font-mono bg-gray-100 inline-block px-1 rounded text-gray-500">
                      {adj.product.base_code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${
                      adj.warehouse.name === 'ALMACÉN' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {adj.warehouse.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-lg font-black ${adj.quantity < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {adj.quantity > 0 ? `+${adj.quantity}` : adj.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-gray-700 uppercase">{adj.reason.replace('_', ' ')}</div>
                    <div className="text-sm text-gray-500 italic">"{adj.notes || 'Sin notas extra'}"</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleAction(adj.id, 'REJECT')}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-xs border border-red-100"
                      >
                        RECHAZAR
                      </button>
                      <button 
                        onClick={() => handleAction(adj.id, 'APPROVE')}
                        className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-bold shadow-lg shadow-gray-200 flex items-center gap-2 text-xs"
                      >
                        <span>✅</span> APROBAR
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}