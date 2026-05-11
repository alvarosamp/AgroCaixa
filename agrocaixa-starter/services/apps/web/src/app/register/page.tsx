"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import BrandMark from "@/components/BrandMark";
import { ApiError, apiFetch } from "@/lib/api";
import { getToken, saveToken } from "@/lib/auth";
import { LoginResponse } from "@/types/reports";

type RegisterResponse = {
  id: number;
  name: string;
  email: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (password.length < 6) {
      setError("Use uma senha com pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("A confirmação da senha não confere.");
      return;
    }

    setLoading(true);

    try {
      await apiFetch<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const loginData = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      saveToken(loginData.access_token);
      router.replace("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível concluir o cadastro agora.");
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
          <div className="header-actions">
            <Link className="link-pill link-pill--light" href="/primeiro-acesso">
              Ver onboarding
            </Link>
            <Link className="link-pill link-pill--light" href="/login">
              Já tenho acesso
            </Link>
          </div>
        </div>

        <span className="kicker">Cadastro inicial</span>
        <h1 className="page-title page-title--hero">
          Comece sua operação digital com um acesso pensado para o primeiro uso.
        </h1>
        <p className="page-subtitle page-subtitle--hero">
          Depois do cadastro, a ideia é cadastrar fazenda, atividades e iniciar os
          lançamentos para o painel ganhar inteligência rapidamente.
        </p>

        <ul className="soft-list soft-list--light">
          <li>Crie o acesso do responsável financeiro ou gestor da fazenda.</li>
          <li>Entre no painel e siga a ordem fazenda, atividade e lançamento.</li>
          <li>Use inteligência e logística como camadas de crescimento do produto.</li>
        </ul>
      </section>

      <section className="surface-card auth-card auth-card--dense">
        <span className="kicker kicker--dark">Criar conta</span>
        <h2 className="section-title section-title--compact">
          Seu primeiro acesso começa aqui
        </h2>

        {error ? <div className="notice notice--error">{error}</div> : null}

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              className="input"
              placeholder="Nome do responsável"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              className="input"
              type="email"
              placeholder="voce@fazenda.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              className="input"
              type="password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">Confirmar senha</label>
            <input
              id="confirmPassword"
              className="input"
              type="password"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Criando acesso..." : "Criar conta e entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
