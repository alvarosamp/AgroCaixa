"use client";

import Link from "next/link";

import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SelectionCard";
import SummaryCard from "@/components/SummaryCard";

const harvestForecast = [
  {
    activity: "Milho safrinha",
    stage: "Floração",
    forecast: "318 sacas previstas",
    note: "Condição boa, mas sensível a chuva irregular nos próximos 10 dias.",
  },
  {
    activity: "Café",
    stage: "Formação",
    forecast: "92 sacas previstas",
    note: "Risco moderado por custo elevado de adubação e janela curta de manejo.",
  },
  {
    activity: "Tomate",
    stage: "Colheita escalonada",
    forecast: "26 toneladas previstas",
    note: "Bom potencial se logística de saída continuar estável.",
  },
];

const marketSignals = [
  {
    product: "Milho",
    price: "R$ 62,40 / saca",
    trend: "Alta leve",
    commentary: "Mercado firme, com oportunidade de travar parte da produção.",
  },
  {
    product: "Café",
    price: "R$ 1.148 / saca",
    trend: "Volátil",
    commentary: "Oscilação forte, exigindo decisão mais tática por lote.",
  },
  {
    product: "Tomate",
    price: "R$ 78 / caixa",
    trend: "Pressão logística",
    commentary: "Preço bom, mas frete e janela de entrega precisam atenção.",
  },
];

const intelligenceIdeas = [
  "Cruzar previsão de safra com histórico de custo para antecipar aperto de margem.",
  "Receber alertas quando o preço de mercado abrir uma janela melhor de venda.",
  "Ligar risco de clima, produtividade e logística na mesma decisão comercial.",
];

const decisionMoves = [
  "Separar o que será vendido à vista do que vale segurar por alguns dias.",
  "Priorizar atividades com melhor margem e menor risco operacional nas próximas semanas.",
  "Planejar a saída da produção junto da logística para proteger preço e qualidade.",
];

export default function IntelligencePage() {
  return (
    <AppShell
      eyebrow="Inteligência agrícola"
      title="Previsão de safra e leitura de mercado para transformar caixa em estratégia."
      description="Aqui o produto avança do financeiro puro para camadas de previsão, preço e decisão comercial."
      actions={
        <>
          <Link className="button button--light" href="/dashboard">
            Voltar ao painel
          </Link>
          <Link className="button button--ghost-light" href="/logistica">
            Ver logística
          </Link>
          <Link className="button button--ghost-light" href="/transactions/new">
            Lançar custo ou receita
          </Link>
        </>
      }
      aside={
        <div className="hero-glance">
          <span className="hero-glance__label">Leitura da frente</span>
          <strong className="hero-glance__value">Safra + mercado</strong>
          <p className="hero-glance__copy">
            Uma camada de inteligência para apoiar decisão sobre venda, risco e janela operacional.
          </p>

          <div className="hero-glance__rows">
            <div>
              <span>Safras lidas</span>
              <strong>{harvestForecast.length}</strong>
            </div>
            <div>
              <span>Mercados ativos</span>
              <strong>{marketSignals.length}</strong>
            </div>
          </div>
        </div>
      }
    >
      <div className="section-stack">
        <section className="summary-grid">
          <SummaryCard
            title="Atividades monitoradas"
            value={String(harvestForecast.length)}
            hint="Previsão por frente produtiva"
            tone="positive"
          />
          <SummaryCard
            title="Produtos em mercado"
            value={String(marketSignals.length)}
            hint="Itens com leitura comercial"
            tone="accent"
          />
          <SummaryCard
            title="Módulo"
            value="Expansão"
            hint="Camada nova do produto"
          />
          <SummaryCard
            title="Foco"
            value="Venda"
            hint="Decisão comercial com contexto"
          />
        </section>

        <section className="split-grid">
          <SectionCard
            title="Previsão de safra"
            description="Uma forma de o produtor enxergar produtividade esperada e risco operacional."
          >
            <ul className="detail-list">
              {harvestForecast.map((item) => (
                <li className="detail-item" key={item.activity}>
                  <strong>{item.activity}</strong>
                  <div className="metric-row">
                    <span>Estágio</span>
                    <span>{item.stage}</span>
                  </div>
                  <div className="metric-row">
                    <span>Previsão</span>
                    <span>{item.forecast}</span>
                  </div>
                  <p className="support-paragraph">{item.note}</p>
                </li>
              ))}
            </ul>

            <div className="inline-actions">
              <Link className="button button--secondary" href="/transactions/new">
                Atualizar lançamentos
              </Link>
            </div>
          </SectionCard>

          <SectionCard
            title="Preço de mercado"
            description="Leitura resumida para apoiar decisão de venda e timing comercial."
          >
            <ul className="detail-list">
              {marketSignals.map((item) => (
                <li className="detail-item" key={item.product}>
                  <strong>{item.product}</strong>
                  <div className="metric-row">
                    <span>Preço</span>
                    <span>{item.price}</span>
                  </div>
                  <div className="metric-row">
                    <span>Tendência</span>
                    <span>{item.trend}</span>
                  </div>
                  <p className="support-paragraph">{item.commentary}</p>
                </li>
              ))}
            </ul>

            <div className="inline-actions">
              <Link className="button button--secondary" href="/logistica">
                Cruzar com logística
              </Link>
            </div>
          </SectionCard>
        </section>

        <section className="split-grid">
          <SectionCard
            title="Decisões que este módulo apoia"
            description="A camada de inteligência existe para ajudar o produtor a agir com mais contexto."
          >
            <ul className="soft-list soft-list--card">
              {decisionMoves.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="Como evoluir a visão de produto"
            description="Essas ideias deixam claro que o AgroCaixa pode virar um centro de decisão rural."
          >
            <ul className="soft-list soft-list--card">
              {intelligenceIdeas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="inline-actions">
              <Link className="button button--secondary" href="/primeiro-acesso">
                Rever jornada inicial
              </Link>
              <Link className="button button--ghost" href="/dashboard">
                Voltar ao caixa
              </Link>
            </div>
          </SectionCard>
        </section>
      </div>
    </AppShell>
  );
}
