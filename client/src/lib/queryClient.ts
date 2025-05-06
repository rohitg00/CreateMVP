import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

interface ApiRequestOptions {
  headers?: Record<string, string>;
  cache?: RequestCache;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
}

export async function apiRequest(
  method: string, 
  path: string, 
  body?: any, 
  options?: ApiRequestOptions
) {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options?.headers || {})
  };
  
  // Only add Content-Type for non-FormData bodies
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Add cookie to headers if available
  if (document.cookie) {
    headers['Cookie'] = document.cookie;
  }

  const requestOptions: RequestInit = {
    method,
    headers,
    body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    cache: options?.cache,
    signal: options?.signal,
    credentials: options?.credentials || 'include', // Critical for cross-domain cookies
  };

  console.log(`Making ${method} request to ${path}`, { body });
  
  const response = await fetch(path, requestOptions);
  
  // Log response details for debugging
  console.log(`Response from ${path}:`, {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
  });

  // Return the raw response without parsing
  // This allows the calling code to decide how to handle it
  // (.json(), .text(), etc.)
  if (!response.ok) {
    const text = await response.text();
    console.error(`API error: ${response.status} - ${text}`);
    throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
  }
  
  // Return the response object so the caller can use response.json()
  return response;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    console.log(`Making GET request to ${queryKey[0]}`, { queryKey });
    
    const res = await fetch(queryKey[0] as string, {
      credentials: "include", // This is critical for cookies to be sent cross-domain
      headers: {
        'Accept': 'application/json',
        'Cookie': document.cookie, // Explicitly include cookies in the header
      },
    });
    
    console.log(`Response from ${queryKey[0]}:`, {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
    });
    
    // Handle 401 Unauthorized based on settings
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      console.log('Received 401, returning null as configured');
      return null;
    }
    
    // For everything else, check response
    try {
      // Get text first for logging
      const text = await res.text();
      console.log('Response text:', text);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
      }
      
      // Parse JSON if we have content
      return text ? JSON.parse(text) : null;
    } catch (e) {
      console.error(`Error processing response from ${queryKey[0]}:`, e);
      throw e;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }), // Return null for 401 (unauthorized) responses
      refetchInterval: false,
      refetchOnWindowFocus: true, // Enable refetch on window focus to catch auth changes
      staleTime: 300000, // Consider data stale after 5 minutes
      retry: 1, // One retry for failed requests
      retryDelay: 1000, // 1 second delay between retries
    },
    mutations: {
      retry: 1, // One retry for mutations too
    },
  },
});
