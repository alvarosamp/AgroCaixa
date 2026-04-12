"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SectionCard from "@/components/SelectionCard";
import SummaryCard from "@/components/SummaryCard";
import { apiFetch } from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";
import {
  ActivityReportItem,
  CategoryReportItem,
  FinancialSummary,
} from "@/types/reports";

export default function DashboardPage() {
  const router = useRouter();

  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [activityReport, setActivityReport] = useState<ActivityReportItem[]>([]);
  const [categoryReport, setCategoryReport] = useState<CategoryReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    async function loadData() {
      try {
        const [summaryData, activityData, categoryData] = await Promise.all([
          apiFetch<FinancialSummary>("/reports/summary"),
          apiFetch<ActivityReportItem[]>("/reports/by-activity"),
          apiFetch<CategoryReportItem[]>("/reports/by-category"),
        ]);

        setSummary(summaryData);
        setActivityReport(activityData);
        setCategoryReport(categoryData);
      } catch (error) {
        removeToken();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading) {
    return <main style={{ padding: 24 }}>Carregando dashboard...</main>;
  }

  return (
    <main style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1>Dashboard AgroCaixa</h1>
        <button
          onClick={() => {
            removeToken();
            router.push("/login");
          }}
        >
          Sair
        </button>
      </div>

      {summary && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <SummaryCard title="Entradas" value={`R$ ${summary.income.toFixed(2)}`} />
          <SummaryCard title="Saídas" value={`R$ ${summary.expense.toFixed(2)}`} />
          <SummaryCard title="Saldo" value={`R$ ${summary.balance.toFixed(2)}`} />
          <SummaryCard
            title="Transações"
            value={String(summary.total_transactions)}
          />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <SectionCard title="Resultado por atividade">
          <ul>
            {activityReport.map((item) => (
              <li key={item.activity_id} style={{ marginBottom: 12 }}>
                <strong>{item.activity_name}</strong>
                <div>Entradas: R$ {item.income.toFixed(2)}</div>
                <div>Saídas: R$ {item.expense.toFixed(2)}</div>
                <div>Saldo: R$ {item.balance.toFixed(2)}</div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Gastos por categoria">
          <ul>
            {categoryReport.map((item) => (
              <li key={item.category} style={{ marginBottom: 12 }}>
                <strong>{item.category}</strong>
                <div>Total: R$ {item.total.toFixed(2)}</div>
                <div>Transações: {item.transactions_count}</div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </main>
  );
}
