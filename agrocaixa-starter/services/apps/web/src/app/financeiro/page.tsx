"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SelectionCard";
import SummaryCard from "@/components/SummaryCard";
import { getToken } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";
import { budgetStatus, cashflowForecast, harvestComparisons, productionCosts } from "@/lib/showcase";

export default function FinancePage() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <AppShell
      eyebrow="Centro financeiro"
      title="Fluxo de caixa futuro, orçamento e custo rural em uma visão mais gerencial."
      description="Aqui o AgroCaixa deixa de ser só registro e passa a apoiar previsão, comparação e decisão de margem."
      actions={
        <>
          <Link className="button button--light" href="/transactions">
            Ver movimentações
          </Link>
          <Link className="button button--ghost-light" href="/relatorios">
            Abrir relatórios
          </Link>
        </>
      }
      aside={
        <div className="hero-glance">
          <span className="hero-glance__label">Projeção central</span>
          <strong className="hero-glance__value">{formatCurrency(cashflowForecast[1].balance)}</strong>
          <p className="hero-glance__copy">
            A leitura de 30 dias ajuda a priorizar compra, venda e vencimento antes do aperto no caixa.
          </p>
        </div>
      }
    >
      <div className="section-stack">
        <section className="summary-grid">
          {cashflowForecast.map((item) => (
            <SummaryCard
              key={item.label}
              title={`Fluxo ${item.label}`}
              value={formatCurrency(item.balance)}
              hint="Saldo projetado"
              tone={item.balance >= 0 ? "positive" : "negative"}
            />
          ))}
        </section>

        <section className="split-grid">
          <SectionCard
            title="Previsão de fluxo de caixa"
            description="Uma leitura de 7, 30 e 90 dias para reduzir surpresa e melhorar negociação."
          >
            <ul className="detail-list">
              {cashflowForecast.map((item) => (
                <li className="detail-item" key={item.label}>
                  <strong>{item.label}</strong>
                  <div className="metric-row">
                    <span>Entradas</span>
                    <span>{formatCurrency(item.inflow)}</span>
                  </div>
                  <div className="metric-row">
                    <span>Saídas</span>
                    <span>{formatCurrency(item.outflow)}</span>
                  </div>
                  <div className="metric-row">
                    <span>Saldo</span>
                    <span>{formatCurrency(item.balance)}</span>
                  </div>
                  <p className="support-paragraph">{item.note}</p>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="Orçamento por categoria"
            description="Orçamento vira referência prática para combustível, insumo, folha e manutenção."
          >
            <ul className="progress-list">
              {budgetStatus.map((item) => {
                const share = Math.round((item.actual / item.budget) * 100);

                return (
                  <li className="progress-list__item" key={item.category}>
                    <div className="progress-list__header">
                      <strong>{item.category}</strong>
                      <span>{item.unit}</span>
                    </div>
                    <div className="metric-row">
                      <span>Meta</span>
                      <span>{formatCurrency(item.budget)}</span>
                    </div>
                    <div className="metric-row">
                      <span>Realizado</span>
                      <span>{formatCurrency(item.actual)}</span>
                    </div>
                    <div className="progress-track">
                      <span
                        className="progress-fill"
                        style={{ width: `${Math.max(share, 6)}%` }}
                      />
                    </div>
                    <small>{share}% do orçamento consumido</small>
                    <p className="support-paragraph">{item.note}</p>
                  </li>
                );
              })}
            </ul>
          </SectionCard>
        </section>

        <section className="split-grid">
          <SectionCard
            title="Custo por atividade"
            description="A leitura por hectare, lote ou módulo aproxima o financeiro da realidade do campo."
          >
            <ul className="detail-list">
              {productionCosts.map((item) => (
                <li className="detail-item" key={item.activity}>
                  <strong>{item.activity}</strong>
                  <div className="metric-row">
                    <span>Por hectare</span>
                    <span>{item.perHectare}</span>
                  </div>
                  <div className="metric-row">
                    <span>Por lote</span>
                    <span>{item.perLot}</span>
                  </div>
                  <div className="metric-row">
                    <span>Margem</span>
                    <span>{item.margin}</span>
                  </div>
                  <p className="support-paragraph">{item.note}</p>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="Comparação entre safras"
            description="Uma forma de cruzar área, produção e resultado para não analisar o caixa fora do contexto produtivo."
          >
            <ul className="detail-list">
              {harvestComparisons.map((item) => (
                <li className="detail-item" key={item.cycle}>
                  <strong>{item.cycle}</strong>
                  <div className="metric-row">
                    <span>Área</span>
                    <span>{item.area}</span>
                  </div>
                  <div className="metric-row">
                    <span>Produção</span>
                    <span>{item.production}</span>
                  </div>
                  <div className="metric-row">
                    <span>Margem</span>
                    <span>{item.margin}</span>
                  </div>
                  <p className="support-paragraph">{item.note}</p>
                </li>
              ))}
            </ul>
          </SectionCard>
        </section>
      </div>
    </AppShell>
  );
}
