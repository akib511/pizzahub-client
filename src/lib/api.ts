"use client";

import { authClient } from "@/lib/auth-client";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Deduplicate token requests when a page fires several API calls at once.
let tokenRequest: Promise<string | null> | null = null;

function getBearerToken(): Promise<string | null> {
  if (!tokenRequest) {
    tokenRequest = authClient
      .token()
      .then(({ data, error }) =>
        error || !data?.token ? null : data.token
      )
      .catch(() => null)
      .finally(() => {
        tokenRequest = null;
      });
  }

  return tokenRequest;
}

/**
 * fetch() wrapper for the PizzaHub Express API.
 * The server authorizes every request with a Better Auth JWT, so attach it
 * automatically. Public calls still work when there is no active session.
 */
export async function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  const isApiRequest =
    url.startsWith(API_URL) ||
    url.startsWith("http://localhost:5000") ||
    url.startsWith("/");

  const headers = new Headers(init?.headers);

  if (isApiRequest) {
    const token = await getBearerToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // Authenticated responses are user- and role-specific, so bypass the browser
  // HTTP cache instead of risking stale dashboards or stale user lists.
  return fetch(input, { ...init, cache: "no-store", headers });
}
