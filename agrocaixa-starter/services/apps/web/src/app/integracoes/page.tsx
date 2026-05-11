"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SelectionCard";
import SummaryCard from "@/components/SummaryCard";
import { getToken } from "@/lib/auth";
import { integrationIdeas } from "@/lib/showcase";

export default function IntegrationsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <AppShell
      eyebrow="Integrações e automação"
      title="Conecte WhatsApp, planilhas, OCR e fontes externas para reduzir retrabalho."
      description="Essa frente posiciona o produto para ganhar adoção real, menos digitação e mais automação útil ao campo."
      actions={
        <>
          <Link className="button button--light" href="/notificacoes">
            Ver centro de notificações
          </Link>
          <Link className="button button--ghost-light" href="/transactions">
            Abrir movimentos
          </Link>
        </>
      }
      aside={
        <div className="hero-glance">
          <span className="hero-glance__label">Roadmap de conexão</span>
          <strong className="hero-glance__value">{integrationIdeas.length} frentes</strong>
          <p className="hero-glance__copy">
            As integrações certas fazem o SaaS parecer menos um sistema e mais um braço operacional do produtor.
          </p>
        </div>
      }
    >
      <div className="section-stack">
        <section className="summary-grid">
          <SummaryCard
            title="Integrações"
            value={String(integrationIdeas.length)}
            hint="Frentes mapeadas"
            tone="accent"
          />
          <SummaryCard
            title="Objetivo"
            value="Automação"
            hint="Menos digitação e mais ação"
            tone="positive"
          />
          <SummaryCard
            title="Valor"
            value="Adoção"
            hint="Tecnologia mais próxima da rotina"
          />
        </section>

        <section className="split-grid">
          <SectionCard
            title="O que eu conectaria primeiro"
            description="As integrações abaixo trazem ganho de adoção, qualidade de dado e rotina de gestão."
          >
            <ul className="detail-list">
              {integrationIdeas.map((item) => (
                <li className="detail-item" key={item.title}>
                  <strong>{item.title}</strong>
                  <div className="metric-row">
                    <span>Status</span>
                    <span>{item.status}</span>
                  </div>
                  <p className="support-paragraph">{item.description}</p>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="Como isso melhora o produto"
            description="Aqui mora o ganho que torna o AgroCaixa mais difícil de substituir."
          >
            <ul className="soft-list soft-list--card">
              <li>WhatsApp aproxima o sistema do dia a dia de quem está no campo.</li>
              <li>CSV e Excel reduzem barreira de entrada para quem já vem de planilha.</li>
              <li>OCR reduz retrabalho e melhora a qualidade do lançamento inicial.</li>
              <li>Integração com preços e bancos aproxima financeiro de decisão comercial.</li>
            </ul>
          </SectionCard>
        </section>
      </div>
    </AppShell>
  );
}
