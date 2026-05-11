"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { removeToken } from "@/lib/auth";

import BrandMark from "./BrandMark";

type AppShellProps = {
  actions?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
};

const navItems = [
  {
    href: "/dashboard",
    label: "Painel",
    matches: (pathname: string) => pathname === "/dashboard",
  },
  {
    href: "/alerts",
    label: "Alertas",
    matches: (pathname: string) => pathname.startsWith("/alerts"),
  },
  {
    href: "/transactions/new",
    label: "Lançar",
    matches: (pathname: string) => pathname.startsWith("/transactions"),
  },
];

export default function AppShell({
  actions,
  aside,
  children,
  description,
  eyebrow,
  title,
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <main className="product-shell">
      <header className="product-topbar">
        <BrandMark href="/" tone="light" compact />

        <nav className="product-nav" aria-label="Navegação principal">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`product-nav__link ${
                item.matches(pathname) ? "product-nav__link--active" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="button button--light"
          onClick={() => {
            removeToken();
            router.replace("/login");
          }}
          type="button"
        >
          Encerrar sessão
        </button>
      </header>

      <section className="product-hero">
        <div className="product-hero__content">
          <span className="kicker">{eyebrow}</span>
          <h1 className="page-title page-title--hero">{title}</h1>
          <p className="page-subtitle page-subtitle--hero">{description}</p>

          {actions ? <div className="header-actions">{actions}</div> : null}
        </div>

        {aside ? (
          <aside className="surface-card product-hero__aside">{aside}</aside>
        ) : null}
      </section>

      <section className="product-main">{children}</section>
    </main>
  );
}
