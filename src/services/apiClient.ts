// src/services/apiClient.ts

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error("❌ LỖI: VITE_API_URL chưa được cấu hình trong file .env");
}

interface RequestOptions extends RequestInit {
  data?: any;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, ...customConfig } = options;

  // Nếu BASE_URL null → cảnh báo
  if (!BASE_URL) {
    throw new Error("VITE_API_URL is not defined — kiểm tra file .env");
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  const response = await fetch(`${BASE_URL}/${cleanEndpoint}`, config);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `API Error: ${response.statusText}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const apiClient = {
  get: <T>(url: string) => request<T>(url, { method: 'GET' }),
  post: <T>(url: string, data: any) => request<T>(url, { method: 'POST', data }),
  patch: <T>(url: string, data: any) => request<T>(url, { method: 'PATCH', data }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
};
