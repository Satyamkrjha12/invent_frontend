const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token") || getCookie("auth-token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: text };
  }

  if (!response.ok) {
    const errorMsg = data.error || response.statusText || "Something went wrong";
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  get: (path: string, options?: RequestInit) =>
    apiFetch(path, { method: "GET", ...options }),
    
  post: (path: string, body?: any, options?: RequestInit) =>
    apiFetch(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),
    
  put: (path: string, body?: any, options?: RequestInit) =>
    apiFetch(path, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),
    
  delete: (path: string, options?: RequestInit) =>
    apiFetch(path, { method: "DELETE", ...options }),
};
