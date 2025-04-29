import { Todo } from "@/components/todo/TodoList";
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

type UpdateTodoDialogState = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const useUpdateTodoDialogStore = create<UpdateTodoDialogState>(
  (set) => ({
    isOpen: false,
    setIsOpen: (open) => set({ isOpen: open }),
  })
);

type EditTodoData = {
  selectedTodo: Todo;
  setSelectedTodo: (todo: Todo) => void;
};

export const useEditTodoStore = create<EditTodoData>((set) => ({
  selectedTodo: {
    _id: "",
    body: "",
    userId: "",

    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(),
  },
  setSelectedTodo: (todo) => set({ selectedTodo: todo }),
}));

type todoManagingWindow = {
  pageName: string;
  setPageName: (pageName: string) => void;
};

export const useTodoManagingWindowStore = create<todoManagingWindow>((set) => ({
  pageName: "",
  setPageName: (pageName) => set({ pageName }),
}));
