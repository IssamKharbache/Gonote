import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground  placeholder:text-gray-400/80 dark:placeholder:text-gray-500 placeholder:text-[16px] selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-11 rounded-4xl w-full min-w-0  border bg-transparent px-5 py-2  shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus:border-blue-500",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
      )}
      {...props}
    />
  );
}

export { Input };
