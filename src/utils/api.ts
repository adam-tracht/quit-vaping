const API_BASE = '/api/data';
const API_KEY = import.meta.env.VITE_API_KEY;

interface SyncData {
  data: unknown;
  updatedAt: string;
}

interface SyncResponse {
  success: boolean;
  data?: unknown;
  updatedAt?: string;
  error?: string;
}

// Fetch data from API
export async function fetchData(): Promise<SyncData> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (API_KEY) {
    headers['x-api-key'] = API_KEY;
  }

  const response = await fetch(`${API_BASE}/get`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch data');
  }

  return await response.json();
}

// Save data to API
export async function saveData(data: unknown): Promise<SyncResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (API_KEY) {
    headers['x-api-key'] = API_KEY;
  }

  const response = await fetch(`${API_BASE}/post`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save data');
  }

  return await response.json();
}
