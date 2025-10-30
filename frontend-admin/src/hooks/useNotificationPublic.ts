import { useMutation } from "@tanstack/react-query";
import publicApi from "@/api/publicApi";

type NotificationPayload = {
  content: string;
};

//! public : no authentication / token

export function useNotificationPublic() {
  return useMutation({
    mutationFn: async ({ content }: NotificationPayload) => {
      const res = await publicApi.post("/notifications/public", {
        data: {
          attributes: {
            content,
          },
        },
      });

      return res.data; // contains { data: [], message: ..., status: 200 }
    },
  });
}
