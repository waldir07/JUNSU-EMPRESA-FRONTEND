// src/features/store/components/StoreStockList.tsx
import { useState } from "react";
import { Search } from "lucide-react";

export default function StoreStockList() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-10">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 italic uppercase tracking-tighter">Mi Inventario</h1>
          <p className="text-gray-500 font-bold text-sm">Stock disponible para venta en vitrina</p>
        </div>
        
        {/* Buscador Rápido */}
        <div className="relative w-80">
          <input
            type="text"
            placeholder="Buscar por Amperaje, Polos o Modelo..."
            className="w-full bg-white border-none ring-1 ring-gray-100 p-4 pl-12 rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-4 text-gray-300" size={20} />
        </div>
      </div>

      {/* Tabla de Stock (Base) */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Producto</th>
              <th className="px-8 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Amp.</th>
              <th className="px-8 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Polos</th>
              <th className="px-8 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Disponible</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50 last:border-0">
              <td colSpan={4} className="px-8 py-20 text-center text-gray-300 font-black italic uppercase tracking-[5px]">
                Sin existencias registradas
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}