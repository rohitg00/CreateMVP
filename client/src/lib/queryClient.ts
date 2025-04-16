import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(method: string, path: string, body?: any) {
  const options: RequestInit = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': body instanceof FormData ? undefined : 'application/json',
    },
    body: body instanceof FormData ? body : JSON.stringify(body),
  };

  console.log(`Making ${method} request to ${path}`, { body });
  
  const response = await fetch(path, options);
  
  // Log response details for debugging
  console.log(`Response from ${path}:`, {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
  });

  // Try to get the response text first
  const text = await response.text();
  console.log('Response text:', text);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
  }

  try {
    return text ? JSON.parse(text) : null;
  } catch (e) {
    console.error('Failed to parse JSON response:', e);
    throw new Error(`Invalid JSON response: ${text}`);
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
