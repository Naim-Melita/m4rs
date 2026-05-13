import api from "./config";

export async function register({ firstName, lastName, email, password }) {
  const { data } = await api.post("/api/auth/register", { firstName, lastName, email, password });
  return data.user;
}

export async function login({ email, password }) {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data.user;
}

export async function logout() {
  await api.post("/api/auth/logout");
}

export async function getMe() {
  const { data } = await api.get("/api/auth/me");
  return data.user;
}

export async function updateProfile({ firstName, lastName, phone, address }) {
  const { data } = await api.put("/api/auth/me", { firstName, lastName, phone, address });
  return data.user;
}
