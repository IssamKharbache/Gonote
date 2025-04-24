import { Link } from "@tanstack/react-router";
import ThemeToggle from "../ThemeToggle";
import NavigationMenu from "./NavigationMenu";

export default function Navbar() {
  return (
    <nav className="flex p-2   xl:m-10 items-center justify-between bg-blue-200 dark:bg-blue-950   xl:max-w-7xl xl:mx-auto  xl:rounded-full  transition-colors  duration-300 ">
      <Link to="/">
        <div className="relative ml-3  bg-white dark:bg-blue-900 text-blue-900 dark:text-white p-2 rounded-full  transition-colors duration-300 px-10">
          <div className="bg-blue-500  absolute -top-8 -left-5 w-12 h-12 rounded-full" />
          <p className="text-3xl ">GoNote</p>
        </div>
      </Link>
      <div className="flex items-center gap-4 mr-5">
        <ThemeToggle />
        <NavigationMenu />
      </div>
    </nav>
  );
}
