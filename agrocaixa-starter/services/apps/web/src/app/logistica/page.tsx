"use client";

import Link from "next/link";

import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SelectionCard";
import SummaryCard from "@/components/SummaryCard";

const logisticsAgenda = [
  {
    title: "Coleta de tomate",
    status: "Sai às 05:30",
    note: "Janela apertada para manter qualidade e evitar fila no centro de distribuição.",
  },
  {
    title: "Entrega de leite",
    status: "Checklist completo",
    note: "Rota em ordem, sem pendência de combustível ou refrigeração.",
  },
  {
    title: "Fertilizante do café",
    status: "Aguardando descarga",
    note: "Logística interna precisa alinhar equipe e área de recebimento.",
  },
];

const fleetSignals = [
  "Separar rotas por prioridade econômica e não apenas por hábito operacional.",
  "Cruzar custo de combustível com saída de carga para medir eficiência de rota.",
  "Usar a logística como parte do resultado financeiro, não como setor isolado.",
];

const dispatchChecklist = [
  "Confirmar horário de coleta, motorista, carga e destino antes da primeira saída.",
  "Revisar custo de frete, combustível e eventuais perdas por espera ou atraso.",
  "Ligar a agenda logística com os lançamentos para medir o impacto real na margem.",
];

export default function LogisticsPage() {
  return (
    <AppShell
      eyebrow="Logística da operação"
      title="Uma visão de rota, entrega e escoamento para completar o raciocínio do caixa."
      description="A logística entra como mais uma frente do produto para ligar custo, prazo e execução no campo."
      actions={
        <>
          <Link className="button button--light" href="/dashboard">
            Voltar ao painel
          </Link>
          <Link className="button button--ghost-light" href="/inteligencia">
            Ver inteligência
          </Link>
          <Link className="button button--ghost-light" href="/transactions/new">
            Lançar frete ou custo
          </Link>
        </>
      }
      aside={
        <div className="hero-glance">
          <span className="hero-glance__label">Visão rápida</span>
          <strong className="hero-glance__value">Saída e escoamento</strong>
          <p className="hero-glance__copy">
            Esta sessão ajuda a pensar coleta, entrega e frota como parte da margem final.
          </p>

          <div className="hero-glance__rows">
            <div>
              <span>Saídas críticas</span>
              <strong>{logisticsAgenda.length}</strong>
            </div>
            <div>
              <span>Checkpoints</span>
              <strong>{dispatchChecklist.length}</strong>
            </div>
          </div>
        </div>
      }
    >
      <div className="section-stack">
        <section className="summary-grid">
          <SummaryCard
            title="Frentes do dia"
            value={String(logisticsAgenda.length)}
            hint="Pontos com movimento logístico"
            tone="accent"
          />
          <SummaryCard
            title="Modo"
            value="Operação"
            hint="Logística conectada ao produto"
            tone="positive"
          />
          <SummaryCard
            title="Controle"
            value="Rotas"
            hint="Saída, entrega e recebimento"
          />
        </section>

        <section className="split-grid">
          <SectionCard
            title="Agenda logística"
            description="Uma visão executiva das saídas e entregas com maior impacto na operação."
          >
            <ul className="detail-list">
              {logisticsAgenda.map((item) => (
                <li className="detail-item" key={item.title}>
                  <strong>{item.title}</strong>
                  <div className="metric-row">
                    <span>Status</span>
                    <span>{item.status}</span>
                  </div>
                  <p className="support-paragraph">{item.note}</p>
                </li>
              ))}
            </ul>

            <div className="inline-actions">
              <Link className="button button--secondary" href="/alerts">
                Revisar alertas
              </Link>
            </div>
          </SectionCard>

          <SectionCard
            title="Ideias para evoluir o módulo"
            description="Aqui a logística aparece como uma camada viva do produto, não só como anotação."
          >
            <ul className="soft-list soft-list--card">
              {fleetSignals.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionCard>
        </section>

        <section className="split-grid">
          <SectionCard
            title="Checklist de saída"
            description="Uma leitura simples para o responsável confirmar o básico antes de perder tempo e margem."
          >
            <ul className="soft-list soft-list--card">
              {dispatchChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="Como isso conversa com o financeiro"
            description="A logística passa a ser parte da decisão econômica da fazenda."
          >
            <ul className="soft-list soft-list--card">
              <li>Frete, combustível e espera viram custo visível, não ruído operacional.</li>
              <li>Entrega atrasada afeta preço, qualidade e fluxo de caixa ao mesmo tempo.</li>
              <li>Quanto melhor a logística, melhor a leitura real de margem por atividade.</li>
            </ul>

            <div className="inline-actions">
              <Link className="button button--secondary" href="/transactions/new">
                Registrar custo logístico
              </Link>
              <Link className="button button--ghost" href="/inteligencia">
                Cruzar com mercado
              </Link>
            </div>
          </SectionCard>
        </section>
      </div>
    </AppShell>
  );
}
