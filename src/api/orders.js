import api from "./config.js";

export function createOrder(payload) {
  return api.post("/api/orders", payload).then((r) => r.data);
}

export function getMyOrders() {
  return api.get("/api/orders").then((r) => r.data);
}
