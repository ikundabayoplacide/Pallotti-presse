import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  to?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost";
};

const sizeClasses = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-4 text-sm sm:text-base",
};

const variantClasses = {
  primary:
    "bg-secondary-200 text-secondary-100 hover:bg-custom-200 border border-secondary-200",
  secondary:
    "bg-primary-700 text-secondary-200 hover:bg-primary-600 border border-secondary-300/30",
  ghost:
    "bg-transparent text-primary-700 hover:bg-primary-400 border border-secondary-300/30",
};

const baseClasses =
  "inline-flex items-center justify-center font-semibold tracking-[0.14em] uppercase transition duration-200";

export default function Button({
  children,
  className = "",
  disabled = false,
  href,
  onClick,
  size = "md",
  to,
  type = "button",
  variant = "primary",
}: ButtonProps) {
  const classes =
    `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    } ${className}`.trim();

  if (to) {
    return (
      <Link className={classes} to={to} onClick={disabled ? (e) => e.preventDefault() : undefined}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={classes} href={href} onClick={disabled ? (e) => e.preventDefault() : undefined}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
}
