import { AuthenticatedUser } from "@/routes/todos/create";
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  user: AuthenticatedUser | null;
  login: (user: any, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  login: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ isAuthenticated: false, user: null });
  },
}));

type UpdateTodoDialog = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const useUpdateTodoDialogStore = create<UpdateTodoDialog>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
