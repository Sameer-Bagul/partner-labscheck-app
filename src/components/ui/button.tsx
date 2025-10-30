import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md hover:shadow-lg hover:from-purple-700 hover:to-violet-700 active:scale-[0.98]",
        destructive:
          "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md hover:shadow-lg hover:from-red-700 hover:to-rose-700",
        outline:
          "border-2 border-purple-200 bg-white hover:bg-purple-50 hover:border-purple-300 text-purple-700 shadow-sm hover:shadow-md",
        secondary:
          "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 hover:from-purple-200 hover:to-violet-200 border border-purple-200",
        ghost: "hover:bg-purple-50 hover:text-purple-700 text-gray-700",
        link: "text-purple-600 underline-offset-4 hover:underline hover:text-purple-700",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4 text-sm",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
