import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        success: "border-transparent bg-green-300 text-success-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        raw: "border-transparent bg-slate-200 text-success-foreground font-medium",
        prospect:
          "border-transparent bg-cyan-200 text-success-foreground font-medium",
        highProspect:
          "border-transparent bg-teal-200 text-success-foreground font-medium",
        priority:
          "border-transparent bg-sky-200 text-success-foreground font-medium",
        available:
          "border-transparent bg-blue-200 text-success-foreground font-medium",
        booked:
          "border-transparent bg-indigo-200 text-success-foreground font-medium",
        closed:
          "border-transparent bg-amber-200 text-success-foreground font-medium",
        sold: "border-transparent bg-green-200 text-success-foreground font-medium",
        junk: "border-transparent bg-red-200 text-success-foreground font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
