"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";

type Alert = {
  id: number;
  message: string;
  date: string;
  type: string;
  read: boolean;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    loadAlerts();
  }, []);

  async function loadAlerts() {
    try {
      const data = await apiFetch<Alert[]>("/alerts");
      setAlerts(data);
    } catch {
      console.error("Erro ao carregar alertas");
    }
  }

  async function markAsRead(id: number) {
    try {
      await apiFetch(`/alerts/${id}/read`, {
        method: "PATCH",
      });

      setAlerts((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, read: true } : a
        )
      );
    } catch {
      console.error("Erro ao marcar como lido");
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Alertas</h1>

      {alerts.length === 0 ? (
        <p>Sem alertas</p>
      ) : (
        <ul>
          {alerts.map((alert) => (
            <li
              key={alert.id}
              style={{
                marginBottom: 12,
                padding: 12,
                border: "1px solid #ccc",
                background: alert.read ? "#f5f5f5" : "#fff",
              }}
            >
              <p>{alert.message}</p>
              <small>{new Date(alert.date).toLocaleString()}</small>

              {!alert.read && (
                <button
                  onClick={() => markAsRead(alert.id)}
                  style={{ marginTop: 8 }}
                >
                  Marcar como lido
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}