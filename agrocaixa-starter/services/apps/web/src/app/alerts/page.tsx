"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

type Alert = {
  id: number;
  message: string;
  date: string;
  type: string;
  read: boolean;
};

export default function AlertsPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  async function loadAlerts() {
    const data = await apiFetch<Alert[]>("/alerts");
    setAlerts(data);
  }

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    loadAlerts();
  }, [router]);

  async function markAsRead(alertId: number) {
    await apiFetch(`/alerts/${alertId}/read`, {
      method: "PATCH",
    });

    await loadAlerts();
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Alertas Financeiros</h1>

      <button onClick={() => router.push("/dashboard")}>
        Voltar ao dashboard
      </button>

      {alerts.length === 0 ? (
        <p>Sem alertas no momento.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {alerts.map((alert) => (
            <li
              key={alert.id}
              style={{
                border: "1px solid #ddd",
                padding: 16,
                borderRadius: 12,
                marginTop: 12,
                background: alert.read ? "#f5f5f5" : "#fff",
              }}
            >
              <strong>{alert.type}</strong>
              <p>{alert.message}</p>
              <small>{new Date(alert.date).toLocaleString("pt-BR")}</small>

              {!alert.read && (
                <div style={{ marginTop: 12 }}>
                  <button onClick={() => markAsRead(alert.id)}>
                    Marcar como lido
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
