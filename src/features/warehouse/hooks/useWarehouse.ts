// src/features/warehouse/hooks/useWarehouse.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getRawStock,
  getLowStockRaw,
  getLowStockFinished,
  performTransform,
  getStockMovements,
} from '../api/warehouseApi';
import { StockList } from '../types';

export const useRawStock = () => {
  return useQuery<StockList, Error>({
    queryKey: ['stocks'],
    queryFn: getRawStock,
  });
};

export const useFinishedStock = () => {
  return useQuery<StockList, Error>({
    queryKey: ['stocks'],
    queryFn: getRawStock,
  });
};

export const useLowStockRaw = (threshold = 50) => {
  return useQuery<any, Error>({
    queryKey: ['lowStockRaw', threshold],
    queryFn: () => getLowStockRaw(threshold),
  });
};

export const useLowStockFinished = (threshold = 20) => {
  return useQuery<any, Error>({
    queryKey: ['lowStockFinished', threshold],
    queryFn: () => getLowStockFinished(threshold),
  });
};

export const useStockMovements = () => {
  return useQuery<any, Error>({
    queryKey: ['stockMovements'],
    queryFn: getStockMovements,
  });
};

export const useTransform = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: performTransform,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      queryClient.invalidateQueries({ queryKey: ['lowStockRaw'] });
      queryClient.invalidateQueries({ queryKey: ['lowStockFinished'] });
      queryClient.invalidateQueries({ queryKey: ['stockMovements'] });
    },
  });
};