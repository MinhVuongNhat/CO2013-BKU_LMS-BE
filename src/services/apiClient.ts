// src/services/apiClient.ts

const BASE_URL = import.meta.env.VITE_API_URL;

interface RequestOptions extends RequestInit {
  data?: any;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, ...customConfig } = options;

  const config: RequestInit = {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      // Nếu sau này có token auth thì thêm vào đây:
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`, 
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  // Loại bỏ dấu / ở đầu endpoint nếu có để tránh lỗi double slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  const response = await fetch(`${BASE_URL}/${cleanEndpoint}`, config);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `API Error: ${response.statusText}`);
  }

  // Xử lý trường hợp response không có body (ví dụ DELETE thành công trả về 204)
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