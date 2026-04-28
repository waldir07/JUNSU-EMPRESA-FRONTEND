// src/features/admin/components/AdminProductForm.tsx
import { useState, useEffect } from 'react';
import { Product } from '../hooks/useAdminProducts';

interface Props {
  initialData?: Product | null;
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AdminProductForm({ 
  initialData, 
  onSave, 
  onCancel, 
  isLoading = false 
}: Props) {

  const [form, setForm] = useState({
    name: '',
    base_code: '',
    model: '',
    package_size: 1,
    is_raw: true,
    cost_price: 0,
    supplier: '',
    notes: '',
    initial_stock: 0,
  });

  // Cargar datos cuando se edita
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        base_code: initialData.base_code,
        model: initialData.model || '',
        package_size: initialData.package_size,
        is_raw: initialData.is_raw,
        cost_price: initialData.cost_price,
        supplier: initialData.supplier || '',
        notes: initialData.notes || '',
        initial_stock: 0,
      });
    } else {
      // Reset cuando es crear nuevo
      setForm({
        name: '',
        base_code: '',
        model: '',
        package_size: 1,
        is_raw: true,
        cost_price: 0,
        supplier: '',
        notes: '',
        initial_stock: 0,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? Number(value) 
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.base_code || form.package_size < 1 || form.cost_price < 0) {
      alert("Por favor completa los campos requeridos (Nombre, Código base, Paquete y Precio)");
      return;
    }

    onSave(form);
  };

  const skuPreview = form.is_raw ? `M-${form.base_code || ''}` : form.base_code || '—';

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
      <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800">
        {initialData ? 'Editar Producto' : 'Crear Nuevo Producto'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej: Llave Termomagnética 63A IC"
            required
          />
        </div>

        {/* Código base */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Código base</label>
          <input
            name="base_code"
            value={form.base_code}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej: ITM63IC"
            required
          />
          <p className="mt-1 text-sm text-gray-600">
            Preview SKU: <strong>{skuPreview}</strong>
          </p>
        </div>

        {/* Modelo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Modelo (opcional)</label>
          <input
            name="model"
            value={form.model}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej: Monofásica"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unidades por paquete</label>
            <input
              name="package_size"
              type="number"
              value={form.package_size}
              onChange={handleChange}
              min={1}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Precio base (S/)</label>
            <input
              name="cost_price"
              type="number"
              step="0.01"
              value={form.cost_price}
              onChange={handleChange}
              min={0}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            name="is_raw"
            type="checkbox"
            checked={form.is_raw}
            onChange={handleChange}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700">
            Es producto base / raw (agrega prefijo M- al código)
          </label>
        </div>

        {!initialData && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock inicial</label>
            <input
              name="initial_stock"
              type="number"
              value={form.initial_stock}
              onChange={handleChange}
              min={0}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Proveedor</label>
          <input
            name="supplier"
            value={form.supplier}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej: Proveedor China"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Detalles adicionales..."
          />
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 transition font-medium"
          >
            {isLoading ? "Guardando..." : initialData ? "Actualizar Producto" : "Crear Producto"}
          </button>
        </div>
      </form>
    </div>
  );
}