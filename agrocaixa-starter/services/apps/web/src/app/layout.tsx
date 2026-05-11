import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AgroCaixa",
    template: "%s | AgroCaixa",
  },
  description:
    "Gestão financeira simples para produtores rurais com apoio de IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="app-body">{children}</body>
    </html>
  );
}
