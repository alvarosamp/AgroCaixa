"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SelectionCard";
import SummaryCard from "@/components/SummaryCard";
import { ApiError, apiFetch } from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/format";
import { ActivityOption, FarmResponse, TransactionItem } from "@/types/reports";

type ImportedRow = {
  date: string;
  description: string;
  amount: string;
  category: string;
};

export default function TransactionsPage() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [farmFilter, setFarmFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [farms, setFarms] = useState<FarmResponse[]>([]);
  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [importRows, setImportRows] = useState<ImportedRow[]>([]);
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
        const [transactionData, farmData, activityData] = await Promise.all([
          apiFetch<TransactionItem[]>("/transactions/"),
          apiFetch<FarmResponse[]>("/farms"),
          apiFetch<ActivityOption[]>("/activities"),
        ]);

        if (!active) {
          return;
        }

        setTransactions(transactionData);
        setFarms(farmData);
        setActivities(activityData);
      } catch (err) {
        if (!active) {
          return;
        }

        if (err instanceof ApiError && err.status === 401) {
          removeToken();
          router.replace("/login");
          return;
        }

        setError("Não foi possível carregar as transações agora.");
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

  const activityMap = useMemo(() => {
    return new Map(activities.map((activity) => [activity.id, activity]));
  }, [activities]);

  const farmMap = useMemo(() => {
    return new Map(farms.map((farm) => [farm.id, farm]));
  }, [farms]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      if (typeFilter !== "all" && item.type !== typeFilter) {
        return false;
      }

      const activity = item.activity_id ? activityMap.get(item.activity_id) : undefined;
      const farm = activity ? farmMap.get(activity.farm_id) : undefined;

      if (farmFilter !== "all" && farm?.name !== farmFilter) {
        return false;
      }

      if (activityFilter !== "all" && activity?.name !== activityFilter) {
        return false;
      }

      return true;
    });
  }, [activityFilter, activityMap, farmFilter, farmMap, transactions, typeFilter]);

  const totals = useMemo(() => {
    return filteredTransactions.reduce(
      (accumulator, item) => {
        if (item.type === "income") {
          accumulator.income += item.amount;
        } else {
          accumulator.expense += item.amount;
        }

        if (!item.category || !item.description) {
          accumulator.needsReview += 1;
        }

        return accumulator;
      },
      { income: 0, expense: 0, needsReview: 0 }
    );
  }, [filteredTransactions]);

  function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || "");
      const lines = content.split(/\r?\n/).filter(Boolean);
      const rows = lines.slice(1, 7).map((line) => {
        const columns = line.split(",").map((item) => item.trim());

        return {
          date: columns[0] || "",
          description: columns[1] || "",
          amount: columns[2] || "",
          category: columns[3] || "",
        };
      });

      setImportRows(rows.filter((row) => row.date || row.description || row.amount));
    };

    reader.readAsText(file);
  }

  return (
    <AppShell
      eyebrow="Movimentos financeiros"
      title="Uma listagem de transações com filtros para acompanhar entradas, saídas e revisão de dados."
      description="Agora a tela já usa a API real de transações e abre o caminho para importação de planilhas antigas."
      actions={
        <>
          <Link className="button button--light" href="/transactions/new">
            Novo lançamento
          </Link>
          <Link className="button button--ghost-light" href="/financeiro">
            Ver fluxo de caixa
          </Link>
        </>
      }
      aside={
        <div className="hero-glance">
          <span className="hero-glance__label">Movimento filtrado</span>
          <strong className="hero-glance__value">
            {loading ? "..." : `${filteredTransactions.length} registros`}
          </strong>
          <p className="hero-glance__copy">
            Filtro por tipo, fazenda e atividade para o produtor entender rápido o que entrou, saiu e ainda pede revisão.
          </p>
        </div>
      }
    >
      {error ? <div className="notice notice--error">{error}</div> : null}

      {loading ? (
        <section className="surface-card section-loading">
          <h2 className="section-title section-title--compact">Carregando transações...</h2>
          <p className="page-subtitle">
            Estamos reunindo histórico, fazendas e atividades para a leitura completa.
          </p>
        </section>
      ) : (
        <div className="section-stack">
          <section className="summary-grid">
            <SummaryCard
              title="Entradas"
              value={formatCurrency(totals.income)}
              hint="Recebimentos filtrados"
              tone="positive"
            />
            <SummaryCard
              title="Saídas"
              value={formatCurrency(totals.expense)}
              hint="Despesas filtradas"
              tone="negative"
            />
            <SummaryCard
              title="Revisar"
              value={String(totals.needsReview)}
              hint="Itens sem categoria ou descrição"
              tone={totals.needsReview > 0 ? "accent" : "default"}
            />
          </section>

          <section className="split-grid">
            <SectionCard
              title="Filtros principais"
              description="Uma base real para a rotina de movimentos e futura conciliação."
            >
              <div className="support-actions">
                <button
                  className={`button ${typeFilter === "all" ? "" : "button--secondary"}`}
                  onClick={() => setTypeFilter("all")}
                  type="button"
                >
                  Tudo
                </button>
                <button
                  className={`button ${typeFilter === "income" ? "" : "button--secondary"}`}
                  onClick={() => setTypeFilter("income")}
                  type="button"
                >
                  Só entradas
                </button>
                <button
                  className={`button ${typeFilter === "expense" ? "" : "button--secondary"}`}
                  onClick={() => setTypeFilter("expense")}
                  type="button"
                >
                  Só saídas
                </button>
              </div>

              <div className="field">
                <label htmlFor="farm-filter">Fazenda</label>
                <select
                  id="farm-filter"
                  className="select"
                  value={farmFilter}
                  onChange={(event) => setFarmFilter(event.target.value)}
                >
                  <option value="all">Todas as fazendas</option>
                  {farms.map((farm) => (
                    <option key={farm.id} value={farm.name}>
                      {farm.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="activity-filter">Atividade</label>
                <select
                  id="activity-filter"
                  className="select"
                  value={activityFilter}
                  onChange={(event) => setActivityFilter(event.target.value)}
                >
                  <option value="all">Todas as atividades</option>
                  {activities.map((activity) => (
                    <option key={activity.id} value={activity.name}>
                      {activity.name}
                    </option>
                  ))}
                </select>
              </div>
            </SectionCard>

            <SectionCard
              title="Importação CSV"
              description="Primeiro passo para migrar planilhas e extratos sem redigitar tudo."
            >
              <div className="field">
                <label htmlFor="csv-import">Arquivo CSV</label>
                <input
                  id="csv-import"
                  className="input"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleImportFile}
                />
                <p className="helper-text">
                  Modelo sugerido: `data,descricao,valor,categoria`
                </p>
              </div>

              {importRows.length > 0 ? (
                <ul className="detail-list">
                  {importRows.map((row, index) => (
                    <li className="detail-item" key={`${row.date}-${index}`}>
                      <strong>{row.description || "Linha importada"}</strong>
                      <div className="metric-row">
                        <span>Data</span>
                        <span>{row.date || "--"}</span>
                      </div>
                      <div className="metric-row">
                        <span>Valor</span>
                        <span>{row.amount || "--"}</span>
                      </div>
                      <div className="metric-row">
                        <span>Categoria</span>
                        <span>{row.category || "--"}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-state">
                  Suba um CSV simples para visualizar as primeiras linhas e preparar a futura importação assistida.
                </div>
              )}
            </SectionCard>
          </section>

          <SectionCard
            title="Histórico de transações"
            description="Agora a leitura já nasce dos dados reais da conta."
          >
            {filteredTransactions.length === 0 ? (
              <div className="empty-state">
                Nenhuma transação encontrada com os filtros atuais.
              </div>
            ) : (
              <ul className="detail-list">
                {filteredTransactions.map((transaction) => {
                  const activity = transaction.activity_id
                    ? activityMap.get(transaction.activity_id)
                    : undefined;
                  const farm = activity ? farmMap.get(activity.farm_id) : undefined;

                  return (
                    <li className="detail-item" key={transaction.id}>
                      <strong>{transaction.description || `Transação #${transaction.id}`}</strong>
                      <div className="metric-row">
                        <span>Data</span>
                        <span>{formatDate(transaction.date)}</span>
                      </div>
                      <div className="metric-row">
                        <span>Fazenda</span>
                        <span>{farm?.name || "Sem fazenda vinculada"}</span>
                      </div>
                      <div className="metric-row">
                        <span>Atividade</span>
                        <span>{activity?.name || transaction.activity_name || "Sem atividade"}</span>
                      </div>
                      <div className="metric-row">
                        <span>Tipo</span>
                        <span>{transaction.type === "income" ? "Entrada" : "Saída"}</span>
                      </div>
                      <div className="metric-row">
                        <span>Categoria</span>
                        <span>{transaction.category || "A revisar"}</span>
                      </div>
                      <div className="metric-row">
                        <span>Valor</span>
                        <span>{formatCurrency(transaction.amount)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>
        </div>
      )}
    </AppShell>
  );
}
