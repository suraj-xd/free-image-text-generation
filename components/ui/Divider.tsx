import React from "react";
import { cn } from "~/lib/utils/cn";
export default function Divider({ className }: { className?: string }) {
  return (
    <div className={cn("mt-2.5 h-[1px] w-full  bg-gray-200", className)} />
  );
}
