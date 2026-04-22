"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";

type Alerta = {
  id: number;
  message: string;
  date: string;
  type: string;
};

export default function PaginaAlertas() {
  const router = useRouter();

  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    async function carregarAlertas() {
      try {
        const data = await apiFetch<Alerta[]>("/alerts/");
        setAlertas(data);
      } catch (err) {
        console.error("Erro ao carregar alertas:", err);
        setError("Não foi possível carregar alertas.");
      } finally {
        setLoading(false);
      }
    }

    carregarAlertas();
  }, [router]);

  if (loading) {
    return <main style={{ padding: 24 }}>Carregando alertas...</main>;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Alertas</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && alertas.length === 0 && <p>Nenhum alerta no momento.</p>}

      <ul>
        {alertas.map((alerta) => (
          <li key={alerta.id}>
            <strong>{alerta.type}</strong> - {alerta.message} ({alerta.date})
          </li>
        ))}
      </ul>
    </main>
  );
}
