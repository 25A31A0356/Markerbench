import { useAuth } from "@clerk/clerk-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export function useApi() {
  const { getToken } = useAuth();

  async function request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await getToken();

    const response = await fetch(
      `${API_URL}${path}`,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`
              }
            : {}),
          ...(options.headers || {})
        }
      }
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({
          error: "REQUEST_FAILED"
        }));

      throw new Error(
        error.error || "Request failed"
      );
    }

    return response.json();
  }

  return {
    request
  };
}
