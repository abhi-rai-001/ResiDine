"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded-md border border-gray-400 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-black data-[state=checked]:border-blue-600",
      className
    )}
    {...props}>
    <CheckboxPrimitive.Indicator className="flex items-center justify-center">
      {/* Tick mark styling */}
      <Check className="h-4 w-4 text-white font-bold" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };