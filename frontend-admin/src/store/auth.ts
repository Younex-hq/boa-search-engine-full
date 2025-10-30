import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { logout as logoutApi } from "@/api/auth.api";

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  direction_id: number;
  email_verified_at: string;
  is_active: number;
  created_at: string;
  updated_at: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isLoggingOut: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoggingOut: false,
      login: (token, user) => {
        set({ token, user });
        Cookies.set("auth_token", token, {
          expires: 7,
          secure: import.meta.env.PROD, // cookie : only send over HTTPS in production, in development it will be sent over HTTP
          sameSite: "strict",
        }); // optional if axios depends on it
        localStorage.setItem("loginTimestamp", new Date().getTime().toString());
      },
      logout: async () => {
        if (get().isLoggingOut) {
          return;
        }
        set({ isLoggingOut: true });
        try {
          await logoutApi();
        } catch (error) {
          console.error("Error during logout:", error);
        } finally {
          set({ token: null, user: null, isLoggingOut: false });
          Cookies.remove("auth_token");
          localStorage.removeItem("loginTimestamp");
          window.location.href = "/login";
        }
      },
      updateUser: (user) => {
        set({ user });
      },
    }),
    {
      name: "auth-storage", // localStorage key
    },
  ),
);
