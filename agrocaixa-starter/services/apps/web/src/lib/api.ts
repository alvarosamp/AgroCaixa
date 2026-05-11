import { getToken } from "./auth";

const FALLBACK_API_BASE_URL = "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || FALLBACK_API_BASE_URL).replace(
    /\/$/,
    ""
  );
}

async function getErrorMessage(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = (await response.json().catch(() => null)) as
      | { detail?: string; message?: string }
      | null;

    if (typeof data?.detail === "string" && data.detail.trim()) {
      return data.detail;
    }

    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }
  }

  const text = await response.text().catch(() => "");
  return text || "Erro na requisição";
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new ApiError(response.status, await getErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}
