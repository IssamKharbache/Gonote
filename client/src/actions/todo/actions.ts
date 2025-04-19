import { Todo } from "@/components/todo/TodoList";
import Swal from "sweetalert2";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const fetchTodos = async () => {
  try {
    const res = await fetch(`${backendUrl}/api/todos`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Something went wrong, try again later");
    }
    return data || [];
  } catch (error) {
    console.log(error.message);
  }
};

export const updateTodoAction = async (id: number) => {
  try {
    const res = await fetch(`${backendUrl}/api/todos/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "",
        showConfirmButton: false,
        timer: 1500,
      });
      return data;
    } else {
      throw new Error(data.error || "Something went wrong, try again later");
    }
  } catch (error) {
    console.log(error);
  }
};

export const createTodoAction = async (body: string) => {
  const content = JSON.stringify({ body });
  try {
    const res = await fetch(`${backendUrl}/api/todos/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: content,
    });
    const data = await res.json();
    if (res.ok) {
      return data;
    } else {
      throw new Error(data.error || "Something went wrong, try again later");
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: error,
    });
  }
};

export const deleteTodoAction = async (id: number) => {
  try {
    const res = await fetch(`${backendUrl}/api/todos/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Deleted successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      return data;
    } else {
      throw new Error(data.error || "Something went wrong, try again later");
    }
  } catch (error) {
    console.log(error);
  }
};
