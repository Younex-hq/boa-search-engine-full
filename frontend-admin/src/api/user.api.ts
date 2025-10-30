import api from "./axios";

import { type ApiUser } from "@/pages/UsersPage";

export type UserApiResponse = {
  data: ApiUser[];
};

export type UserResponse = {
  data: ApiUser;
};

export type MessageResponse = {
  message: string;
};

export interface UpdateUserPayload {
  data: {
    attributes?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      isAdmin?: boolean;
      isActive?: boolean;
    };
    relationships?: {
      direction: {
        data: {
          type: string;
          id: string;
        } | null;
      };
    };
  };
}

export interface AddUserPayload {
  data: {
    attributes: {
      firstName: string;
      lastName: string;
      email: string;
      password?: string;
      isAdmin: boolean;
    };
    relationships: {
      direction: {
        data: {
          name: number;
        };
      };
    };
  };
}

export const getUsers = async (): Promise<UserApiResponse> => {
  const response = await api.get("/users");
  return response.data;
};

export const addUser = async (payload: AddUserPayload): Promise<UserResponse> => {
  const response = await api.post("/users", payload);
  return response.data;
};

export const updateUser = async (
  id: number,
  payload: UpdateUserPayload,
): Promise<UserResponse> => {
  console.log(payload);
  const response = await api.patch(`/users/${id}`, payload);
  return response.data;
};

export const deleteUser = async (id: number): Promise<MessageResponse> => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const restoreUser = async (id: number): Promise<MessageResponse> => {
  const response = await api.patch(`/users/${id}/restore`);
  return response.data;
};
