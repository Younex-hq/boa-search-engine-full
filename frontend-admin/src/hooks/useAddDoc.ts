import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoc, type AddDocPayload } from "@/api/doc.api";

export const useAddDoc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, signal }: { payload: AddDocPayload; signal?: AbortSignal }) => addDoc(payload, signal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docs"] });
    },
  });
};
