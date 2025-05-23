import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalizeFirstLetterOfTheString = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};
