import { HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

type CardVariant = "default" | "ghost" | "elevated";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  padded?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    "bg-white border border-surface-200 shadow-soft dark:bg-dark-card dark:border-dark-border",
  ghost:
    "bg-surface-50 dark:bg-surface-800/50",
  elevated:
    "bg-white border border-surface-200 shadow-card dark:bg-dark-card dark:border-dark-border",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      hoverable = false,
      padded = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "rounded-2xl transition-all duration-200",
          variantStyles[variant],
          hoverable &&
            "hover:shadow-elevated hover:border-primary-200 dark:hover:border-primary-800 cursor-pointer",
          padded && "p-5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
