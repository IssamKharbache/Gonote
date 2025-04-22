import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CloudIcon, Menu, User2Icon } from "lucide-react";
import { FiUserPlus } from "react-icons/fi";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { FaTasks } from "react-icons/fa";
import { useAuthStore } from "@/zustand/store";

const NavigationMenu = () => {
  const { logout, isAuthenticated } = useAuthStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="border-2 p-2 rounded-lg dark:border-blue-400 border-blue-400 cursor-pointer  focus:outline-none hover:bg-blue-400 dark:hover:bg-blue-400 duration-200 ">
          <Menu />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 mr-5 md:mr-16">
        {/* auth user links */}
        {isAuthenticated ? (
          <>
            <Link to="/cloud">
              <DropdownMenuItem className="flex items-center justify-between cursor-pointer">
                <CloudIcon />
                <span>Cloud</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/todos/create">
              <DropdownMenuItem className="flex items-center justify-between cursor-pointer">
                <FaTasks />
                <span>Task creator</span>
              </DropdownMenuItem>
            </Link>

            <Button
              onClick={logout}
              className="w-full m-0 p-0 text-xl cursor-pointer rounded-none"
            >
              Log out
            </Button>
          </>
        ) : (
          <>
            <Link to="/register">
              <DropdownMenuItem className="flex items-center justify-between cursor-pointer">
                <FiUserPlus />
                <span>Sign up</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/login">
              <DropdownMenuItem className="flex items-center justify-between cursor-pointer">
                <User2Icon />
                <span>Sign in</span>
              </DropdownMenuItem>
            </Link>
          </>
        )}

        {/* not auth user links */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavigationMenu;
