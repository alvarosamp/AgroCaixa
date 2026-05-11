"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SelectionCard";
import SummaryCard from "@/components/SummaryCard";
import { ApiError, apiFetch } from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";
import {
  ActivityReportItem,
  CategoryReportItem,
  FinancialSummary,
  UnreadAlertsResponse,
} from "@/types/reports";

const firstAccessChecklist = [
  "Cadastre a fazenda, a cidade e as atividades produtivas para dar contexto ao financeiro.",
  "Comece pelos lançamentos mais recorrentes da semana para o painel aprender a operação.",
  "Use o onboarding para alinhar quem vai cadastrar, revisar alertas e acompanhar o caixa.",
];

const productModules = [
  {
    tag: "Base de uso",
    title: "Primeiro acesso guiado",
    description:
      "Explique cadastro, ativação e ordem de uso para quem está entrando no AgroCaixa pela primeira vez.",
    href: "/primeiro-acesso",
    action: "Ver onboarding",
  },
  {
    tag: "Inteligência",
    title: "Previsão de safra e mercado",
    description:
      "Leve o produto além do livro-caixa com previsão por atividade e sinais comerciais para venda.",
    href: "/inteligencia",
    action: "Abrir módulo",
  },
  {
    tag: "Operação",
    title: "Logística da fazenda",
    description:
      "Conecte frete, entrega, rota e escoamento à mesma leitura financeira da fazenda.",
    href: "/logistica",
    action: "Ver logística",
  },
  {
    tag: "Financeiro",
    title: "Fluxo e orçamento",
    description:
      "Acompanhe caixa futuro, metas por categoria e custo por atividade em visão gerencial.",
    href: "/financeiro",
    action: "Ver financeiro",
  },
  {
    tag: "Gestão",
    title: "Relatórios mensais",
    description:
      "Resuma o mês, compare safras e entenda melhor quais culturas sustentam a operação.",
    href: "/relatorios",
    action: "Abrir relatórios",
  },
  {
    tag: "Rotina",
    title: "Centro de notificações",
    description:
      "Misture vencimento, recebimento, aviso de custo e sinal comercial em uma fila mais inteligente.",
    href: "/notificacoes",
    action: "Ver notificações",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [activityReport, setActivityReport] = useState<ActivityReportItem[]>([]);
  const [categoryReport, setCategoryReport] = useState<CategoryReportItem[]>([]);
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    let active = true;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const [summaryData, activityData, categoryData, alertsData] =
          await Promise.all([
            apiFetch<FinancialSummary>("/reports/summary"),
            apiFetch<ActivityReportItem[]>("/reports/by-activity"),
            apiFetch<CategoryReportItem[]>("/reports/by-category"),
            apiFetch<UnreadAlertsResponse>("/alerts/unread-count"),
          ]);

        if (!active) {
          return;
        }

        setSummary(summaryData);
        setActivityReport(activityData);
        setCategoryReport(categoryData);
        setUnreadAlerts(alertsData.unread_count);
      } catch (err) {
        if (!active) {
          return;
        }

        if (err instanceof ApiError && err.status === 401) {
          removeToken();
          router.replace("/login");
          return;
        }

        setError("Não foi possível carregar o dashboard agora.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [router]);

  const topCategory = categoryReport[0] ?? null;
  const bestActivity = useMemo(
    () =>
      [...activityReport].sort((current, next) => next.balance - current.balance)[0] ??
      null,
    [activityReport]
  );
  const biggestPressure = useMemo(
    () =>
      [...activityReport].sort(
        (current, next) => Math.abs(next.expense) - Math.abs(current.expense)
      )[0] ?? null,
    [activityReport]
  );

  const expenseBase = summary?.expense || 0;
  const categoryHighlights = categoryReport.slice(0, 4).map((item) => ({
    ...item,
    share: expenseBase > 0 ? Math.round((item.total / expenseBase) * 100) : 0,
  }));

  const priorities = [
    unreadAlerts > 0
      ? `${unreadAlerts} alerta(s) pedem revisão antes do próximo lançamento.`
      : "Seu painel está sem alertas pendentes neste momento.",
    topCategory
      ? `A categoria ${topCategory.category} é a maior pressão de custo do período.`
      : "Ainda não há categoria dominante o suficiente para análise de custo.",
    bestActivity
      ? `${bestActivity.activity_name} é a frente com melhor saldo até agora.`
      : "Assim que houver movimentação por atividade, mostramos a mais rentável.",
  ];

  const nextMoves = [
    summary && summary.total_transactions === 0
      ? "Seu próximo passo é lançar as primeiras receitas e despesas para ativar os indicadores."
      : "Com os lançamentos em dia, já vale comparar atividades e revisar tendências de custo.",
    unreadAlerts > 0
      ? "Há alertas suficientes para revisar desvios antes de repetir gasto ou perder margem."
      : "Sem alertas críticos agora, dá para avançar na expansão com inteligência, logística e integração.",
    "O próximo ganho real está em usar fluxo de caixa futuro, relatórios e notificações como rotina da equipe.",
  ];

  return (
    <AppShell
      eyebrow="Painel operacional"
      title="Entenda a saúde financeira da fazenda sem perder tempo em planilha."
      description="Acompanhe saldo, custos por categoria e desempenho por atividade em um painel pensado para rotina rural."
      actions={
        <>
          <Link className="button button--light" href="/transactions/new">
            Novo lançamento
          </Link>
          <Link className="button button--ghost-light" href="/alerts">
            Revisar alertas
          </Link>
          <Link className="button button--ghost-light" href="/inteligencia">
            Explorar inteligência
          </Link>
        </>
      }
      aside={
        <div className="hero-glance">
          <span className="hero-glance__label">Leitura rápida</span>
          <strong className="hero-glance__value">
            {summary ? formatCurrency(summary.balance) : "Carregando..."}
          </strong>
          <p className="hero-glance__copy">
            {summary && summary.balance >= 0
              ? "A operação segue no verde. Vale monitorar categorias que subiram."
              : "O caixa precisa de atenção. Reforce análise de custos e alertas."}
          </p>

          <div className="hero-glance__rows">
            <div>
              <span>Receitas</span>
              <strong>{summary ? formatCurrency(summary.income) : "--"}</strong>
            </div>
            <div>
              <span>Saídas</span>
              <strong>{summary ? formatCurrency(summary.expense) : "--"}</strong>
            </div>
          </div>
        </div>
      }
    >
      {error ? <div className="notice notice--error">{error}</div> : null}

      {loading ? (
        <section className="surface-card section-loading">
          <h2 className="section-title section-title--compact">
            Carregando dashboard...
          </h2>
          <p className="page-subtitle">
            Estamos reunindo indicadores, categorias e alertas do período.
          </p>
        </section>
      ) : (
        <div className="section-stack">
          {summary ? (
            <section className="summary-grid">
              <SummaryCard
                title="Entradas"
                value={formatCurrency(summary.income)}
                hint="Receitas lançadas"
                tone="positive"
              />
              <SummaryCard
                title="Saídas"
                value={formatCurrency(summary.expense)}
                hint="Custos registrados"
                tone="negative"
              />
              <SummaryCard
                title="Saldo"
                value={formatCurrency(summary.balance)}
                hint="Situação atual do caixa"
                tone={summary.balance >= 0 ? "accent" : "negative"}
              />
              <SummaryCard
                title="Transações"
                value={String(summary.total_transactions)}
                hint="Movimentos no sistema"
              />
              <SummaryCard
                title="Alertas"
                value={String(unreadAlerts)}
                hint={unreadAlerts > 0 ? "Há pontos para revisar" : "Sem pendências"}
                tone={unreadAlerts > 0 ? "accent" : "default"}
              />
            </section>
          ) : null}

          <section className="insight-grid">
            <article className="surface-card insight-card">
              <span className="insight-card__label">Maior custo</span>
              <strong className="insight-card__value">
                {topCategory ? topCategory.category : "Sem dados ainda"}
              </strong>
              <p className="insight-card__copy">
                {topCategory
                  ? `${formatCurrency(topCategory.total)} concentram a principal pressão deste período.`
                  : "Assim que houver despesas categorizadas, mostramos a principal frente de atenção."}
              </p>
            </article>

            <article className="surface-card insight-card">
              <span className="insight-card__label">Atividade destaque</span>
              <strong className="insight-card__value">
                {bestActivity ? bestActivity.activity_name : "Aguardando histórico"}
              </strong>
              <p className="insight-card__copy">
                {bestActivity
                  ? `Saldo de ${formatCurrency(bestActivity.balance)} até agora.`
                  : "Faltam lançamentos por atividade para comparar resultado."}
              </p>
            </article>

            <article className="surface-card insight-card">
              <span className="insight-card__label">Maior pressão</span>
              <strong className="insight-card__value">
                {biggestPressure ? biggestPressure.activity_name : "Sem pressão mapeada"}
              </strong>
              <p className="insight-card__copy">
                {biggestPressure
                  ? `${formatCurrency(biggestPressure.expense)} em saídas acumuladas nesta frente.`
                  : "Ainda não há dados suficientes para destacar uma frente crítica."}
              </p>
            </article>
          </section>

          <section className="split-grid">
            <SectionCard
              title="Custos que mais pesam"
              description="As maiores categorias ajudam a priorizar corte, compra e negociação."
            >
              {categoryHighlights.length === 0 ? (
                <div className="empty-state">
                  Sem despesas categorizadas ainda. Assim que você lançar custos, este
                  mapa mostra onde o caixa está sendo mais pressionado.
                </div>
              ) : (
                <ul className="progress-list">
                  {categoryHighlights.map((item) => (
                    <li className="progress-list__item" key={item.category}>
                      <div className="progress-list__header">
                        <strong>{item.category}</strong>
                        <span>{formatCurrency(item.total)}</span>
                      </div>
                      <div className="progress-track">
                        <span
                          className="progress-fill"
                          style={{ width: `${Math.max(item.share, 6)}%` }}
                        />
                      </div>
                      <small>{item.share}% das saídas do período</small>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            <SectionCard
              title="Prioridades do dia"
              description="Leitura operacional direta para você agir sem abrir cinco telas."
            >
              <ul className="soft-list soft-list--card">
                {priorities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </SectionCard>
          </section>

          <section className="split-grid">
            <SectionCard
              title="Se for o primeiro acesso da equipe"
              description="Esse fluxo ajuda a reduzir dúvida no início e acelera o momento em que o painel vira algo útil."
            >
              <ul className="soft-list soft-list--card">
                {firstAccessChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="inline-actions">
                <Link className="button button--secondary" href="/primeiro-acesso">
                  Abrir onboarding
                </Link>
                <Link className="button button--ghost" href="/transactions/new">
                  Fazer primeiro lançamento
                </Link>
              </div>
            </SectionCard>

            <SectionCard
              title="Módulos novos do front"
              description="Além do financeiro, o produto agora já apresenta expansão para inteligência e logística."
            >
              <ul className="detail-list">
                {productModules.map((module) => (
                  <li className="detail-item" key={module.title}>
                    <div className="alert-meta">
                      <span className="support-pill">{module.tag}</span>
                    </div>
                    <strong>{module.title}</strong>
                    <p className="support-paragraph">{module.description}</p>
                    <div className="inline-actions">
                      <Link className="button button--secondary" href={module.href}>
                        {module.action}
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </section>

          <section className="split-grid">
            <SectionCard
              title="Resultado por atividade"
              description="Veja onde a produção está puxando saldo e onde o custo está comendo margem."
            >
              {activityReport.length === 0 ? (
                <div className="empty-state">
                  Nenhuma atividade com transações registradas ainda.
                </div>
              ) : (
                <ul className="detail-list">
                  {activityReport.map((item) => (
                    <li className="detail-item" key={item.activity_id}>
                      <strong>{item.activity_name}</strong>
                      <div className="metric-row">
                        <span>Entradas</span>
                        <span>{formatCurrency(item.income)}</span>
                      </div>
                      <div className="metric-row">
                        <span>Saídas</span>
                        <span>{formatCurrency(item.expense)}</span>
                      </div>
                      <div className="metric-row">
                        <span>Saldo</span>
                        <span>{formatCurrency(item.balance)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            <SectionCard
              title="Próximos movimentos"
              description="A ideia do produto é transformar o financeiro em rotina de decisão, não em obrigação burocrática."
            >
              <ul className="soft-list soft-list--card">
                {nextMoves.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="inline-actions">
                <Link className="button button--secondary" href="/logistica">
                  Ir para logística
                </Link>
                <Link className="button button--ghost" href="/inteligencia">
                  Ver previsão e mercado
                </Link>
              </div>
            </SectionCard>
          </section>
        </div>
      )}
    </AppShell>
  );
}
