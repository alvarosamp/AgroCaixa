"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SelectionCard";
import SummaryCard from "@/components/SummaryCard";
import { getToken } from "@/lib/auth";
import { notificationCenter } from "@/lib/showcase";

export default function NotificationsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
    }
  }, [router]);

  const highPriority = notificationCenter.filter((item) => item.priority === "Alta").length;

  return (
    <AppShell
      eyebrow="Centro de notificações"
      title="Uma fila mais inteligente de avisos para agir rápido sem virar ruído operacional."
      description="Aqui entram vencimento, recebimento, desvio de custo, oportunidade de venda e próximos passos do sistema."
      actions={
        <>
          <Link className="button button--light" href="/alerts">
            Ver alertas financeiros
          </Link>
          <Link className="button button--ghost-light" href="/integracoes">
            Ver canais e integrações
          </Link>
        </>
      }
      aside={
        <div className="hero-glance">
          <span className="hero-glance__label">Prioridade alta</span>
          <strong className="hero-glance__value">{highPriority} avisos</strong>
          <p className="hero-glance__copy">
            Uma central com prioridade ajuda o produtor a responder o que importa primeiro.
          </p>
        </div>
      }
    >
      <div className="section-stack">
        <section className="summary-grid">
          <SummaryCard
            title="Avisos"
            value={String(notificationCenter.length)}
            hint="Itens no centro"
            tone="accent"
          />
          <SummaryCard
            title="Alta prioridade"
            value={String(highPriority)}
            hint="Ações mais urgentes"
            tone={highPriority > 0 ? "negative" : "default"}
          />
          <SummaryCard
            title="Canais"
            value="4"
            hint="Sistema, email, WhatsApp e comercial"
          />
        </section>

        <section className="split-grid">
          <SectionCard
            title="Fila de notificações"
            description="A ideia é misturar financeiro, operação e comercial em um só lugar, com contexto."
          >
            <ul className="detail-list">
              {notificationCenter.map((item) => (
                <li className="detail-item" key={item.id}>
                  <div className="alert-meta">
                    <span className="support-pill">{item.priority}</span>
                    <span className="caption">{item.channel}</span>
                    <span className="caption">{item.status}</span>
                  </div>
                  <strong>{item.title}</strong>
                  <div className="metric-row">
                    <span>Responsável</span>
                    <span>{item.owner}</span>
                  </div>
                  <p className="support-paragraph">{item.message}</p>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="O que melhora com isso"
            description="O sistema fica mais proativo e começa a conversar com a rotina do produtor."
          >
            <ul className="soft-list soft-list--card">
              <li>Alerta de custo alto antes do fechamento do mês.</li>
              <li>Aviso de recebimento atrasado para não distorcer a projeção de caixa.</li>
              <li>Sinal comercial e vencimento no mesmo ecossistema de gestão.</li>
            </ul>
          </SectionCard>
        </section>
      </div>
    </AppShell>
  );
}
