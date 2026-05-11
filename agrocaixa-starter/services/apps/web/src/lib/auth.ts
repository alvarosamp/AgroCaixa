const TOKEN_KEY = "agrocaixa_token";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function saveToken(token: string) {
  if (!canUseStorage()) {
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  if (!canUseStorage()) {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  if (!canUseStorage()) {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
}
