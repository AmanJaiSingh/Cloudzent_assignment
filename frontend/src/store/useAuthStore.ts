import { create } from "zustand";
import api from "@/lib/api";

export interface User {
  _id: string;
  name: string;
  email: string;
  team_id: string | { _id: string; name: string };
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  setToken: (token: string) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated: !!(typeof window !== "undefined" ? localStorage.getItem("token") : null),
  user: null,
  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
    set({ token, isAuthenticated: true });
  },
  fetchUser: async () => {
    try {
      const res = await api.get("/users/me");
      set({ user: res.data });
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    set({ token: null, isAuthenticated: false, user: null });
  },
}));
