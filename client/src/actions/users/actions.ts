import Swal from "sweetalert2";
import { backendUrl } from "../todo/actions";
import { signUpSchemaType } from "@/validations/validation";
import { ApiError } from "@/components/forms/LoginForm";

export const createUser = async (user: signUpSchemaType) => {
  try {
    const res = await fetch(`${backendUrl}/api/users/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
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
type LoginUserType = {
  email: string;
  password: string;
};
export const loginUser = async (userCredentials: LoginUserType) => {
  try {
    const res = await fetch(`${backendUrl}/api/users/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredentials),
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
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
