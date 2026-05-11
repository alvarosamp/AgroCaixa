"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SelectionCard";
import SummaryCard from "@/components/SummaryCard";
import { ApiError, apiFetch } from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { FinancialAlert } from "@/types/reports";

export default function AlertsPage() {
  const router = useRouter();

  const [alerts, setAlerts] = useState<FinancialAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const unreadCount = useMemo(
    () => alerts.filter((alert) => !alert.read).length,
    [alerts]
  );
  const readCount = alerts.length - unreadCount;
  const latestAlert = alerts[0] ?? null;

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    let active = true;

    async function loadAlerts() {
      setLoading(true);
      setError("");

      try {
        const data = await apiFetch<FinancialAlert[]>("/alerts");

        if (active) {
          setAlerts(data);
        }
      } catch (err) {
        if (!active) {
          return;
        }

        if (err instanceof ApiError && err.status === 401) {
          removeToken();
          router.replace("/login");
          return;
        }

        setError("Não foi possível carregar os alertas.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAlerts();

    return () => {
      active = false;
    };
  }, [router]);

  async function markAsRead(id: number) {
    setUpdatingId(id);
    setError("");

    try {
      await apiFetch(`/alerts/${id}/read`, {
        method: "PATCH",
      });

      setAlerts((previous) =>
        previous.map((alert) =>
          alert.id === id ? { ...alert, read: true } : alert
        )
      );
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        removeToken();
        router.replace("/login");
        return;
      }

      setError("Não foi possível atualizar o alerta.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AppShell
      eyebrow="Monitoramento inteligente"
      title="Alertas que ajudam a agir antes do caixa apertar de vez."
      description="Aqui ficam os sinais mais relevantes do período para você revisar custo, receita e rotina financeira."
      actions={
        <>
          <Link className="button button--light" href="/dashboard">
            Voltar ao painel
          </Link>
          <Link className="button button--ghost-light" href="/transactions/new">
            Novo lançamento
          </Link>
        </>
      }
      aside={
        <div className="hero-glance">
          <span className="hero-glance__label">Resumo dos alertas</span>
          <strong className="hero-glance__value">
            {loading ? "..." : `${unreadCount} pendente(s)`}
          </strong>
          <p className="hero-glance__copy">
            {latestAlert
              ? `Último registro em ${formatDateTime(latestAlert.date)}.`
              : "Sem sinais recentes gerados pela operação."}
          </p>
        </div>
      }
    >
      {error ? <div className="notice notice--error">{error}</div> : null}

      {loading ? (
        <section className="surface-card section-loading">
          <h2 className="section-title section-title--compact">
            Buscando alertas...
          </h2>
          <p className="page-subtitle">
            Estamos consolidando os sinais financeiros mais recentes.
          </p>
        </section>
      ) : (
        <div className="section-stack">
          <section className="summary-grid">
            <SummaryCard
              title="Pendentes"
              value={String(unreadCount)}
              hint="Alertas que merecem revisão"
              tone={unreadCount > 0 ? "accent" : "default"}
            />
            <SummaryCard
              title="Lidos"
              value={String(readCount)}
              hint="Sinais já revisados"
              tone="positive"
            />
            <SummaryCard
              title="Total"
              value={String(alerts.length)}
              hint="Histórico disponível"
            />
            <SummaryCard
              title="Último evento"
              value={latestAlert ? formatDateTime(latestAlert.date) : "Sem histórico"}
              hint="Momento do alerta mais recente"
            />
          </section>

          <section className="split-grid">
            <SectionCard
              title="Linha do tempo financeira"
              description="Use esta visão para entender quais sinais ainda pedem resposta."
            >
              {alerts.length === 0 ? (
                <div className="empty-state">
                  Nenhum alerta gerado até agora. Isso pode indicar um período estável
                  ou pouco histórico acumulado.
                </div>
              ) : (
                <ul className="timeline-list">
                  {alerts.map((alert) => (
                    <li
                      key={alert.id}
                      className={`timeline-item ${
                        alert.read ? "timeline-item--read" : ""
                      }`}
                    >
                      <div className="timeline-item__dot" />
                      <div className="timeline-item__content">
                        <div className="alert-meta">
                          <span
                            className={`badge ${
                              alert.type === "expense"
                                ? "badge--expense"
                                : alert.type === "income"
                                  ? "badge--income"
                                  : "badge--neutral"
                            }`}
                          >
                            {alert.type}
                          </span>
                          <span className="caption">{formatDateTime(alert.date)}</span>
                          <span className="caption">
                            {alert.read ? "Lido" : "Pendente"}
                          </span>
                        </div>

                        <p>{alert.message}</p>

                        {!alert.read ? (
                          <div className="inline-actions">
                            <button
                              className="button button--ghost"
                              disabled={updatingId === alert.id}
                              onClick={() => markAsRead(alert.id)}
                              type="button"
                            >
                              {updatingId === alert.id
                                ? "Atualizando..."
                                : "Marcar como lido"}
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            <SectionCard
              title="Como eu melhoraria essa rotina"
              description="O valor desses alertas está em orientar decisão rápida, não em gerar barulho."
            >
              <ul className="soft-list soft-list--card">
                <li>Use alertas de gasto para revisar fornecedor, combustível e manutenção.</li>
                <li>Use alertas de receita para antecipar ajuste de venda ou cobrança.</li>
                <li>Marque como lido só depois de decidir a ação, não apenas por organização.</li>
              </ul>
            </SectionCard>
          </section>
        </div>
      )}
    </AppShell>
  );
}
