// src/features/warehouse/components/TransformForm.tsx
import { useState } from "react";
import { useRawStock } from "../hooks/useWarehouse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { performTransform } from "../api/warehouseApi";
import { StockItem } from "../types";

export default function TransformForm() {
  const { data: rawProductsData, isLoading: loadingRaw } = useRawStock();

  const [productId, setProductId] = useState<string>("");
  const [rawAmperage, setRawAmperage] = useState<string>("");
  const [finishedAmperage, setFinishedAmperage] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const queryClient = useQueryClient();

  const rawProducts = rawProductsData ?? [];

  // Transformación simple para el select y selectedProduct
  const displayProducts = rawProducts.map((item: StockItem) => ({
    id: item.id,
    name: item.product_variant?.product?.name || 'Sin nombre',
    quantity: item.quantity,
    unit: 'unidades',
    amperage: item.product_variant?.amperage,
  }));

  const selectedProduct = displayProducts.find(
    (p) => p.id === Number(productId)
  );

  const mutation = useMutation({
    mutationFn: performTransform,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      setProductId("");
      setRawAmperage("");
      setFinishedAmperage("");
      setQuantity("");
      setNotes("");
      alert("¡Transformación realizada con éxito!");
    },
    onError: (error: any) => {
      alert("Error: " + (error.message || "No se pudo transformar"));
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productId || !rawAmperage || !finishedAmperage || !quantity) return;

    const qty = Number(quantity);
    if (selectedProduct && qty > selectedProduct.quantity) {
      alert(`Cantidad excede stock disponible (${selectedProduct.quantity})`);
      return;
    }

    mutation.mutate({
      product_id: Number(productId),
      raw_amperage: Number(rawAmperage),
      finished_amperage: Number(finishedAmperage),
      quantity: qty,
      notes: notes || undefined,
    });
  };

  if (loadingRaw) return <div>Cargando materias primas...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        Realizar Transformación
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Producto Raw
          </label>
          <select
            value={productId}
            onChange={(e) => {
              setProductId(e.target.value);
              const prod = displayProducts.find(
                (p) => p.id === Number(e.target.value)
              );
              setRawAmperage(prod?.amperage || "");
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          >
            <option value="">Selecciona producto raw</option>
            {displayProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (Stock: {product.quantity} {product.unit || "unidades"})
              </option>
            ))}
          </select>
        </div>

        {/* Resto del form (amperaje raw, finished, cantidad, notas) igual que tu original */}
        {/* ... pega aquí el resto de tu JSX del form ... */}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          {mutation.isPending ? "Transformando..." : "Confirmar Transformación"}
        </button>
      </form>

      {mutation.error && <p className="text-red-600 mt-4">Error al transformar</p>}
      {mutation.isSuccess && <p className="text-green-600 mt-4">¡Éxito!</p>}
    </div>
  );
}