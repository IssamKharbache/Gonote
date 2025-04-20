import Swal from "sweetalert2";
import { backendUrl } from "../todo/actions";
import { signUpSchemaType } from "@/validations/validation";

export const createUser = async (user: signUpSchemaType) => {
  try {
    const res = await fetch(`${backendUrl}/api/users/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user }),
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
  }
};
