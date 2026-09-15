"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as db from "./data";
import {
  Address, AppNotification, Order, OrderStatus, Pharmacy, Prescription, Role,
  StockAlert, StockItem, User,
} from "./types";

const SESSION_KEY = "eczajet.session";

interface Store {
  /* oturum */
  currentUser: User | null;
  ready: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string; user?: User };
  register: (data: { name: string; email: string; phone: string; password: string }) => { ok: boolean; error?: string };
  logout: () => void;

  /* veri */
  users: User[];
  pharmacies: Pharmacy[];
  stock: StockItem[];
  orders: Order[];
  prescriptions: Prescription[];
  addresses: Address[];
  notifications: AppNotification[];
  favorites: string[];
  stockAlerts: StockAlert[];

  /* kullanici islemleri */
  toggleFavorite: (pharmacyId: string) => void;
  isFavorite: (pharmacyId: string) => boolean;
  addStockAlert: (medicineId: string) => void;
  hasStockAlert: (medicineId: string) => boolean;
  createOrder: (input: {
    pharmacyId: string;
    lines: { medicineId: string; name: string; quantity: number; price: number }[];
    addressId: string;
    prescriptionCode?: string;
    reportRequest?: boolean;
    note?: string;
  }) => Order;
  addAddress: (a: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  markNotificationsRead: () => void;

  /* vendor islemleri */
  setOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateStock: (pharmacyId: string, medicineId: string, patch: Partial<StockItem>) => void;
  addStock: (item: StockItem) => void;
  removeStock: (pharmacyId: string, medicineId: string) => void;
  updatePharmacy: (id: string, patch: Partial<Pharmacy>) => void;

  /* admin islemleri */
  setUserStatus: (userId: string, status: User["status"]) => void;
  setPharmacyApproved: (id: string, approved: boolean) => void;
  pushNotification: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
}

const Ctx = createContext<Store | null>(null);

const nowStr = () => new Date().toISOString().slice(0, 16).replace("T", " ");
const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 7)}`;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>(db.users);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(db.pharmacies);
  const [stock, setStock] = useState<StockItem[]>(db.stock);
  const [orders, setOrders] = useState<Order[]>(db.orders);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(db.prescriptions);
  const [addresses, setAddresses] = useState<Address[]>(db.addresses);
  const [notifications, setNotifications] = useState<AppNotification[]>(db.notifications);
  const [favorites, setFavorites] = useState<string[]>(db.favoritePharmacyIds);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);

  // oturumu geri yukle
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) {
        const email = JSON.parse(raw) as string;
        const found = db.users.find((u) => u.email === email);
        if (found) setCurrentUser(found);
      }
    } catch {
      /* sessizce yoksay */
    }
    setReady(true);
  }, []);

  function persist(user: User | null) {
    try {
      if (user) window.localStorage.setItem(SESSION_KEY, JSON.stringify(user.email));
      else window.localStorage.removeItem(SESSION_KEY);
    } catch {
      /* yoksay */
    }
  }

  const value: Store = useMemo(() => ({
    currentUser,
    ready,
    users, pharmacies, stock, orders, prescriptions, addresses, notifications, favorites, stockAlerts,

    login(email, password) {
      const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!user) return { ok: false, error: "Bu e-posta ile kayıtlı hesap bulunamadı." };
      if (password.length < 4) return { ok: false, error: "Şifre en az 4 karakter olmalı." };
      if (user.status === "suspended") return { ok: false, error: "Hesabınız askıya alınmış. Destek ile iletişime geçin." };
      setCurrentUser(user);
      persist(user);
      return { ok: true, user };
    },

    register({ name, email, phone, password }) {
      if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase()))
        return { ok: false, error: "Bu e-posta zaten kayıtlı." };
      if (password.length < 6) return { ok: false, error: "Şifre en az 6 karakter olmalı." };
      const user: User = {
        id: uid("u"), name, email, phone, role: "user", status: "active",
        createdAt: nowStr().slice(0, 10),
      };
      setUsers((p) => [...p, user]);
      setCurrentUser(user);
      persist(user);
      return { ok: true };
    },

    logout() {
      setCurrentUser(null);
      persist(null);
    },

    toggleFavorite(pharmacyId) {
      setFavorites((p) => (p.includes(pharmacyId) ? p.filter((x) => x !== pharmacyId) : [...p, pharmacyId]));
    },
    isFavorite: (pharmacyId) => favorites.includes(pharmacyId),

    addStockAlert(medicineId) {
      if (!currentUser) return;
      setStockAlerts((p) =>
        p.some((a) => a.medicineId === medicineId && a.userId === currentUser.id)
          ? p
          : [...p, { id: uid("sa"), userId: currentUser.id, medicineId, createdAt: nowStr() }]
      );
    },
    hasStockAlert: (medicineId) =>
      stockAlerts.some((a) => a.medicineId === medicineId && a.userId === currentUser?.id),

    createOrder(input) {
      const pharmacy = pharmacies.find((p) => p.id === input.pharmacyId)!;
      const address = addresses.find((a) => a.id === input.addressId) ?? addresses[0];
      const subtotal = input.lines.reduce((s, l) => s + l.price * l.quantity, 0);
      const order: Order = {
        id: `EJ-${Math.floor(9500 + Math.random() * 400)}`,
        userId: currentUser?.id ?? "u1",
        userName: currentUser?.name ?? "Misafir",
        pharmacyId: pharmacy.id,
        pharmacyName: pharmacy.name,
        lines: input.lines,
        total: Math.round((subtotal + 29.9) * 100) / 100,
        addressLabel: address?.label ?? "Adres",
        addressDetail: address?.detail ?? "",
        createdAt: nowStr(),
        status: "created",
        reportRequest: input.reportRequest,
        note: input.note,
      };
      setOrders((p) => [order, ...p]);
      if (input.prescriptionCode) {
        setPrescriptions((p) => [
          {
            id: uid("RX"), userId: order.userId, userName: order.userName,
            code: input.prescriptionCode!, source: "e-recete", uploadedAt: nowStr(),
            status: "pending", medicineIds: input.lines.map((l) => l.medicineId),
          },
          ...p,
        ]);
      }
      setNotifications((p) => [
        { id: uid("n"), userId: order.userId, type: "order", title: "Siparişiniz alındı", body: `#${order.id} numaralı siparişiniz ${pharmacy.name}'ne iletildi.`, createdAt: nowStr(), read: false },
        ...p,
      ]);
      return order;
    },

    addAddress(a) {
      const item: Address = { ...a, id: uid("ad") };
      setAddresses((p) => (item.isDefault ? [...p.map((x) => ({ ...x, isDefault: false })), item] : [...p, item]));
    },
    removeAddress(id) { setAddresses((p) => p.filter((a) => a.id !== id)); },
    setDefaultAddress(id) { setAddresses((p) => p.map((a) => ({ ...a, isDefault: a.id === id }))); },
    markNotificationsRead() {
      setNotifications((p) => p.map((n) => (n.userId === currentUser?.id ? { ...n, read: true } : n)));
    },

    setOrderStatus(orderId, status) {
      setOrders((p) => p.map((o) => (o.id === orderId ? { ...o, status } : o)));
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        const labelMap: Partial<Record<OrderStatus, string>> = {
          approved: "Siparişiniz onaylandı",
          preparing: "Siparişiniz hazırlanıyor",
          ready: "İlacınız hazır",
          delivering: "Kurye yola çıktı",
          delivered: "Siparişiniz teslim edildi",
          rejected: "Siparişiniz reddedildi",
        };
        const title = labelMap[status];
        if (title) {
          setNotifications((p) => [
            { id: uid("n"), userId: order.userId, type: "order", title, body: `#${order.id} · ${order.pharmacyName}`, createdAt: nowStr(), read: false },
            ...p,
          ]);
        }
      }
    },

    updateStock(pharmacyId, medicineId, patch) {
      setStock((p) =>
        p.map((s) => (s.pharmacyId === pharmacyId && s.medicineId === medicineId ? { ...s, ...patch } : s))
      );
      if (patch.inStock === true || (patch.quantity ?? 0) > 0) {
        const waiting = stockAlerts.filter((a) => a.medicineId === medicineId);
        if (waiting.length) {
          setNotifications((p) => [
            ...waiting.map((w) => ({
              id: uid("n"), userId: w.userId, type: "stock" as const,
              title: "Beklediğiniz ilaç stokta",
              body: "Takip ettiğiniz ilaç yeniden stoklara eklendi.",
              createdAt: nowStr(), read: false,
            })),
            ...p,
          ]);
          setStockAlerts((p) => p.filter((a) => a.medicineId !== medicineId));
        }
      }
    },
    addStock(item) {
      setStock((p) =>
        p.some((s) => s.pharmacyId === item.pharmacyId && s.medicineId === item.medicineId)
          ? p.map((s) => (s.pharmacyId === item.pharmacyId && s.medicineId === item.medicineId ? item : s))
          : [...p, item]
      );
    },
    removeStock(pharmacyId, medicineId) {
      setStock((p) => p.filter((s) => !(s.pharmacyId === pharmacyId && s.medicineId === medicineId)));
    },
    updatePharmacy(id, patch) {
      setPharmacies((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    },

    setUserStatus(userId, status) {
      setUsers((p) => p.map((u) => (u.id === userId ? { ...u, status } : u)));
    },
    setPharmacyApproved(id, approved) {
      setPharmacies((p) => p.map((x) => (x.id === id ? { ...x, approved } : x)));
    },
    pushNotification(n) {
      setNotifications((p) => [{ ...n, id: uid("n"), createdAt: nowStr(), read: false }, ...p]);
    },
  }), [currentUser, ready, users, pharmacies, stock, orders, prescriptions, addresses, notifications, favorites, stockAlerts]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore, StoreProvider içinde kullanılmalı");
  return ctx;
}

export function useRoleHome(role?: Role) {
  if (role === "vendor") return "/vendor";
  if (role === "admin") return "/admin";
  return "/";
}
