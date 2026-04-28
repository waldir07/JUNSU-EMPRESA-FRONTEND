// src/features/warehouse/components/TransformForm.tsx
import { useState, useEffect } from "react";
import { useRawStock } from "../hooks/useWarehouse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { performTransform } from "../api/warehouseApi";
import { useToast } from "@/components/ToastProvider";
import axios from "@/lib/axios";
import { StockItem } from "../types";

export default function TransformForm() {
  const { data: rawProductsData = [], isLoading: loadingRaw } = useRawStock();
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const [rawProductId, setRawProductId] = useState<string>("");
  const [finishedProductId, setFinishedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [possibleFinished, setPossibleFinished] = useState<any[]>([]);

  const rawProducts: StockItem[] = rawProductsData;
  const selectedRaw = rawProducts.find((p) => p.id === Number(rawProductId));

  // === DEBUG: Cargar productos terminados posibles ===
  useEffect(() => {
    if (!rawProductId) {
      setPossibleFinished([]);
      return;
    }

    console.log("🔍 Solicitando posibles terminados para Raw ID:", rawProductId);

    axios
      .get(`/api/transformations/possible?raw_product_id=${rawProductId}`)
      .then((res) => {
        console.log("✅ Respuesta del endpoint possible:", res.data);
        setPossibleFinished(res.data.possible_finished || []);
      })
      .catch((err) => {
        console.error("❌ Error al cargar posibles terminados:", err.response?.data || err);
        toastError("No se pudieron cargar los productos terminados posibles");
        setPossibleFinished([]);
      });
  }, [rawProductId]);

  const mutation = useMutation({
    mutationFn: performTransform,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      setRawProductId("");
      setFinishedProductId("");
      setQuantity("");
      setNotes("");
      success("¡Transformación realizada con éxito!");
    },
    onError: (err: any) => {
      toastError(err.response?.data?.message || "Error al realizar la transformación");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ... (mismo código de antes, lo dejamos igual)
    if (!rawProductId || !finishedProductId || !quantity) {
      toastError("Completa todos los campos obligatorios");
      return;
    }

    const qty = Number(quantity);
    if (qty <= 0) {
      toastError("La cantidad debe ser mayor a 0");
      return;
    }

    if (selectedRaw && qty > selectedRaw.quantity) {
      toastError(`Cantidad excede el stock disponible (${selectedRaw.quantity} unidades)`);
      return;
    }

    mutation.mutate({
      product_id: Number(rawProductId),
      raw_amperage: selectedRaw?.product_variant?.amperage ? Number(selectedRaw.product_variant.amperage) : 0,
      finished_amperage: Number(finishedProductId),
      quantity: qty,
      notes: notes || undefined,
    });
  };

  if (loadingRaw) {
    return <div className="text-center py-12">Cargando materias primas...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Transformar Materia Prima
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ... mismo formulario de antes ... */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Producto Terminado
            </label>
            <select
              value={finishedProductId}
              onChange={(e) => setFinishedProductId(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-4 focus:ring-2 focus:ring-green-500 outline-none"
              required
            >
              <option value="">Selecciona producto terminado...</option>
              {possibleFinished.length === 0 && (
                <option value="" disabled>
                  (No hay productos terminados configurados para este Raw)
                </option>
              )}
              {possibleFinished.map((item: any) => (
                <option key={item.finished_product_id} value={item.finished_product_id}>
                  {item.finished_product_name} • {item.finished_amperage}A
                </option>
              ))}
            </select>
          </div>

          {/* resto del formulario igual */}
        </form>
      </div>
    </div>
  );
}