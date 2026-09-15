export type Role = "user" | "vendor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: "active" | "suspended";
  pharmacyId?: string; // vendor ise bagli eczane
  createdAt: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  distanceKm: number;
  open: boolean;
  duty: boolean;
  district: string;
  address: string;
  phone: string;
  hours: string;
  prepMinutes: number;
  rating: number;
  approved: boolean;
  services: string[];
}

export interface Medicine {
  id: string;
  name: string;
  activeIngredient: string;
  form: string;
  dose: string;
  manufacturer: string;
  category: string;
  prescriptionOnly: boolean;
  reportRequired: boolean; // raporlu ilac
}

export interface StockItem {
  pharmacyId: string;
  medicineId: string;
  quantity: number;
  inStock: boolean;
  price: number;
}

export type OrderStatus =
  | "created"
  | "approved"
  | "preparing"
  | "ready"
  | "delivering"
  | "delivered"
  | "rejected";

export interface OrderLine {
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  pharmacyId: string;
  pharmacyName: string;
  lines: OrderLine[];
  total: number;
  addressLabel: string;
  addressDetail: string;
  createdAt: string;
  status: OrderStatus;
  prescriptionId?: string;
  reportRequest?: boolean; // raporlu ilac talebi
  note?: string;
}

export interface Prescription {
  id: string;
  userId: string;
  userName: string;
  code: string;
  source: "e-recete" | "foto" | "dosya";
  uploadedAt: string;
  status: "pending" | "verified" | "rejected";
  medicineIds: string[];
  reportNo?: string;
}

export interface Address {
  id: string;
  label: string;
  icon: string;
  detail: string;
  note?: string;
  isDefault: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: "order" | "stock" | "system" | "prescription";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface StockAlert {
  id: string;
  userId: string;
  medicineId: string;
  createdAt: string;
}

export const ORDER_FLOW: OrderStatus[] = [
  "created",
  "approved",
  "preparing",
  "ready",
  "delivering",
  "delivered",
];

export const ORDER_LABELS: Record<OrderStatus, string> = {
  created: "Sipariş Alındı",
  approved: "Eczane Onayladı",
  preparing: "Hazırlanıyor",
  ready: "Hazır",
  delivering: "Kuryede",
  delivered: "Teslim Edildi",
  rejected: "Reddedildi",
};
