import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  restoreDoc,
  type GetDocsParams,
} from "@/api/doc.api";

export const useGetDocs = (params?: GetDocsParams) =>
  useQuery({
    queryKey: ["docs", params],
    queryFn: () => getDocs(params),
  });

export const useGetDoc = (id: number, enabled: boolean) =>
  useQuery({
    queryKey: ["doc", id],
    queryFn: () => getDoc(id),
    enabled: enabled,
  });

export const useUpdateDoc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDoc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docs"] });
    },
  });
};

export const useDeleteDoc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDoc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docs"] });
    },
  });
};

export const useRestoreDoc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreDoc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docs"] });
    },
  });
};