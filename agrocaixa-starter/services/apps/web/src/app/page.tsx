"use client";

import Link from "next/link";
import { useState } from "react";

import BrandMark from "@/components/BrandMark";
import { getToken } from "@/lib/auth";

const pillars = [
  {
    title: "Livro-caixa sem atrito",
    description:
      "Lançamentos rápidos no celular para manter receitas, despesas e categorias em dia, mesmo no ritmo corrido da fazenda.",
  },
  {
    title: "Alertas que explicam o caixa",
    description:
      "O sistema compara meses, aponta desvio de gasto e ajuda a enxergar cedo quando a margem começa a apertar.",
  },
  {
    title: "IA a serviço do produtor",
    description:
      "Sugestões de categoria, leitura de comprovantes e apoio operacional para levar tecnologia útil, e não complicação.",
  },
];

const operatingModel = [
  {
    step: "01",
    title: "Registrar o movimento",
    description:
      "Entradas e saídas viram histórico financeiro organizado por atividade rural.",
  },
  {
    step: "02",
    title: "Entender o que mudou",
    description:
      "O painel consolida saldo, custos por categoria e resultado por frente de produção.",
  },
  {
    step: "03",
    title: "Tomar ação rápido",
    description:
      "Alertas e insights mostram onde cortar custo, renegociar ou acelerar venda.",
  },
];

const promisePoints = [
  "Feito para pequenos e médios fazendeiros que não querem depender de planilha.",
  "Visual simples o suficiente para uso diário e forte o suficiente para apoiar decisão.",
  "Pensado para transformar dados soltos em rotina financeira confiável.",
];

export default function HomePage() {
  const [hasToken] = useState(() =>
    typeof window !== "undefined" ? Boolean(getToken()) : false
  );

  const primaryHref = hasToken ? "/dashboard" : "/login";
  const primaryLabel = hasToken ? "Abrir meu painel" : "Entrar na plataforma";

  return (
    <main className="landing-shell">
      <header className="landing-nav">
        <BrandMark tone="light" />

        <div className="landing-nav__actions">
          <Link className="button button--ghost-light" href="#como-funciona">
            Como funciona
          </Link>
          <Link className="button button--light" href={primaryHref}>
            {primaryLabel}
          </Link>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-hero__copy">
          <span className="kicker">Tecnologia útil para o agro</span>
          <h1 className="page-title page-title--display">
            O SaaS financeiro que ajuda o fazendeiro a entender para onde o
            dinheiro da operação está indo.
          </h1>
          <p className="page-subtitle page-subtitle--hero">
            O AgroCaixa conecta lançamentos, alertas e inteligência aplicada ao
            campo para dar clareza financeira a pequenos e médios produtores.
          </p>

          <div className="header-actions">
            <Link className="button button--accent" href={primaryHref}>
              {primaryLabel}
            </Link>
            <Link className="button button--ghost-light" href="/login">
              Ver acesso do produto
            </Link>
          </div>

          <ul className="soft-list soft-list--light">
            {promisePoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="landing-showcase">
          <div className="mock-card mock-card--hero">
            <span className="mock-card__eyebrow">Painel do dia</span>
            <strong className="mock-card__value">R$ 18.420 no verde</strong>
            <p className="mock-card__copy">
              Saldo consolidado, custo por atividade e alertas no mesmo lugar.
            </p>

            <div className="mock-card__stats">
              <div>
                <span>Receitas</span>
                <strong>R$ 42.800</strong>
              </div>
              <div>
                <span>Despesas</span>
                <strong>R$ 24.380</strong>
              </div>
            </div>
          </div>

          <div className="mock-stack">
            <article className="mock-card">
              <span className="mock-card__eyebrow">Categoria pressionando</span>
              <strong className="mock-card__value">Combustível</strong>
              <p className="mock-card__copy">
                31% das saídas do mês concentram-se aqui.
              </p>
            </article>

            <article className="mock-card">
              <span className="mock-card__eyebrow">Próxima ação</span>
              <strong className="mock-card__value">Revisar custos do trator</strong>
              <p className="mock-card__copy">
                A plataforma aponta o que precisa ser visto primeiro.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-heading">
          <span className="kicker kicker--dark">O que muda na prática</span>
          <h2 className="section-title">
            Menos planilha perdida. Mais decisão consciente dentro da fazenda.
          </h2>
        </div>

        <div className="feature-grid">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="surface-card feature-card">
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section" id="como-funciona">
        <div className="section-heading">
          <span className="kicker kicker--dark">Fluxo do produto</span>
          <h2 className="section-title">
            Uma rotina simples para trazer tecnologia sem travar quem está no campo.
          </h2>
        </div>

        <div className="step-grid">
          {operatingModel.map((item) => (
            <article key={item.step} className="surface-card step-card">
              <span className="step-card__index">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-section--cta">
        <div className="surface-card landing-cta">
          <div>
            <span className="kicker kicker--dark">Pronto para evoluir</span>
            <h2 className="section-title">
              O objetivo é simples: ajudar o produtor a responder se está
              lucrando ou perdendo dinheiro, sem adivinhação.
            </h2>
          </div>

          <div className="header-actions">
            <Link className="button" href={primaryHref}>
              {primaryLabel}
            </Link>
            <Link className="button button--secondary" href="/login">
              Explorar a plataforma
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
