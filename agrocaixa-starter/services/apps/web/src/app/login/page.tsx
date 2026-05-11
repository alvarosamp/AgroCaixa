"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import BrandMark from "@/components/BrandMark";
import { ApiError, apiFetch } from "@/lib/api";
import { getToken, saveToken } from "@/lib/auth";
import { LoginResponse } from "@/types/reports";

const benefitPoints = [
  "Painel com leitura de caixa por atividade rural.",
  "Categoria sugerida por IA para reduzir retrabalho no lançamento.",
  "Alertas financeiros para agir antes da margem apertar.",
];

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      saveToken(data.access_token);
      router.replace("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível entrar agora. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell auth-shell--elevated">
      <section className="auth-hero auth-hero--rich">
        <div className="auth-hero__topbar">
          <BrandMark href="/" tone="light" />
          <Link className="link-pill link-pill--light" href="/">
            Voltar ao site
          </Link>
        </div>

        <span className="kicker">Acesso do produto</span>
        <h1 className="page-title page-title--hero">
          Um financeiro rural com cara de ferramenta séria, não de improviso.
        </h1>
        <p className="page-subtitle page-subtitle--hero">
          Entre para acompanhar caixa, custos e alertas em uma experiência mais
          clara para quem precisa decidir rápido.
        </p>

        <div className="auth-metric-grid">
          <article className="auth-metric-card">
            <span>Visão do mês</span>
            <strong>Saldo, categorias e alertas</strong>
          </article>
          <article className="auth-metric-card">
            <span>Rotina simples</span>
            <strong>Lançar, entender e agir</strong>
          </article>
        </div>

        <ul className="soft-list soft-list--light">
          {benefitPoints.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="surface-card auth-card auth-card--dense">
        <span className="kicker kicker--dark">Entrar</span>
        <h2 className="section-title section-title--compact">
          Continue para o painel
        </h2>
        <p className="page-subtitle">
          Use seu e-mail de acesso para abrir o controle financeiro da operação.
        </p>

        {error ? <div className="notice notice--error">{error}</div> : null}

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              className="input"
              type="email"
              placeholder="voce@fazenda.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              className="input"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Abrir meu painel"}
          </button>
        </form>
      </section>
    </main>
  );
}
