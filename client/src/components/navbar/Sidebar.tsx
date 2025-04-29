import { useAuthStore, useTodoManagingWindowStore } from "@/zustand/store";
import { FaCheck } from "react-icons/fa";
import { IoCheckmarkDone } from "react-icons/io5";

const menus = [{ name: "completed", icon: IoCheckmarkDone }];

const Sidebar = () => {
  const { user } = useAuthStore();
  const { pageName, setPageName } = useTodoManagingWindowStore();

  return (
    <div className="flex min-h-screen bg-blue-100/70 ">
      {/* small left side */}
      <div className="flex flex-col gap-5 items-center bg-blue-100 p-4">
        <div className=" rounded-lg bg-blue-500 w-10 h-10 flex items-center justify-center ">
          <span className="text-white font-semibold">
            {" "}
            {extractTwoFirstLetters([
              user?.first_name || "",
              user?.last_name || "",
            ])}
          </span>
        </div>
        <div
          onClick={() => setPageName("")}
          className={`${pageName === "" ? "bg-blue-500 text-white" : "bg-white"} rounded-lg w-10 h-10 flex items-center justify-center cursor-pointer`}
        >
          <FaCheck size={15} />
        </div>
      </div>
      {/* right side */}
      <div className="flex-2 p-4 m-10">
        {menus.map((menu, idx) => {
          const Icon = menu.icon;
          return (
            <div
              onClick={() => setPageName(menu.name)}
              className="flex items-center  gap-4 bg-blue-100 hover:bg-blue-200 cursor-pointer rounded p-2"
              key={idx}
            >
              <Icon size={25} />
              <span className="capitalize font-semibold">{menu.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;

const extractTwoFirstLetters = (text: string[]) => {
  const firstLetter = text.map((word) => word.charAt(0).toUpperCase())[0];
  const secondLetter = text.map((word) => word.charAt(0).toUpperCase())[1];
  return `${firstLetter}${secondLetter}`;
};
