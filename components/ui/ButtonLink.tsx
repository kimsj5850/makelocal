import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: ButtonLinkProps) {
  const classes =
    variant === "primary"
      ? "bg-blue-700 text-white shadow-sm shadow-blue-700/20 hover:bg-blue-800"
      : "border border-slate-200 bg-white text-slate-900 hover:border-blue-200 hover:bg-blue-50";

  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition ${classes}`}
    >
      {children}
    </Link>
  );
}
