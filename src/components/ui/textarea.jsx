import React from "react";
import { cn } from "../../lib/utils";

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "min-h-[80px] w-full rounded-md border border-gray-300 bg-white p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      {...props}
    />
  );
}
