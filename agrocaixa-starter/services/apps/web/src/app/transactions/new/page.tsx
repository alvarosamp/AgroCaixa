"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import AppShell from "@/components/AppShell";
import SectionCard from "@/components/SelectionCard";
import { ApiError, apiFetch } from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";
import { formatCurrency, getTodayInputValue } from "@/lib/format";
import { ActivityOption } from "@/types/reports";

export default function NewTransactionPage() {
  const router = useRouter();

  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [activityId, setActivityId] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(getTodayInputValue());
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [suggestedCategory, setSuggestedCategory] = useState("");
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    let active = true;

    async function loadActivities() {
      setLoadingActivities(true);
      setError("");

      try {
        const data = await apiFetch<ActivityOption[]>("/activities");

        if (!active) {
          return;
        }

        setActivities(data);
        if (data.length > 0) {
          setActivityId(String(data[0].id));
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

        setError("Não foi possível carregar as atividades.");
      } finally {
        if (active) {
          setLoadingActivities(false);
        }
      }
    }

    loadActivities();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSuggestCategory() {
    if (type !== "expense" || !description.trim()) {
      return;
    }

    setError("");
    setIsSuggesting(true);

    try {
      const response = await apiFetch<{ category: string }>("/ai/classify", {
        method: "POST",
        body: JSON.stringify({ description: description.trim() }),
      });

      setSuggestedCategory(response.category);
      setCategory(response.category);
    } catch {
      setError("Não foi possível sugerir uma categoria agora.");
    } finally {
      setIsSuggesting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!activityId) {
      setError("Selecione uma atividade para continuar.");
      return;
    }

    const parsedAmount = Number.parseFloat(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Informe um valor válido maior que zero.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiFetch("/transactions/", {
        method: "POST",
        body: JSON.stringify({
          activity_id: Number(activityId),
          type,
          amount: parsedAmount,
          date,
          description: description.trim() || null,
          category: category.trim() || null,
        }),
      });

      router.replace("/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        removeToken();
        router.replace("/login");
        return;
      }

      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível salvar a transação."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const noActivities = !loadingActivities && activities.length === 0;
  const selectedActivity =
    activities.find((activity) => String(activity.id) === activityId) ?? null;
  const parsedAmount = Number.parseFloat(amount);
  const amountLabel = Number.isFinite(parsedAmount)
    ? formatCurrency(parsedAmount)
    : "R$ 0,00";
  const aiGuidance = useMemo(() => {
    if (type === "income") {
      return "Receitas podem ser lançadas direto. A IA entra forte mesmo nas despesas.";
    }

    if (!description.trim()) {
      return "Descreva a compra ou pagamento para liberar a sugestão inteligente de categoria.";
    }

    if (suggestedCategory) {
      return `A IA sugeriu ${suggestedCategory}. Você ainda pode ajustar antes de salvar.`;
    }

    return "Com a descrição preenchida, você pode pedir uma categoria automática antes de salvar.";
  }, [description, suggestedCategory, type]);

  return (
    <AppShell
      eyebrow="Lançamento inteligente"
      title="Registre a movimentação do campo com contexto, categoria e visão de caixa."
      description="Uma tela pensada para lançamento rápido, sem perder a qualidade do dado financeiro."
      actions={
        <>
          <Link className="button button--light" href="/dashboard">
            Voltar ao painel
          </Link>
          <Link className="button button--ghost-light" href="/alerts">
            Ver alertas
          </Link>
        </>
      }
      aside={
        <div className="hero-glance">
          <span className="hero-glance__label">Prévia do lançamento</span>
          <strong className="hero-glance__value">{amountLabel}</strong>
          <p className="hero-glance__copy">
            {selectedActivity
              ? `${selectedActivity.name} • ${type === "expense" ? "Despesa" : "Receita"}`
              : "Escolha a atividade e monte o lançamento."}
          </p>

          <div className="hero-glance__rows">
            <div>
              <span>Data</span>
              <strong>{date || "--"}</strong>
            </div>
            <div>
              <span>Categoria</span>
              <strong>{category || suggestedCategory || "A definir"}</strong>
            </div>
          </div>
        </div>
      }
    >
      {error ? <div className="notice notice--error">{error}</div> : null}

      {loadingActivities ? (
        <section className="surface-card section-loading">
          <h2 className="section-title section-title--compact">
            Carregando atividades...
          </h2>
          <p className="page-subtitle">
            Estamos preparando o contexto necessário para o lançamento.
          </p>
        </section>
      ) : noActivities ? (
        <section className="surface-card section-loading">
          <h2 className="section-title section-title--compact">
            Nenhuma atividade disponível
          </h2>
          <p className="page-subtitle">
            Cadastre ao menos uma atividade para conectar este lançamento ao que
            realmente acontece na fazenda.
          </p>
        </section>
      ) : (
        <div className="form-shell-grid">
          <section className="surface-card auth-card form-panel">
            <span className="kicker kicker--dark">Dados do lançamento</span>
            <h2 className="section-title section-title--compact">
              Informações que constroem um caixa confiável
            </h2>

            <form className="form-grid form-grid--two" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="activity">Atividade</label>
                <select
                  id="activity"
                  className="select"
                  value={activityId}
                  onChange={(event) => setActivityId(event.target.value)}
                  required
                >
                  {activities.map((activity) => (
                    <option key={activity.id} value={activity.id}>
                      {activity.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="type">Tipo</label>
                <select
                  id="type"
                  className="select"
                  value={type}
                  onChange={(event) => setType(event.target.value as "income" | "expense")}
                >
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="amount">Valor</label>
                <input
                  id="amount"
                  className="input"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0,00"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="date">Data</label>
                <input
                  id="date"
                  className="input"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                />
              </div>

              <div className="field field--full">
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  className="textarea"
                  placeholder="Ex.: compra de diesel para trator e transporte"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
                <p className="helper-text">
                  Quanto melhor a descrição, melhor a classificação sugerida pela IA.
                </p>
              </div>

              <div className="field field--full">
                <div className="form-actions">
                  <button
                    className="button button--secondary"
                    type="button"
                    onClick={handleSuggestCategory}
                    disabled={type !== "expense" || !description.trim() || isSuggesting}
                  >
                    {isSuggesting ? "Analisando..." : "Sugerir categoria com IA"}
                  </button>
                </div>
              </div>

              {suggestedCategory ? (
                <div className="field field--full">
                  <div className="notice notice--info">
                    Categoria sugerida: <strong>{suggestedCategory}</strong>
                  </div>
                </div>
              ) : null}

              <div className="field field--full">
                <label htmlFor="category">Categoria</label>
                <input
                  id="category"
                  className="input"
                  placeholder="Ex.: combustivel"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                />
              </div>

              <div className="field field--full">
                <div className="form-actions">
                  <button className="button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar lançamento"}
                  </button>
                </div>
              </div>
            </form>
          </section>

          <div className="section-stack">
            <SectionCard
              title="Leitura da IA"
              description="Use a automação para reduzir digitação e manter padrão nos dados."
            >
              <p className="support-paragraph">{aiGuidance}</p>
              <div className="support-pill-row">
                <span className="support-pill">
                  {type === "expense" ? "Modo despesa" : "Modo receita"}
                </span>
                <span className="support-pill">
                  {selectedActivity ? selectedActivity.name : "Sem atividade"}
                </span>
              </div>
            </SectionCard>

            <SectionCard
              title="Como eu melhoraria essa tela no uso real"
              description="O objetivo é que o produtor lance rápido sem sacrificar a leitura futura do caixa."
            >
              <ul className="soft-list soft-list--card">
                <li>Descreva fornecedor ou finalidade para a IA aprender melhor o padrão.</li>
                <li>Use categoria mesmo em receita para manter relatórios mais ricos.</li>
                <li>Associe tudo a uma atividade para saber o resultado real por frente.</li>
              </ul>
            </SectionCard>
          </div>
        </div>
      )}
    </AppShell>
  );
}
