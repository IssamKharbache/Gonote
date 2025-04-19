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

const NavigationMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="border-2 p-2 rounded-lg dark:border-blue-400 border-blue-400 cursor-pointer  focus:outline-none hover:bg-blue-400 dark:hover:bg-blue-400 duration-200">
          <Menu />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <Link to="/cloud">
          <DropdownMenuItem className="flex items-center justify-between cursor-pointer">
            <span>Cloud</span>
            <CloudIcon />
          </DropdownMenuItem>
        </Link>
        <Link to="/about">
          <DropdownMenuItem className="flex items-center justify-between cursor-pointer">
            <span>Sign up</span>
            <FiUserPlus />
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="flex items-center justify-between cursor-pointer">
          <span>Log in</span>
          <User2Icon />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Button className="w-full m-0 p-0 text-xl">Log out</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavigationMenu;
