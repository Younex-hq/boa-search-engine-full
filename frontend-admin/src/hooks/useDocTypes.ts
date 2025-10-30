import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDocTypes,
  addDocType,
  updateDocType,
  deleteDocType,
  restoreDocType,
} from "@/api/docType.api";

export const useGetDocTypes = () =>
  useQuery({
    queryKey: ["docTypes"],
    queryFn: getDocTypes,
  });

export const useAddDocType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addDocType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docTypes"] });
    },
  });
};

export const useUpdateDocType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDocType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docTypes"] });
    },
  });
};

export const useDeleteDocType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDocType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docTypes"] });
    },
  });
};

export const useRestoreDocType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: restoreDocType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["docTypes"] });
        },
    });
};