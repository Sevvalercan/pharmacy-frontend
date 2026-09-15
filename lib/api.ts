/**
 * Swagger / backend baglantisi icin tek giris noktasi.
 * Simdilik mock veri donuyor; endpoint yollari backend'inizle birebir eslesecek
 * sekilde asagida gruplandi. Govdeleri apiFetch cagrisiyla degistirmeniz yeterli.
 */
import * as db from "./data";
import type { Medicine, Order, OrderStatus, Pharmacy, Prescription, StockItem, User } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

let accessToken: string | null = null;
export const setToken = (t: string | null) => { accessToken = t; };

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`API ${res.status} — ${res.statusText}`);
  return (await res.json()) as T;
}

/* AUTH  — POST /auth/login, /auth/register, GET /auth/me */
export const authApi = {
  login: async (email: string, _password: string) => db.users.find((u) => u.email === email) ?? null,
  register: async (payload: { name: string; email: string; phone: string; password: string }) => payload,
  me: async (): Promise<User | null> => null,
};

/* USER — GET /pharmacies, /medicines, /orders, POST /orders */
export const userApi = {
  pharmacies: async (): Promise<Pharmacy[]> => db.pharmacies,
  dutyPharmacies: async (): Promise<Pharmacy[]> => db.pharmacies.filter((p) => p.duty),
  medicines: async (q = ""): Promise<Medicine[]> =>
    db.medicines.filter((m) =>
      !q ||
      [m.name, m.activeIngredient, m.category].some((f) => f.toLowerCase().includes(q.toLowerCase()))
    ),
  medicine: async (id: string) => db.byId(db.medicines, id) ?? null,
  stockForMedicine: async (id: string) => db.stockFor(id),
  orders: async (userId: string): Promise<Order[]> => db.orders.filter((o) => o.userId === userId),
  createOrder: async (payload: unknown) => payload,
  createStockAlert: async (medicineId: string) => ({ medicineId }),
};

/* VENDOR — GET /vendor/orders, PATCH /vendor/orders/{id}/status, CRUD /vendor/stock */
export const vendorApi = {
  orders: async (pharmacyId: string): Promise<Order[]> => db.orders.filter((o) => o.pharmacyId === pharmacyId),
  setOrderStatus: async (orderId: string, status: OrderStatus) => ({ orderId, status }),
  stock: async (pharmacyId: string) => db.stockOfPharmacy(pharmacyId),
  upsertStock: async (item: StockItem) => item,
  deleteStock: async (pharmacyId: string, medicineId: string) => ({ pharmacyId, medicineId }),
  updateProfile: async (id: string, patch: Partial<Pharmacy>) => ({ id, patch }),
};

/* ADMIN — GET /admin/* */
export const adminApi = {
  stats: async () => ({
    users: db.users.filter((u) => u.role === "user").length,
    pharmacies: db.pharmacies.length,
    activeOrders: db.orders.filter((o) => !["delivered", "rejected"].includes(o.status)).length,
    medicines: db.medicines.length,
  }),
  users: async (): Promise<User[]> => db.users,
  setUserStatus: async (id: string, status: User["status"]) => ({ id, status }),
  pharmacies: async (): Promise<Pharmacy[]> => db.pharmacies,
  approvePharmacy: async (id: string, approved: boolean) => ({ id, approved }),
  medicines: async (): Promise<Medicine[]> => db.medicines,
  orders: async (): Promise<Order[]> => db.orders,
  prescriptions: async (): Promise<Prescription[]> => db.prescriptions,
};
