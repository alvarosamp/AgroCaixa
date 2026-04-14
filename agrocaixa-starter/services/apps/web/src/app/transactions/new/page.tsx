"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";

type Activity = {
  id: number;
  name: string;
};

export default function NewTransactionPage() {
  const router = useRouter();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityId, setActivityId] = useState<number | null>(null);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [suggestedCategory, setSuggestedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    async function loadActivities() {
      try {
        const data = await apiFetch<Activity[]>("/activities");
        setActivities(data);

        if (data.length > 0) {
          setActivityId(data[0].id);
        }
      } catch {
        router.push("/login");
      }
    }

    loadActivities();
  }, [router]);

  async function handleSuggestCategory() {
    if (!description.trim()) return;

    setLoading(true);

    try {
      const response = await apiFetch<{ category: string }>("/ai/classify", {
        method: "POST",
        body: JSON.stringify({ description }),
      });

      setSuggestedCategory(response.category);
      setCategory(response.category);
    } catch (error) {
      console.error("Erro ao sugerir categoria", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!activityId || !amount || !date) return;

    try {
      await apiFetch("/transactions/", {
        method: "POST",
        body: JSON.stringify({
          activity_id: activityId,
          type,
          amount: Number(amount),
          date,
          description,
          category,
        }),
      });

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar transação");
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", padding: 24 }}>
      <h1>Nova Transação</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <select
          value={activityId || ""}
          onChange={(e) => setActivityId(Number(e.target.value))}
        >
          {activities.map((activity) => (
            <option key={activity.id} value={activity.id}>
              {activity.name}
            </option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
        >
          <option value="expense">Despesa</option>
          <option value="income">Receita</option>
        </select>

        <input
          type="number"
          placeholder="Valor"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={handleSuggestCategory}>
          {loading ? "Sugerindo..." : "Sugerir categoria com IA"}
        </button>

        {suggestedCategory && (
          <p>
            Categoria sugerida: <strong>{suggestedCategory}</strong>
          </p>
        )}

        <input
          placeholder="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button onClick={handleSubmit}>Salvar</button>
      </div>
    </main>
  );
}
