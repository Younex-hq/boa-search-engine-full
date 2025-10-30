import { type User } from "@/store/auth";
import api from "./axios";
import authApi from "./authApi";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  data: {
    token: string;
    user: User;
  };
  message: string;
  status: number;
}

interface LogoutResponse {
  data: [];
  message: string;
  status: number;
}

/**
 * Login API function
 * @param email User email
 * @param password User password
 * @returns Login response with token and user data
 */
export const login = async ({
  email,
  password,
}: LoginPayload): Promise<LoginResponse> => {
  const response = await authApi.post("/login", { email, password });
  return response.data;
};

/**
 * Logout API function
 * Sends a request to the logout endpoint with the bearer token
 * @returns Logout response
 */
export const logout = async (): Promise<LogoutResponse> => {
  try {
    const response = await authApi.post("/logout");
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
