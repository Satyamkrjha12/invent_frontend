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

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
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

  if (response.status === 401 && !path.includes("/auth/refresh") && !path.includes("/auth/login")) {
    if (typeof window !== "undefined") {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refreshToken }),
            });

            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              localStorage.setItem("token", refreshData.token);
              if (refreshData.refreshToken) {
                localStorage.setItem("refreshToken", refreshData.refreshToken);
              }
              document.cookie = `auth-token=${refreshData.token}; path=/; max-age=86400; SameSite=Lax`;
              isRefreshing = false;
              onRefreshed(refreshData.token);
            } else {
              isRefreshing = false;
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              document.cookie = "auth-token=; path=/; max-age=0; SameSite=Lax";
              window.location.href = "/signin";
              throw new Error("Session expired.");
            }
          } catch (refreshErr) {
            isRefreshing = false;
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            document.cookie = "auth-token=; path=/; max-age=0; SameSite=Lax";
            window.location.href = "/signin";
            throw refreshErr;
          }
        }

        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            headers.set("Authorization", `Bearer ${newToken}`);
            resolve(
              fetch(url, { ...options, headers }).then((res) => {
                return res.text().then((text) => {
                  let data;
                  try {
                    data = text ? JSON.parse(text) : {};
                  } catch {
                    data = { error: text };
                  }
                  if (!res.ok) {
                    throw new Error(data.error || res.statusText || "Something went wrong");
                  }
                  return data;
                });
              })
            );
          });
        });
      }
    }
  }

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: text };
  }

  if (!response.ok) {
    const errorMsg = data.error || response.statusText || "Something went wrong";
    if (response.status === 402 || data.code === "PAYMENT_REQUIRED") {
      if (typeof window !== "undefined") {
        window.location.href = "/onboarding";
      }
    }
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
