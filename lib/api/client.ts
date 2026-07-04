/**
 * API Client - Base HTTP wrapper with auth & error handling
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';

export interface ApiError {
  error: string;
  details?: Record<string, unknown>;
  retryAfter?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  status: number;
}

/**
 * Fetch wrapper with auth header and error handling
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<ApiResponse<T>> {
  const { token, headers, ...fetchOptions } = options;

  const fullUrl = `${API_BASE_URL}${path}`;
  const authHeaders = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  try {
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...headers,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        error: data?.error || `HTTP ${response.status}`,
        details: data?.details,
        retryAfter: data?.retryAfter,
        status: response.status,
      };
    }

    return {
      data: data as T,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}

/**
 * GET request
 */
export function apiGet<T = unknown>(
  path: string,
  token?: string
): Promise<ApiResponse<T>> {
  return apiFetch<T>(path, { method: 'GET', token });
}

/**
 * POST request
 */
export function apiPost<T = unknown>(
  path: string,
  data?: unknown,
  token?: string
): Promise<ApiResponse<T>> {
  return apiFetch<T>(path, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
    token,
  });
}

/**
 * PATCH request
 */
export function apiPatch<T = unknown>(
  path: string,
  data?: unknown,
  token?: string
): Promise<ApiResponse<T>> {
  return apiFetch<T>(path, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
    token,
  });
}

/**
 * DELETE request
 */
export function apiDelete(path: string, token?: string): Promise<ApiResponse<void>> {
  return apiFetch<void>(path, { method: 'DELETE', token });
}
