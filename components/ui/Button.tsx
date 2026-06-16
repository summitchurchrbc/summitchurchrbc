import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "white" | "solid" | "outlineDark" | "dark";
  size?: "md" | "lg" | "xl";
  external?: boolean;
  className?: string;
}

const variants = {
  primary: "bg-primary text-white border-transparent hover:bg-primary-dark",
  outline: "bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary",
  white: "bg-white text-primary border-2 border-white hover:bg-transparent hover:text-white",
  solid: "bg-white text-[var(--navy)] border-2 border-white hover:bg-cream hover:text-[var(--navy)]",
  outlineDark:
    "bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white",
  dark: "bg-text-dark text-white border-transparent hover:bg-gray-800",
};

const sizes = {
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
  xl: "px-10 py-4 text-lg",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "lg",
  external,
  className = "",
}: ButtonProps) {
  const classes = `inline-block rounded-sm font-medium tracking-wide transition-colors duration-200 border ${variants[variant]} ${sizes[size]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}