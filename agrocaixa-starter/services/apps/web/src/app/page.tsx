"use client";

import Link from "next/link";
import { useState } from "react";

import BrandMark from "@/components/BrandMark";
import { getToken } from "@/lib/auth";
import { faqItems, integrationIdeas, pricingPlans, testimonials } from "@/lib/showcase";

const pillars = [
  {
    title: "Livro-caixa sem atrito",
    description:
      "Lançamentos rápidos no celular para manter receitas, despesas e categorias em dia, mesmo no ritmo corrido da fazenda.",
  },
  {
    title: "Fluxo de caixa futuro",
    description:
      "A plataforma deixa o produtor olhar 7, 30 e 90 dias à frente para negociar melhor e não fechar o mês no susto.",
  },
  {
    title: "Preço, safra e logística",
    description:
      "A operação financeira conversa com previsão de safra, mercado e saída da produção no mesmo ecossistema.",
  },
  {
    title: "Equipe e fazendas",
    description:
      "Múltiplas fazendas, papéis de acesso e rotina guiada para dono, gestor, financeiro e operacional.",
  },
];

const operatingModel = [
  {
    step: "01",
    title: "Criar conta e ativar a operação",
    description:
      "O primeiro acesso apresenta cadastro, fazenda, equipe e o caminho até o primeiro valor útil.",
  },
  {
    step: "02",
    title: "Cadastrar fazendas e atividades",
    description:
      "Cada frente produtiva entra no sistema com contexto para ligar custo, receita e margem.",
  },
  {
    step: "03",
    title: "Lançar e acompanhar o caixa",
    description:
      "O financeiro começa simples, mas já prepara terreno para alertas, fluxo futuro e relatórios.",
  },
  {
    step: "04",
    title: "Expandir para decisão",
    description:
      "Depois do básico, entram mercado, safra, logística, notificações e integrações.",
  },
];

const promisePoints = [
  "Feito para pequenos e médios fazendeiros que não querem depender de planilha.",
  "Visual simples o suficiente para uso diário e forte o suficiente para apoiar decisão.",
  "Pensado para transformar dados soltos em rotina financeira confiável.",
];

const advancedModules = [
  {
    title: "Onboarding de fazendas",
    description:
      "Explique primeiro acesso, cadastro de fazenda, papéis da equipe e atividades da operação.",
    href: "/fazendas",
    action: "Abrir estrutura",
  },
  {
    title: "Movimentações completas",
    description:
      "Ganhe filtro por fazenda, entradas, saídas e títulos pendentes para acompanhar a rotina.",
    href: "/transactions",
    action: "Ver movimentos",
  },
  {
    title: "Centro financeiro",
    description:
      "Fluxo de caixa futuro, orçamento por categoria e custo por atividade em uma mesma frente.",
    href: "/financeiro",
    action: "Abrir financeiro",
  },
  {
    title: "Relatórios gerenciais",
    description:
      "Fechamento mensal e lucratividade por cultura em linguagem simples para a gestão.",
    href: "/relatorios",
    action: "Ver relatórios",
  },
  {
    title: "Inteligência agrícola",
    description:
      "Projete produtividade, risco e oportunidade comercial para negociar com mais contexto.",
    href: "/inteligencia",
    action: "Ver inteligência",
  },
  {
    title: "Logística da operação",
    description:
      "Organize coleta, entrega, frota e janelas de saída sem perder o vínculo com a margem.",
    href: "/logistica",
    action: "Ir para logística",
  },
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
          <Link className="button button--ghost-light" href="/primeiro-acesso">
            Primeiro acesso
          </Link>
          <Link className="button button--ghost-light" href="#planos">
            Planos
          </Link>
          <Link className="button button--ghost-light" href="#faq">
            FAQ
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
            O SaaS rural que transforma caixa, operação e decisão em uma rotina só.
          </h1>
          <p className="page-subtitle page-subtitle--hero">
            O AgroCaixa organiza a vida financeira de pequenos e médios fazendeiros
            com lançamentos, fluxo futuro, alertas, safra, mercado e logística.
          </p>

          <div className="header-actions">
            <Link className="button button--accent" href={primaryHref}>
              {primaryLabel}
            </Link>
            <Link className="button button--ghost-light" href="/register">
              Criar conta
            </Link>
            <Link className="button button--ghost-light" href="/primeiro-acesso">
              Entender o primeiro passo
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
              Saldo consolidado, custo por atividade, projeção de caixa e alertas no mesmo lugar.
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
              <span className="mock-card__eyebrow">Próximo passo</span>
              <strong className="mock-card__value">Revisar frete e diesel</strong>
              <p className="mock-card__copy">
                A plataforma aponta o que precisa ser visto primeiro.
              </p>
            </article>

            <article className="mock-card">
              <span className="mock-card__eyebrow">Mercado</span>
              <strong className="mock-card__value">Janela boa para café</strong>
              <p className="mock-card__copy">
                Financeiro e comercial começam a conversar dentro do mesmo produto.
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

      <section className="landing-section">
        <div className="section-heading">
          <span className="kicker kicker--dark">Plataforma completa</span>
          <h2 className="section-title">
            O produto agora já aponta para estrutura, financeiro, relatórios, mercado, logística e integrações.
          </h2>
        </div>

        <div className="feature-grid">
          {advancedModules.map((module) => (
            <article key={module.title} className="surface-card feature-card feature-card--cta">
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <Link className="button button--secondary" href={module.href}>
                {module.action}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section" id="planos">
        <div className="section-heading">
          <span className="kicker kicker--dark">Planos</span>
          <h2 className="section-title">
            Uma estrutura comercial mais forte para vender o produto de forma clara.
          </h2>
        </div>

        <div className="feature-grid">
          {pricingPlans.map((plan) => (
            <article key={plan.name} className="surface-card feature-card feature-card--cta">
              <h3>{plan.name}</h3>
              <p>{plan.audience}</p>
              <strong className="mock-card__value">{plan.price}</strong>
              <ul className="soft-list">
                {plan.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="section-heading">
          <span className="kicker kicker--dark">Prova de valor</span>
          <h2 className="section-title">
            Um produto assim vende melhor quando deixa claro tempo ganho, margem protegida e rotina simplificada.
          </h2>
        </div>

        <div className="feature-grid">
          {testimonials.map((item) => (
            <article key={item.author} className="surface-card feature-card">
              <h3>{item.author}</h3>
              <p>{item.role}</p>
              <p>{item.quote}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="section-heading">
          <span className="kicker kicker--dark">Integrações estratégicas</span>
          <h2 className="section-title">
            O caminho natural é aproximar o sistema do WhatsApp, da planilha antiga e dos comprovantes reais.
          </h2>
        </div>

        <div className="feature-grid">
          {integrationIdeas.map((item) => (
            <article key={item.title} className="surface-card feature-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="support-pill">{item.status}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section" id="faq">
        <div className="section-heading">
          <span className="kicker kicker--dark">FAQ</span>
          <h2 className="section-title">
            Respostas curtas para as dúvidas que normalmente travam a compra.
          </h2>
        </div>

        <ul className="detail-list">
          {faqItems.map((item) => (
            <li key={item.question} className="detail-item">
              <strong>{item.question}</strong>
              <p className="support-paragraph">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="landing-section landing-section--cta">
        <div className="surface-card landing-cta">
          <div>
            <span className="kicker kicker--dark">Pronto para evoluir</span>
            <h2 className="section-title">
              O objetivo é simples: ajudar o produtor a responder se está lucrando ou perdendo dinheiro, sem adivinhação.
            </h2>
          </div>

          <div className="header-actions">
            <Link className="button" href={primaryHref}>
              {primaryLabel}
            </Link>
            <Link className="button button--secondary" href="/primeiro-acesso">
              Ver onboarding
            </Link>
            <Link className="button button--secondary" href="/register">
              Fazer cadastro
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
