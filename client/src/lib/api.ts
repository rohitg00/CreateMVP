export async function apiRequest(method: string, url: string, data?: any) {
  try {
    const response = await fetch(`${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include credentials (cookies) in the request
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}  