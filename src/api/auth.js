import api from "./config";

export async function updateProfile({ firstName, lastName, phone, address }) {
  const { data } = await api.put("/api/auth/me", { firstName, lastName, phone, address });
  return data.user;
}
