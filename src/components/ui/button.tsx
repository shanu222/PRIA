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
          "btn-sheen border border-[#065f46] bg-primary bg-gradient-to-r from-[#047857] via-[#0f766e] to-[#1d4ed8] bg-[length:200%_100%] bg-left text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_18px_-8px_rgba(4,120,87,0.7)] hover:-translate-y-px hover:bg-right hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_14px_28px_-10px_rgba(29,78,216,0.6)] active:translate-y-0 [transition-property:background-position,transform,box-shadow] duration-500",
        outline:
          "btn-sheen btn-gradient-outline text-[#065f46] shadow-sm [--btn-a:#059669] [--btn-b:#0891b2] hover:-translate-y-px dark:text-emerald-200",
        secondary:
          "btn-sheen btn-gradient-outline text-[#3730a3] [--btn-a:#4f46e5] [--btn-b:#a21caf] hover:-translate-y-px dark:text-indigo-200",
        ghost: "text-foreground hover:bg-muted active:bg-muted/80",
        link: "text-primary underline-offset-4 hover:underline",
        onDark:
          "btn-sheen border-0 bg-gradient-to-b from-[#99f6e4] via-[#2dd4bf] to-[#0d9488] text-[#042f2e] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_5px_0_#115e59,0_14px_24px_-8px_rgba(15,118,110,0.75)] hover:-translate-y-0.5 hover:from-[#ccfbf1] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_0_#115e59,0_20px_28px_-8px_rgba(13,148,136,0.8)] active:translate-y-1 active:shadow-[inset_0_2px_4px_rgba(4,47,46,0.25),0_1px_0_#115e59]",
        outlineOnDark:
          "btn-sheen border-0 bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] text-[#431407] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_5px_0_#b45309,0_14px_24px_-8px_rgba(217,119,6,0.7)] hover:-translate-y-0.5 hover:from-[#fde68a] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_8px_0_#b45309,0_20px_28px_-8px_rgba(245,158,11,0.75)] active:translate-y-1 active:shadow-[inset_0_2px_4px_rgba(120,53,15,0.28),0_1px_0_#b45309]",
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
