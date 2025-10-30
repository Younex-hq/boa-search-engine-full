import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDirections,
  addDirection,
  updateDirection,
  deleteDirection,
  restoreDirection,
} from "@/api/direction.api";

export const useGetDirections = () =>
  useQuery({
    queryKey: ["directions"],
    queryFn: getDirections,
  });

export const useAddDirection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addDirection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directions"] });
    },
  });
};

export const useUpdateDirection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDirection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directions"] });
    },
  });
};

export const useDeleteDirection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDirection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directions"] });
    },
  });
};

export const useRestoreDirection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreDirection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directions"] });
    },
  });
};