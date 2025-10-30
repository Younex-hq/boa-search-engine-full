import api from "./axios";

export interface Notification {
  type: string;
  id: number;
  attributes: {
    content: string;
    isRead: boolean;
  };
  relationships: {
    author: {
      data: {
        type: string;
        id: number;
        firstName: string;
        lastName: string;
        email: string;
      };
    };
  };
}

export interface NotificationsResponse {
  data: Notification[];
}

export interface UpdateNotificationPayload {
  isRead: boolean | number;
}

export const getNotifications = async (): Promise<NotificationsResponse> => {
  const response = await api.get("/notifications");
  return response.data;
};

export const updateNotification = async ({
  id,
  payload,
}: {
  id: number;
  payload: UpdateNotificationPayload;
}): Promise<{ data: Notification }> => {
  const response = await api.patch(`/notifications/${id}`, {
    data: { attributes: payload },
  });
  return response.data;
};
