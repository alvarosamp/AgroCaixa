"use client";

import Link from "next/link";

import BrandMark from "@/components/BrandMark";

const steps = [
  {
    title: "Criar a conta",
    description:
      "Cadastre responsável, e-mail e senha para abrir o ambiente da fazenda.",
  },
  {
    title: "Cadastrar a estrutura",
    description:
      "O próximo passo é registrar fazenda, cidade, produção e atividades principais.",
  },
  {
    title: "Começar os lançamentos",
    description:
      "Com a estrutura pronta, o produto passa a ler caixa, custos, alertas e oportunidades.",
  },
];

const firstAccessIdeas = [
  "Organizar o financeiro da fazenda sem depender de planilhas paralelas.",
  "Trazer previsão de safra, mercado e logística para o mesmo ecossistema do caixa.",
  "Deixar claro para o produtor o que precisa ser feito no primeiro dia de uso.",
];

const afterRegisterModules = [
  {
    title: "Painel financeiro",
    description:
      "Depois do cadastro, o primeiro valor entregue vem do saldo, das categorias e dos alertas.",
    href: "/dashboard",
    action: "Abrir visão do produto",
  },
  {
    title: "Inteligência agrícola",
    description:
      "A próxima camada entra com previsão de safra e preço de mercado para apoiar venda.",
    href: "/inteligencia",
    action: "Ver inteligência",
  },
  {
    title: "Logística da operação",
    description:
      "Rotas, coleta e entrega passam a conversar com margem, prazo e escoamento.",
    href: "/logistica",
    action: "Conhecer logística",
  },
];

export default function FirstAccessPage() {
  return (
    <main className="landing-shell landing-shell--guide">
      <header className="landing-nav">
        <BrandMark tone="light" />
        <div className="landing-nav__actions">
          <Link className="button button--ghost-light" href="/login">
            Já tenho acesso
          </Link>
          <Link className="button button--light" href="/register">
            Criar conta
          </Link>
        </div>
      </header>

      <section className="landing-hero landing-hero--guide">
        <div className="landing-hero__copy">
          <span className="kicker">Primeiro acesso guiado</span>
          <h1 className="page-title page-title--display">
            O que acontece quando alguém entra no AgroCaixa pela primeira vez.
          </h1>
          <p className="page-subtitle page-subtitle--hero">
            Esta etapa existe para explicar cadastro, ativação e o caminho até o
            primeiro valor útil dentro do painel.
          </p>

          <div className="header-actions">
            <Link className="button button--accent" href="/register">
              Fazer meu cadastro
            </Link>
            <Link className="button button--ghost-light" href="/login">
              Entrar com conta existente
            </Link>
          </div>
        </div>

        <div className="mock-card mock-card--hero">
          <span className="mock-card__eyebrow">Seu primeiro dia</span>
          <strong className="mock-card__value">Conta criada → estrutura cadastrada → painel ativo</strong>
          <p className="mock-card__copy">
            A proposta do primeiro acesso é deixar claro como sair do zero até um
            painel que já comece a orientar decisão.
          </p>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-heading">
          <span className="kicker kicker--dark">Passo a passo</span>
          <h2 className="section-title">
            Uma jornada simples para quem nunca usou o sistema antes.
          </h2>
        </div>

        <div className="step-grid">
          {steps.map((item, index) => (
            <article key={item.title} className="surface-card step-card">
              <span className="step-card__index">{`0${index + 1}`}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="section-heading">
          <span className="kicker kicker--dark">O que eu adicionei como ideia de produto</span>
          <h2 className="section-title">
            O primeiro acesso agora conversa com expansão de valor, não só com login.
          </h2>
        </div>

        <ul className="soft-list soft-list--card">
          {firstAccessIdeas.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="landing-section">
        <div className="section-heading">
          <span className="kicker kicker--dark">Depois do cadastro</span>
          <h2 className="section-title">
            O usuário não para no login. Ele descobre os módulos e entende o valor do produto.
          </h2>
        </div>

        <div className="feature-grid">
          {afterRegisterModules.map((module) => (
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

      <section className="landing-section landing-section--cta">
        <div className="surface-card landing-cta">
          <div>
            <span className="kicker kicker--dark">Próximo passo</span>
            <h2 className="section-title">
              Se a pessoa está pronta para começar, o caminho agora está muito mais claro.
            </h2>
          </div>

          <div className="header-actions">
            <Link className="button" href="/register">
              Criar conta
            </Link>
            <Link className="button button--secondary" href="/login">
              Entrar
            </Link>
            <Link className="button button--secondary" href="/">
              Voltar ao site
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
