"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SelectionCard";
import SummaryCard from "@/components/SummaryCard";
import { getToken } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";
import { monthlyReports, profitabilityBoard } from "@/lib/showcase";

export default function ReportsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
    }
  }, [router]);

  const latestReport = monthlyReports[monthlyReports.length - 1];

  return (
    <AppShell
      eyebrow="Relatórios automáticos"
      title="Fechamento mensal, lucratividade por cultura e leitura simples para o produtor."
      description="Essa área traduz o financeiro em relatório de gestão, com linguagem mais acessível e visão de margem."
      actions={
        <>
          <Link className="button button--light" href="/financeiro">
            Voltar ao centro financeiro
          </Link>
          <Link className="button button--ghost-light" href="/notificacoes">
            Ver notificações
          </Link>
        </>
      }
      aside={
        <div className="hero-glance">
          <span className="hero-glance__label">Último fechamento</span>
          <strong className="hero-glance__value">{latestReport.month}</strong>
          <p className="hero-glance__copy">
            Relatório com receita, despesa, saldo e atividade destaque para facilitar conversa de gestão.
          </p>
        </div>
      }
    >
      <div className="section-stack">
        <section className="summary-grid">
          <SummaryCard
            title="Último saldo"
            value={formatCurrency(latestReport.balance)}
            hint={latestReport.month}
            tone="positive"
          />
          <SummaryCard
            title="Receita"
            value={formatCurrency(latestReport.revenue)}
            hint="Fechamento mais recente"
            tone="accent"
          />
          <SummaryCard
            title="Relatórios"
            value={String(monthlyReports.length)}
            hint="Ciclos já simulados"
          />
        </section>

        <section className="split-grid">
          <SectionCard
            title="Relatórios mensais"
            description="Uma base para o resumo automático que o sistema pode entregar todo mês."
          >
            <ul className="detail-list">
              {monthlyReports.map((report) => (
                <li className="detail-item" key={report.month}>
                  <strong>{report.month}</strong>
                  <div className="metric-row">
                    <span>Receita</span>
                    <span>{formatCurrency(report.revenue)}</span>
                  </div>
                  <div className="metric-row">
                    <span>Despesa</span>
                    <span>{formatCurrency(report.expense)}</span>
                  </div>
                  <div className="metric-row">
                    <span>Saldo</span>
                    <span>{formatCurrency(report.balance)}</span>
                  </div>
                  <p className="support-paragraph">
                    Atividade destaque: {report.topActivity}
                  </p>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="Lucratividade por cultura"
            description="Ajuda a responder quais frentes sustentam melhor a operação."
          >
            <ul className="detail-list">
              {profitabilityBoard.map((item) => (
                <li className="detail-item" key={item.culture}>
                  <strong>{item.culture}</strong>
                  <div className="metric-row">
                    <span>Receita</span>
                    <span>{formatCurrency(item.revenue)}</span>
                  </div>
                  <div className="metric-row">
                    <span>Custo</span>
                    <span>{formatCurrency(item.cost)}</span>
                  </div>
                  <div className="metric-row">
                    <span>Margem</span>
                    <span>{formatCurrency(item.margin)}</span>
                  </div>
                  <p className="support-paragraph">{item.cycle}</p>
                </li>
              ))}
            </ul>
          </SectionCard>
        </section>

        <SectionCard
          title="Como eu venderia o valor desses relatórios"
          description="Essa camada torna o produto mais executivo e menos dependente de interpretação manual."
        >
          <ul className="soft-list soft-list--card">
            <li>Resumo mensal automático em linguagem simples para o produtor não técnico.</li>
            <li>Comparação de mês contra mês e de safra contra safra no mesmo fluxo.</li>
            <li>Leitura de margem por cultura para apoiar decisão de plantio, venda e corte.</li>
          </ul>
        </SectionCard>
      </div>
    </AppShell>
  );
}
