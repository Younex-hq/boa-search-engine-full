import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  updateNotification,
  type UpdateNotificationPayload,
  type NotificationsResponse,
} from "@/api/notification.api";

export const useGetNotifications = () =>
  useQuery<NotificationsResponse>({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateNotificationPayload;
    }) => updateNotification({ id, payload }),
    onMutate: async (updatedNotification) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previousNotifications =
        queryClient.getQueryData<NotificationsResponse>(["notifications"]);

      if (previousNotifications) {
        queryClient.setQueryData<NotificationsResponse>(["notifications"], {
          ...previousNotifications,
          data: previousNotifications.data.map((notification) =>
            notification.id === updatedNotification.id
              ? {
                  ...notification,
                  attributes: {
                    ...notification.attributes,
                    isRead: !!updatedNotification.payload.isRead,
                  },
                }
              : notification,
          ),
        });
      }

      return { previousNotifications };
    },
    onError: (err, updatedNotification, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData<NotificationsResponse>(
          ["notifications"],
          context.previousNotifications,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
