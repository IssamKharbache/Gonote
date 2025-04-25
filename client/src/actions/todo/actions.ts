import { ApiError } from "@/components/forms/LoginForm";
import Swal from "sweetalert2";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Helper function to get token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const fetchTodos = async ({
  pageParam = 1,
  userId,
}: {
  pageParam?: number;
  userId: string;
}) => {
  try {
    const token = getAuthToken();
    const res = await fetch(
      `${backendUrl}/api/todos/user/${userId}?page=${pageParam}&limit=10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    const data = await res.json();
    if (!res.ok) {
      const error = new Error(
        data.error || "Something went wrong, try again later"
      ) as ApiError;
      error.response = {
        status: res.status,
        statusText: res.statusText,
        data,
      };
      throw error;
    }
    return data || [];
  } catch (error) {
    throw error;
  }
};

export const updateTodoAction = async (id: string) => {
  try {
    const token = getAuthToken(); // Get token
    const res = await fetch(`${backendUrl}/api/todos/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "", // Add Authorization header with token
      },
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
      text: "Check out your internet connection and try again",
    });
    throw error;
  }
};

interface DataToSent {
  userId: string;
  body: string;
}
export const createTodoAction = async (data: DataToSent) => {
  const parsedData = JSON.stringify(data);
  try {
    const token = getAuthToken(); // Get token
    const res = await fetch(`${backendUrl}/api/todos/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: parsedData,
    });
    const data = await res.json();
    if (res.ok) {
      return data;
    } else {
      const error = new Error(
        data.error || "Something went wrong, try again later"
      ) as ApiError;
      error.response = {
        status: res.status,
        statusText: res.statusText,
        data,
      };
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

export const deleteTodoAction = async (id: string) => {
  try {
    const token = getAuthToken(); // Get token
    const res = await fetch(`${backendUrl}/api/todos/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "", // Add Authorization header with token
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
    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: "Check out your internet connection and try again",
    });
  }
};

export const updateTodoContent = async (id: string, value: string) => {
  try {
    const res = await fetch(`${backendUrl}/api/todos/updateContent/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthToken() ? `Bearer ${getAuthToken()}` : "",
      },
      body: JSON.stringify({
        body: value,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Updated successfully",
        showConfirmButton: false,
        timer: 500,
      });
      return data;
    } else {
      const error = new Error(
        data.error || "Something went wrong, try again later"
      ) as ApiError;
      error.response = {
        status: res.status,
        statusText: res.statusText,
        data,
      };
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
