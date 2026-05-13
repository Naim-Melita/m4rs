import api from "./config";

export async function createPreference({ items, payer }) {
  const { data } = await api.post("/api/payments/preference", { items, payer });
  return data.preferenceId;
}

export async function processPayment(formData) {
  const { data } = await api.post("/api/payments/process", formData);
  return data;
}
