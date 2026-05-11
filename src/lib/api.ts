// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://webapi.thenestory.in/api';
const PUBLIC_API = `${API_BASE_URL}/public`;

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const res = await fetch(endpoint, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ✅ Public APIs (for website - no auth required)
export const citiesApi = {
  getAll: (params?: { isActive?: string; search?: string }) => 
    fetchAPI(`${PUBLIC_API}/cities${params ? `?${new URLSearchParams(params as any)}` : ''}`),
  getOne: (id: string) => fetchAPI(`${PUBLIC_API}/cities/${id}`),
};

export const searchApi = {
  search: (q: string, city?: string, type?: string, category?: string) => 
    fetchAPI(`${PUBLIC_API}/search?q=${encodeURIComponent(q)}${city ? `&city=${city}` : ''}${type ? `&type=${type}` : ''}${category ? `&category=${category}` : ''}`),
};

// For future use
export const projectsApi = {
  getAll: (params?: any) => fetchAPI(`${PUBLIC_API}/projects${params ? `?${new URLSearchParams(params)}` : ''}`),
  getOne: (id: string) => fetchAPI(`${PUBLIC_API}/projects/${id}`),
  getFeatured: () => fetchAPI(`${PUBLIC_API}/featured-projects`),
};

export const propertiesApi = {
  getAll: (params?: any) => fetchAPI(`${PUBLIC_API}/properties${params ? `?${new URLSearchParams(params)}` : ''}`),
  getOne: (id: string) => fetchAPI(`${PUBLIC_API}/properties/${id}`),
  getFeatured: () => fetchAPI(`${PUBLIC_API}/featured-properties`),
};

export const buildersApi = {
  getAll: (params?: any) => fetchAPI(`${PUBLIC_API}/builders${params ? `?${new URLSearchParams(params)}` : ''}`),
  getOne: (id: string) => fetchAPI(`${PUBLIC_API}/builders/${id}`),
};

export const videosApi = {
  getAll: (params?: { page?: number; limit?: number; category?: string; featured?: boolean }) => 
    fetchAPI(`${PUBLIC_API}/videos${params ? `?${new URLSearchParams(params as any)}` : ''}`),
  getOne: (id: string) => fetchAPI(`${PUBLIC_API}/videos/${id}`),
  getFeatured: () => fetchAPI(`${PUBLIC_API}/videos/featured`),
  getCategories: () => fetchAPI(`${PUBLIC_API}/videos/categories`),
};

export const blogsApi = {
  getAll: (params?: { page?: number; limit?: number; category?: string; search?: string; featured?: boolean, isPublished?: boolean }) => 
    fetchAPI(`${PUBLIC_API}/blogs${params ? `?${new URLSearchParams(params as any)}` : ''}`),
  getOne: (slug: string) => fetchAPI(`${PUBLIC_API}/blogs/${slug}`),
  getFeatured: () => fetchAPI(`${PUBLIC_API}/blogs/featured`),
  getCategories: () => fetchAPI(`${PUBLIC_API}/blogs/categories`),
};