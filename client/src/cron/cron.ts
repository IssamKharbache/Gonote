import { backendUrl, getAuthToken } from "@/actions/todo/actions";

export const deleteTodosOlderThanTenDays = async () => {
  try {
    const res = await fetch(`${backendUrl}/api/todos`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthToken() ? `Bearer ${getAuthToken()}` : "",
      },
    });
    const data = await res.json();
    if (res.ok) {
      console.log(data);

      return data;
    }
  } catch (error) {
    console.log(error);
  }
};
