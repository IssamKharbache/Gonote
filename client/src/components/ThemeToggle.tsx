import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import useTheme from "../hooks/useTheme";
import { Laptop, MoonIcon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ThemeType = "light" | "dark" | "system";

const themeData = [
  {
    name: "dark" as ThemeType,
    icon: MoonIcon,
  },
  {
    name: "light" as ThemeType,
    icon: Sun,
  },
  {
    name: "system" as ThemeType,
    icon: Laptop,
  },
];

const iconAnimations = {
  light: {
    hover: { rotate: 45, scale: 1.1 },
    tap: { scale: 0.9 },
    animate: { rotate: 0, scale: 1 },
  },
  dark: {
    hover: { rotate: -30, y: -5, scale: 1.1 },
    tap: { scale: 0.9 },
    animate: { rotate: 0, y: 0, scale: 1 },
  },
  system: {
    hover: { rotate: 15, scale: 1.1 },
    tap: { scale: 0.9 },
    animate: { rotate: 0, scale: 1 },
  },
};

const ThemeToggle = () => {
  const [theme, setTheme] = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const WhichTheme = ({
    theme,
    hovered,
  }: {
    theme: ThemeType;
    hovered: boolean;
  }) => {
    const currentAnimation =
      theme === "light"
        ? iconAnimations.light
        : theme === "dark"
          ? iconAnimations.dark
          : iconAnimations.system;

    const Icon = theme === "light" ? Sun : theme === "dark" ? MoonIcon : Laptop;

    return (
      <motion.div
        animate={hovered ? currentAnimation.hover : currentAnimation.animate}
        whileTap={currentAnimation.tap}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        <Icon />
      </motion.div>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="cursor-pointer focus:outline-none hover:bg-blue-400 dark:hover:bg-blue-400 duration-200 m-2"
      >
        <motion.button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="border-2 p-2 rounded-lg dark:border-blue-400 border-blue-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <WhichTheme theme={theme} hovered={isHovered} />
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0 w-56 bg-white dark:bg-blue-900 text-popover-foreground mr-4 lg:mr-0 ">
        <DropdownMenuLabel className="text-2xl">Theme</DropdownMenuLabel>
        <DropdownMenuSeparator className=" m-0" />
        <DropdownMenuGroup>
          <AnimatePresence>
            {themeData.map((themeItem, idx) => {
              const Icon = themeItem.icon;
              const currentAnimation =
                themeItem.name === "light"
                  ? iconAnimations.light
                  : themeItem.name === "dark"
                    ? iconAnimations.dark
                    : iconAnimations.system;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownMenuItem
                    onClick={() => handleThemeChange(themeItem.name)}
                    className="flex justify-between items-center hover:bg-blue-300/70 dark:hover:bg-blue-800 hover:cursor-pointer px-5 m-0"
                  >
                    <span className="capitalize text-2xl">
                      {themeItem.name}
                    </span>
                    <motion.div
                      initial={currentAnimation.animate}
                      animate={currentAnimation.animate}
                      whileHover={currentAnimation.hover}
                      whileTap={currentAnimation.tap}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      <Icon size={25} />
                    </motion.div>
                  </DropdownMenuItem>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
