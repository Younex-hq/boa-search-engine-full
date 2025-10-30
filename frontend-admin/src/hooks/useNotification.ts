import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios";
import Cookies from "js-cookie";

type NotificationPayload = {
  content: string;
};

export function useSendNotification() {
  return useMutation({
    mutationFn: async ({ content }: NotificationPayload) => {
      const token = Cookies.get("auth_token");

      const res = await api.post(
        "/notifications",
        {
          data: {
            attributes: {
              content,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data;
    },
  });
}

