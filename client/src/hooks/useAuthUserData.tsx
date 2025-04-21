import { AuthenticatedUser } from "@/routes/todos/create";
import { useEffect, useState } from "react";

const useAuthUserData = () => {
  const [authUserData, setAuthUserData] = useState<AuthenticatedUser>({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    createdAt: "",
    updatedAt: "",
  });
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "");
    setAuthUserData(user);
  }, [authUserData]);
  return {
    user_data: authUserData,
  };
};

export default useAuthUserData;
