import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-[#065f46] bg-primary bg-gradient-to-r from-[#047857] via-[#0b5d3b] to-[#0e7490] bg-[length:200%_100%] bg-left text-white shadow-[0_6px_18px_-8px_rgba(4,120,87,0.7)] hover:-translate-y-px hover:bg-right hover:shadow-[0_12px_26px_-10px_rgba(14,116,144,0.75)] active:translate-y-0 [transition-property:background-position,transform,box-shadow] duration-500",
        outline:
          "border-2 border-[#047857]/35 bg-card bg-gradient-to-r from-[#047857]/[0.06] to-[#0e7490]/[0.06] text-[#065f46] shadow-sm hover:-translate-y-px hover:border-[#047857] hover:from-[#047857]/[0.12] hover:to-[#0e7490]/[0.12] hover:shadow-[0_10px_22px_-12px_rgba(4,120,87,0.6)] dark:border-emerald-400/35 dark:text-emerald-200 dark:hover:border-emerald-400",
        secondary:
          "border-2 border-[#4338ca]/25 bg-[#4338ca]/[0.07] text-[#3730a3] hover:-translate-y-px hover:border-[#4338ca] hover:bg-[#4338ca]/[0.12] dark:text-indigo-200",
        ghost: "text-foreground hover:bg-muted active:bg-muted/80",
        link: "text-primary underline-offset-4 hover:underline",
        onDark:
          "bg-white text-[#0B5D3B] shadow-sm hover:bg-white/90 dark:bg-white dark:text-[#0B5D3B]",
        outlineOnDark:
          "border border-white/40 bg-white/5 text-white backdrop-blur hover:bg-white/15 hover:border-white/70",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
