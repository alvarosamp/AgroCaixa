"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SelectionCard";
import SummaryCard from "@/components/SummaryCard";
import { ApiError, apiFetch } from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";
import { onboardingChecklist, teamRoles } from "@/lib/showcase";
import { ActivityOption, FarmResponse } from "@/types/reports";

type TeamAssignment = {
  id: string;
  name: string;
  role: string;
};

const TEAM_STORAGE_KEY = "agrocaixa-team-assignments";

function readTeamAssignments() {
  if (typeof window === "undefined") {
    return [] as TeamAssignment[];
  }

  try {
    const raw = window.localStorage.getItem(TEAM_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as TeamAssignment[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function FarmsPage() {
  const router = useRouter();
  const [farms, setFarms] = useState<FarmResponse[]>([]);
  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [teamAssignments, setTeamAssignments] = useState<TeamAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [farmLoading, setFarmLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamRole, setTeamRole] = useState(teamRoles[0].role);
  const [farmForm, setFarmForm] = useState({
    name: "",
    city: "",
    state: "",
    production_type: "",
  });
  const [activityForm, setActivityForm] = useState({
    farm_id: "",
    name: "",
    type: "",
    status: "Ativa",
  });

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    setTeamAssignments(readTeamAssignments());

    let active = true;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const [farmData, activityData] = await Promise.all([
          apiFetch<FarmResponse[]>("/farms"),
          apiFetch<ActivityOption[]>("/activities"),
        ]);

        if (!active) {
          return;
        }

        setFarms(farmData);
        setActivities(activityData);
        if (farmData.length > 0) {
          setActivityForm((current) => ({
            ...current,
            farm_id: current.farm_id || String(farmData[0].id),
          }));
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

        setError("Não foi possível carregar fazendas e atividades agora.");
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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamAssignments));
  }, [teamAssignments]);

  async function handleCreateFarm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFarmLoading(true);

    try {
      const createdFarm = await apiFetch<FarmResponse>("/farms/", {
        method: "POST",
        body: JSON.stringify({
          ...farmForm,
          state: farmForm.state.trim().toUpperCase(),
        }),
      });

      setFarms((previous) => [createdFarm, ...previous]);
      setFarmForm({
        name: "",
        city: "",
        state: "",
        production_type: "",
      });
      setActivityForm((current) => ({
        ...current,
        farm_id: String(createdFarm.id),
      }));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        removeToken();
        router.replace("/login");
        return;
      }

      setError(err instanceof ApiError ? err.message : "Não foi possível cadastrar a fazenda.");
    } finally {
      setFarmLoading(false);
    }
  }

  async function handleCreateActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!activityForm.farm_id) {
      setError("Cadastre ou selecione uma fazenda antes de criar a atividade.");
      return;
    }

    setActivityLoading(true);

    try {
      const createdActivity = await apiFetch<ActivityOption>("/activities/", {
        method: "POST",
        body: JSON.stringify({
          farm_id: Number(activityForm.farm_id),
          name: activityForm.name,
          type: activityForm.type,
          status: activityForm.status,
        }),
      });

      setActivities((previous) => [createdActivity, ...previous]);
      setActivityForm((current) => ({
        ...current,
        name: "",
        type: "",
        status: "Ativa",
      }));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        removeToken();
        router.replace("/login");
        return;
      }

      setError(err instanceof ApiError ? err.message : "Não foi possível cadastrar a atividade.");
    } finally {
      setActivityLoading(false);
    }
  }

  function handleAddTeamAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!teamName.trim()) {
      return;
    }

    setTeamAssignments((previous) => [
      {
        id: `${Date.now()}`,
        name: teamName.trim(),
        role: teamRole,
      },
      ...previous,
    ]);
    setTeamName("");
  }

  const activityCountByFarm = useMemo(() => {
    return activities.reduce<Record<number, number>>((accumulator, activity) => {
      accumulator[activity.farm_id] = (accumulator[activity.farm_id] || 0) + 1;
      return accumulator;
    }, {});
  }, [activities]);

  const selectedFarmName =
    farms.find((farm) => String(farm.id) === activityForm.farm_id)?.name || "Sem fazenda";

  return (
    <AppShell
      eyebrow="Estrutura da operação"
      title="Cadastre fazendas, atividades e perfis para o sistema entender quem faz o quê."
      description="Agora esta área já usa a API para estruturar a operação real e deixa a equipe preparada para lançar melhor."
      actions={
        <>
          <Link className="button button--light" href="/transactions/new">
            Cadastrar lançamento inicial
          </Link>
          <Link className="button button--ghost-light" href="/dashboard">
            Ver painel
          </Link>
        </>
      }
      aside={
        <div className="hero-glance">
          <span className="hero-glance__label">Base da plataforma</span>
          <strong className="hero-glance__value">
            {loading ? "..." : `${farms.length} fazenda(s)`}
          </strong>
          <p className="hero-glance__copy">
            O produto fica mais útil quando cada fazenda, atividade e pessoa já entra com papel claro na operação.
          </p>

          <div className="hero-glance__rows">
            <div>
              <span>Atividades</span>
              <strong>{loading ? "--" : activities.length}</strong>
            </div>
            <div>
              <span>Equipe local</span>
              <strong>{teamAssignments.length}</strong>
            </div>
          </div>
        </div>
      }
    >
      {error ? <div className="notice notice--error">{error}</div> : null}

      {loading ? (
        <section className="surface-card section-loading">
          <h2 className="section-title section-title--compact">Carregando estrutura...</h2>
          <p className="page-subtitle">
            Estamos reunindo fazendas, atividades e contexto inicial da operação.
          </p>
        </section>
      ) : (
        <div className="section-stack">
          <section className="summary-grid">
            <SummaryCard
              title="Fazendas"
              value={String(farms.length)}
              hint="Unidades cadastradas"
              tone="positive"
            />
            <SummaryCard
              title="Atividades"
              value={String(activities.length)}
              hint="Frentes produtivas na API"
              tone="accent"
            />
            <SummaryCard
              title="Equipe"
              value={String(teamAssignments.length)}
              hint="Papéis organizados localmente"
            />
          </section>

          <section className="split-grid">
            <SectionCard
              title="Cadastrar fazenda"
              description="Esse formulário já grava na API e prepara o terreno para atividades e lançamentos."
            >
              <form className="form-grid form-grid--two" onSubmit={handleCreateFarm}>
                <div className="field">
                  <label htmlFor="farm-name">Nome</label>
                  <input
                    id="farm-name"
                    className="input"
                    value={farmForm.name}
                    onChange={(event) =>
                      setFarmForm((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="Fazenda Boa Esperança"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="farm-city">Cidade</label>
                  <input
                    id="farm-city"
                    className="input"
                    value={farmForm.city}
                    onChange={(event) =>
                      setFarmForm((current) => ({ ...current, city: event.target.value }))
                    }
                    placeholder="Rio Verde"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="farm-state">UF</label>
                  <input
                    id="farm-state"
                    className="input"
                    maxLength={2}
                    value={farmForm.state}
                    onChange={(event) =>
                      setFarmForm((current) => ({ ...current, state: event.target.value }))
                    }
                    placeholder="GO"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="farm-production">Produção principal</label>
                  <input
                    id="farm-production"
                    className="input"
                    value={farmForm.production_type}
                    onChange={(event) =>
                      setFarmForm((current) => ({
                        ...current,
                        production_type: event.target.value,
                      }))
                    }
                    placeholder="Soja, milho, leite..."
                    required
                  />
                </div>

                <div className="field field--full">
                  <button className="button" type="submit" disabled={farmLoading}>
                    {farmLoading ? "Salvando fazenda..." : "Cadastrar fazenda"}
                  </button>
                </div>
              </form>
            </SectionCard>

            <SectionCard
              title="Cadastrar atividade"
              description="Com a fazenda cadastrada, já dá para ligar os lançamentos à frente produtiva correta."
            >
              <form className="form-grid form-grid--two" onSubmit={handleCreateActivity}>
                <div className="field">
                  <label htmlFor="activity-farm">Fazenda</label>
                  <select
                    id="activity-farm"
                    className="select"
                    value={activityForm.farm_id}
                    onChange={(event) =>
                      setActivityForm((current) => ({ ...current, farm_id: event.target.value }))
                    }
                    required
                  >
                    <option value="">Selecione</option>
                    {farms.map((farm) => (
                      <option key={farm.id} value={farm.id}>
                        {farm.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="activity-name">Atividade</label>
                  <input
                    id="activity-name"
                    className="input"
                    value={activityForm.name}
                    onChange={(event) =>
                      setActivityForm((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="Milho safrinha"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="activity-type">Tipo</label>
                  <input
                    id="activity-type"
                    className="input"
                    value={activityForm.type}
                    onChange={(event) =>
                      setActivityForm((current) => ({ ...current, type: event.target.value }))
                    }
                    placeholder="Grãos, leite, hortifruti..."
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="activity-status">Status</label>
                  <input
                    id="activity-status"
                    className="input"
                    value={activityForm.status}
                    onChange={(event) =>
                      setActivityForm((current) => ({ ...current, status: event.target.value }))
                    }
                    placeholder="Ativa"
                    required
                  />
                </div>

                <div className="field field--full">
                  <p className="helper-text">
                    Atividade atual: <strong>{selectedFarmName}</strong>
                  </p>
                </div>

                <div className="field field--full">
                  <button className="button" type="submit" disabled={activityLoading}>
                    {activityLoading ? "Salvando atividade..." : "Cadastrar atividade"}
                  </button>
                </div>
              </form>
            </SectionCard>
          </section>

          <section className="split-grid">
            <SectionCard
              title="Fazendas reais da conta"
              description="Esses dados já vêm do backend e mostram a base atual da operação."
            >
              {farms.length === 0 ? (
                <div className="empty-state">
                  Nenhuma fazenda cadastrada ainda. O próximo passo ideal é começar por aqui.
                </div>
              ) : (
                <ul className="detail-list">
                  {farms.map((farm) => (
                    <li className="detail-item" key={farm.id}>
                      <strong>{farm.name}</strong>
                      <div className="metric-row">
                        <span>Cidade</span>
                        <span>
                          {farm.city}, {farm.state}
                        </span>
                      </div>
                      <div className="metric-row">
                        <span>Produção</span>
                        <span>{farm.production_type}</span>
                      </div>
                      <div className="metric-row">
                        <span>Atividades</span>
                        <span>{activityCountByFarm[farm.id] || 0}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            <SectionCard
              title="Equipe e papéis"
              description="Enquanto o backend ainda não tem permissões por papel, já deixei a organização da equipe no front."
            >
              <form className="form-grid form-grid--two" onSubmit={handleAddTeamAssignment}>
                <div className="field">
                  <label htmlFor="team-name">Pessoa</label>
                  <input
                    id="team-name"
                    className="input"
                    value={teamName}
                    onChange={(event) => setTeamName(event.target.value)}
                    placeholder="Nome do responsável"
                  />
                </div>

                <div className="field">
                  <label htmlFor="team-role">Papel</label>
                  <select
                    id="team-role"
                    className="select"
                    value={teamRole}
                    onChange={(event) => setTeamRole(event.target.value)}
                  >
                    {teamRoles.map((role) => (
                      <option key={role.role} value={role.role}>
                        {role.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field field--full">
                  <button className="button button--secondary" type="submit">
                    Adicionar pessoa
                  </button>
                </div>
              </form>

              <ul className="detail-list">
                {teamAssignments.map((person) => (
                  <li className="detail-item" key={person.id}>
                    <strong>{person.name}</strong>
                    <div className="metric-row">
                      <span>Papel</span>
                      <span>{person.role}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </section>

          <section className="split-grid">
            <SectionCard
              title="Primeiros passos da implantação"
              description="Uma jornada curta para sair do cadastro e chegar até um painel confiável."
            >
              <ul className="soft-list soft-list--card">
                {onboardingChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard
              title="Como eu continuaria essa área"
              description="Essa parte prepara terreno para implantação real e uso diário com equipe."
            >
              <ul className="soft-list soft-list--card">
                <li>Vincular permissões reais do backend a papéis como dono, gestor e financeiro.</li>
                <li>Adicionar edição e status da fazenda, incluindo safra atual e observações.</li>
                <li>Gerar modelos de atividades por tipo de operação para acelerar o primeiro uso.</li>
              </ul>

              <div className="inline-actions">
                <Link className="button button--secondary" href="/primeiro-acesso">
                  Rever primeiro acesso
                </Link>
                <Link className="button button--ghost" href="/financeiro">
                  Ir para financeiro
                </Link>
              </div>
            </SectionCard>
          </section>
        </div>
      )}
    </AppShell>
  );
}
