const API_BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || res.statusText);
  }

  return res.json();
}

export const api = {
  // Pipelines
  getPipelines: (projectId: string) =>
    request(`/pipelines?projectId=${projectId}`),
  getPipeline: (id: string) => request(`/pipelines/${id}`),
  createPipeline: (data: any) =>
    request("/pipelines", { method: "POST", body: JSON.stringify(data) }),
  updatePipeline: (id: string, data: any) =>
    request(`/pipelines/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  getPipelineYml: (id: string) =>
    fetch(`${API_BASE}/pipelines/${id}/yml`).then((r) => r.text()),

  // Features
  getFeatures: (projectId: string) =>
    request(`/features?projectId=${projectId}`),
  createFeature: (data: any) =>
    request("/features", { method: "POST", body: JSON.stringify(data) }),

  // Promotions
  getPromotions: (featureId: string) =>
    request(`/promotions?featureId=${featureId}`),
  promote: (featureId: string, targetEnvId: string) =>
    request("/promotions/promote", {
      method: "POST",
      body: JSON.stringify({ featureId, targetEnvId }),
    }),
};
