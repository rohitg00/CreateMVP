// apiClient.ts - Provides a simple interface for making API requests 
// with cookie-based authentication instead of token-based auth

// Define common options for fetch requests
interface FetchOptions extends RequestInit {
  // Add any custom options if needed in the future
}

/**
 * A wrapper around fetch for requests to our backend API
 * using cookie-based authentication
 * 
 * @param url - The API endpoint URL (relative path)
 * @param options - Standard fetch options (method, body, etc.)
 * @returns The fetch Response object
 */
export async function authenticatedFetch(url: string, options: FetchOptions = {}): Promise<Response> {
  // Ensure the URL starts with /api/ to target our backend
  if (!url.startsWith('/api/')) {
    console.warn(`authenticatedFetch called with non-API URL: ${url}. Sending request without specific options.`);
    return fetch(url, options);
  }

  // Prepare headers
  const headers = new Headers(options.headers || {});
  
  // Ensure Content-Type is set for POST/PUT requests with a body
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Merge options
  const fetchOptions: RequestInit = {
    ...options,
    headers: headers,
    credentials: 'include', // Important for cookie-based auth
  };

  // Make the fetch request
  const response = await fetch(url, fetchOptions);

  // Handle unauthorized errors
  if (response.status === 401) {
    console.warn('Unauthorized request. User may need to log in.');
    // Optional: redirect to login page if needed
    // window.location.href = '/login';
  }

  return response;
}

/**
 * Make an API request with the given method
 * @param method HTTP method (GET, POST, PUT, DELETE)
 * @param endpoint API endpoint (should start with /api/)
 * @param data Optional data to send (for POST/PUT)
 * @returns Response object
 */
export async function apiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any
): Promise<Response> {
  const options: FetchOptions = {
    method,
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  return authenticatedFetch(endpoint, options);
}

// Example usage:
/*
async function generatePlan() {
  try {
    const response = await apiRequest('POST', '/api/generate-plan', { requirements: 'Build a todo app' }); 
    if (!response.ok) {
      // ... handle specific errors ...
    }
    const data = await response.json();
    // ... process data ...
  } catch (error) {
    // Handle network errors
    console.error("API request failed:", error);
  }
}
*/   