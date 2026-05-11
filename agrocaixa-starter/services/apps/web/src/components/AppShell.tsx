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
    href: "/fazendas",
    label: "Fazendas",
    matches: (pathname: string) => pathname.startsWith("/fazendas"),
  },
  {
    href: "/dashboard",
    label: "Painel",
    matches: (pathname: string) => pathname === "/dashboard",
  },
  {
    href: "/financeiro",
    label: "Financeiro",
    matches: (pathname: string) => pathname.startsWith("/financeiro"),
  },
  {
    href: "/transactions",
    label: "Movimentos",
    matches: (pathname: string) => pathname.startsWith("/transactions"),
  },
  {
    href: "/alerts",
    label: "Alertas",
    matches: (pathname: string) => pathname.startsWith("/alerts"),
  },
  {
    href: "/notificacoes",
    label: "Notificações",
    matches: (pathname: string) => pathname.startsWith("/notificacoes"),
  },
  {
    href: "/relatorios",
    label: "Relatórios",
    matches: (pathname: string) => pathname.startsWith("/relatorios"),
  },
  {
    href: "/inteligencia",
    label: "Inteligência",
    matches: (pathname: string) => pathname.startsWith("/inteligencia"),
  },
  {
    href: "/logistica",
    label: "Logística",
    matches: (pathname: string) => pathname.startsWith("/logistica"),
  },
  {
    href: "/integracoes",
    label: "Integrações",
    matches: (pathname: string) => pathname.startsWith("/integracoes"),
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
