import {
  Address, AppNotification, Medicine, Order, Pharmacy, Prescription, StockItem, User,
} from "./types";

export const users: User[] = [
  { id: "u1", name: "Selin Yılmaz", email: "kullanici@eczajet.com", phone: "0532 111 22 12", role: "user", status: "active", createdAt: "2026-02-11" },
  { id: "u2", name: "Mert Demir", email: "mert@eczajet.com", phone: "0533 222 11 09", role: "user", status: "active", createdAt: "2026-03-02" },
  { id: "u3", name: "Ayşe Kara", email: "ayse@eczajet.com", phone: "0535 887 41 20", role: "user", status: "suspended", createdAt: "2026-01-19" },
  { id: "v1", name: "Şifa Eczanesi", email: "eczane@eczajet.com", phone: "0216 345 67 89", role: "vendor", status: "active", pharmacyId: "sifa", createdAt: "2025-11-04" },
  { id: "v2", name: "Deva Eczanesi", email: "deva@eczajet.com", phone: "0216 355 66 77", role: "vendor", status: "active", pharmacyId: "deva", createdAt: "2026-01-08" },
  { id: "a1", name: "Platform Yöneticisi", email: "admin@eczajet.com", phone: "0850 300 32 92", role: "admin", status: "active", createdAt: "2025-09-01" },
];

export const pharmacies: Pharmacy[] = [
  { id: "sifa", name: "Şifa Eczanesi", distanceKm: 0.4, open: true, duty: true, district: "Kadıköy", address: "Caferağa Mah. Moda Cad. No:12", phone: "0216 345 67 89", hours: "09:00 - 19:00 (bu gece nöbetçi)", prepMinutes: 12, rating: 4.9, approved: true, services: ["Soğuk zincir", "Tansiyon ölçümü", "Moto kurye"] },
  { id: "yildiz", name: "Yıldız Eczanesi", distanceKm: 0.7, open: true, duty: false, district: "Kadıköy", address: "Osmanağa Mah. Söğütlüçeşme Cad. No:5", phone: "0216 348 12 34", hours: "09:00 - 19:00", prepMinutes: 15, rating: 4.7, approved: true, services: ["Dermokozmetik danışmanlık"] },
  { id: "saglik", name: "Sağlık Eczanesi", distanceKm: 0.9, open: false, duty: false, district: "Kadıköy", address: "Fenerbahçe Mah. Bağdat Cad. No:88", phone: "0216 411 22 33", hours: "09:00 - 18:30", prepMinutes: 20, rating: 4.5, approved: true, services: [] },
  { id: "deva", name: "Deva Eczanesi", distanceKm: 1.2, open: true, duty: true, district: "Kadıköy", address: "Göztepe Mah. Ethem Efendi Cad. No:41", phone: "0216 355 66 77", hours: "24 saat (nöbet)", prepMinutes: 10, rating: 4.8, approved: true, services: ["Soğuk zincir", "Raporlu ilaç teslimi"] },
  { id: "hayat", name: "Hayat Eczanesi", distanceKm: 1.6, open: true, duty: false, district: "Üsküdar", address: "Acıbadem Mah. Çeçen Sok. No:3", phone: "0216 522 88 99", hours: "09:00 - 19:30", prepMinutes: 18, rating: 4.6, approved: true, services: ["Medikal cihaz kiralama"] },
  { id: "umut", name: "Umut Eczanesi", distanceKm: 2.1, open: true, duty: true, district: "Kadıköy", address: "Erenköy Mah. Bağdat Cad. No:210", phone: "0216 360 44 55", hours: "24 saat (nöbet)", prepMinutes: 22, rating: 4.4, approved: false, services: ["Moto kurye"] },
];

export const medicines: Medicine[] = [
  { id: "parol", name: "Parol", activeIngredient: "Parasetamol", form: "Tablet", dose: "500 mg / 20 tablet", manufacturer: "Atabay", category: "Ağrı kesici", prescriptionOnly: false, reportRequired: false },
  { id: "augmentin", name: "Augmentin BID", activeIngredient: "Amoksisilin + Klavulanik Asit", form: "Film tablet", dose: "1000 mg / 14 tablet", manufacturer: "GSK", category: "Antibiyotik", prescriptionOnly: true, reportRequired: false },
  { id: "aspirin", name: "Aspirin Complex", activeIngredient: "Asetilsalisilik Asit", form: "Efervesan toz", dose: "10 saşe", manufacturer: "Bayer", category: "Soğuk algınlığı", prescriptionOnly: false, reportRequired: false },
  { id: "vitc", name: "Vitamin C", activeIngredient: "Askorbik Asit", form: "Efervesan tablet", dose: "1000 mg / 20 tablet", manufacturer: "Supradyn", category: "Vitamin", prescriptionOnly: false, reportRequired: false },
  { id: "ventolin", name: "Ventolin İnhaler", activeIngredient: "Salbutamol", form: "Aerosol inhaler", dose: "100 mcg", manufacturer: "GSK", category: "Solunum", prescriptionOnly: true, reportRequired: false },
  { id: "biteral", name: "Biteral", activeIngredient: "Ornidazol", form: "Kapsül", dose: "250 mg / 16 kapsül", manufacturer: "Sandoz", category: "Antibiyotik", prescriptionOnly: true, reportRequired: false },
  { id: "coversyl", name: "Coversyl Plus", activeIngredient: "Perindopril + İndapamid", form: "Film tablet", dose: "5/1.25 mg / 30 tablet", manufacturer: "Servier", category: "Tansiyon", prescriptionOnly: true, reportRequired: true },
  { id: "lantus", name: "Lantus SoloStar", activeIngredient: "İnsülin Glarjin", form: "Kalem enjektör", dose: "100 IU/ml", manufacturer: "Sanofi", category: "Diyabet", prescriptionOnly: true, reportRequired: true },
];

export const stock: StockItem[] = [
  { pharmacyId: "sifa", medicineId: "parol", quantity: 48, inStock: true, price: 42.9 },
  { pharmacyId: "sifa", medicineId: "augmentin", quantity: 12, inStock: true, price: 186.5 },
  { pharmacyId: "sifa", medicineId: "vitc", quantity: 30, inStock: true, price: 54.0 },
  { pharmacyId: "sifa", medicineId: "ventolin", quantity: 6, inStock: true, price: 118.0 },
  { pharmacyId: "sifa", medicineId: "coversyl", quantity: 9, inStock: true, price: 96.4 },
  { pharmacyId: "yildiz", medicineId: "parol", quantity: 22, inStock: true, price: 43.5 },
  { pharmacyId: "yildiz", medicineId: "aspirin", quantity: 14, inStock: true, price: 78.9 },
  { pharmacyId: "yildiz", medicineId: "vitc", quantity: 0, inStock: false, price: 55.2 },
  { pharmacyId: "yildiz", medicineId: "biteral", quantity: 7, inStock: true, price: 143.9 },
  { pharmacyId: "deva", medicineId: "parol", quantity: 60, inStock: true, price: 41.9 },
  { pharmacyId: "deva", medicineId: "augmentin", quantity: 4, inStock: true, price: 184.0 },
  { pharmacyId: "deva", medicineId: "ventolin", quantity: 11, inStock: true, price: 116.5 },
  { pharmacyId: "deva", medicineId: "coversyl", quantity: 16, inStock: true, price: 95.0 },
  { pharmacyId: "deva", medicineId: "lantus", quantity: 5, inStock: true, price: 412.0 },
  { pharmacyId: "hayat", medicineId: "aspirin", quantity: 9, inStock: true, price: 79.9 },
  { pharmacyId: "hayat", medicineId: "vitc", quantity: 25, inStock: true, price: 53.5 },
  { pharmacyId: "umut", medicineId: "parol", quantity: 18, inStock: true, price: 44.0 },
  { pharmacyId: "umut", medicineId: "aspirin", quantity: 0, inStock: false, price: 80.0 },
  { pharmacyId: "umut", medicineId: "biteral", quantity: 10, inStock: true, price: 145.0 },
  { pharmacyId: "umut", medicineId: "vitc", quantity: 12, inStock: true, price: 56.0 },
];

export const addresses: Address[] = [
  { id: "ev", label: "Evim", icon: "home", detail: "Caferağa Mah. Moda Cad. No:18 D:4, Kadıköy / İstanbul", note: "2. kat, zilde 'Yılmaz' yazıyor.", isDefault: true },
  { id: "is", label: "İş Yeri", icon: "corporate_fare", detail: "Barbaros Mah. Mor Sümbül Sk. A Blok K:14 D:92, Ataşehir / İstanbul", note: "Mesai saatleri içinde resepsiyona bırakılabilir.", isDefault: false },
  { id: "anne", label: "Annemin Evi", icon: "family_restroom", detail: "Göztepe Mah. Tütüncü Mehmet Efendi Cad. No:44 D:8, Kadıköy / İstanbul", note: "Nevin Yılmaz — kapı zili aktif.", isDefault: false },
];

export const orders: Order[] = [
  { id: "EJ-9482", userId: "u1", userName: "Selin Yılmaz", pharmacyId: "sifa", pharmacyName: "Şifa Eczanesi", lines: [{ medicineId: "augmentin", name: "Augmentin BID 1000mg", quantity: 1, price: 186.5 }, { medicineId: "parol", name: "Parol 500mg", quantity: 1, price: 42.9 }], total: 259.3, addressLabel: "Evim", addressDetail: "Caferağa Mah. Moda Cad. No:18 D:4", createdAt: "2026-09-14 21:10", status: "preparing", prescriptionId: "RX-1201" },
  { id: "EJ-9410", userId: "u1", userName: "Selin Yılmaz", pharmacyId: "deva", pharmacyName: "Deva Eczanesi", lines: [{ medicineId: "coversyl", name: "Coversyl Plus 5/1.25mg", quantity: 1, price: 95.0 }], total: 124.9, addressLabel: "Evim", addressDetail: "Caferağa Mah. Moda Cad. No:18 D:4", createdAt: "2026-09-14 18:40", status: "created", prescriptionId: "RX-1198", reportRequest: true },
  { id: "EJ-9312", userId: "u1", userName: "Selin Yılmaz", pharmacyId: "yildiz", pharmacyName: "Yıldız Eczanesi", lines: [{ medicineId: "vitc", name: "Vitamin C 1000mg", quantity: 1, price: 55.2 }, { medicineId: "aspirin", name: "Aspirin Complex", quantity: 1, price: 78.9 }], total: 164.0, addressLabel: "İş Yeri", addressDetail: "Barbaros Mah. Mor Sümbül Sk.", createdAt: "2026-09-02 14:02", status: "delivered" },
  { id: "EJ-9187", userId: "u2", userName: "Mert Demir", pharmacyId: "sifa", pharmacyName: "Şifa Eczanesi", lines: [{ medicineId: "biteral", name: "Biteral 250mg", quantity: 1, price: 143.9 }], total: 173.8, addressLabel: "Evim", addressDetail: "Osmanağa Mah. No:3", createdAt: "2026-08-21 09:15", status: "delivered", prescriptionId: "RX-1120" },
  { id: "EJ-9501", userId: "u2", userName: "Mert Demir", pharmacyId: "sifa", pharmacyName: "Şifa Eczanesi", lines: [{ medicineId: "ventolin", name: "Ventolin İnhaler", quantity: 2, price: 118.0 }], total: 265.9, addressLabel: "Evim", addressDetail: "Osmanağa Mah. No:3", createdAt: "2026-09-15 08:20", status: "created", prescriptionId: "RX-1204" },
  { id: "EJ-9502", userId: "u3", userName: "Ayşe Kara", pharmacyId: "deva", pharmacyName: "Deva Eczanesi", lines: [{ medicineId: "lantus", name: "Lantus SoloStar", quantity: 1, price: 412.0 }], total: 441.9, addressLabel: "Evim", addressDetail: "Göztepe Mah. No:12", createdAt: "2026-09-15 07:45", status: "approved", prescriptionId: "RX-1205", reportRequest: true },
];

export const prescriptions: Prescription[] = [
  { id: "RX-1201", userId: "u1", userName: "Selin Yılmaz", code: "A1B2C3", source: "e-recete", uploadedAt: "2026-09-14 21:05", status: "verified", medicineIds: ["augmentin", "parol"] },
  { id: "RX-1198", userId: "u1", userName: "Selin Yılmaz", code: "K9L2M4", source: "foto", uploadedAt: "2026-09-14 18:30", status: "pending", medicineIds: ["coversyl"], reportNo: "7829-KA" },
  { id: "RX-1204", userId: "u2", userName: "Mert Demir", code: "P4R7T1", source: "e-recete", uploadedAt: "2026-09-15 08:15", status: "pending", medicineIds: ["ventolin"] },
  { id: "RX-1205", userId: "u3", userName: "Ayşe Kara", code: "Z3X8Q2", source: "dosya", uploadedAt: "2026-09-15 07:40", status: "verified", medicineIds: ["lantus"], reportNo: "5512-DB" },
  { id: "RX-1120", userId: "u2", userName: "Mert Demir", code: "H7J3N5", source: "foto", uploadedAt: "2026-08-21 09:05", status: "verified", medicineIds: ["biteral"] },
];

export const notifications: AppNotification[] = [
  { id: "n1", userId: "u1", type: "order", title: "Siparişiniz hazırlanıyor", body: "#EJ-9482 numaralı siparişiniz Şifa Eczanesi tarafından hazırlanıyor.", createdAt: "2026-09-14 21:18", read: false },
  { id: "n2", userId: "u1", type: "prescription", title: "Reçeteniz incelemede", body: "RX-1198 numaralı raporlu ilaç talebiniz eczacı onayı bekliyor.", createdAt: "2026-09-14 18:33", read: false },
  { id: "n3", userId: "u1", type: "stock", title: "Beklediğiniz ilaç stokta", body: "Vitamin C 1000mg, Hayat Eczanesi stoklarına eklendi.", createdAt: "2026-09-13 10:02", read: true },
  { id: "n4", userId: "u1", type: "system", title: "Kronik ilaç hatırlatması", body: "Coversyl Plus kutunuzun 12 gün içinde bitmesi bekleniyor.", createdAt: "2026-09-12 08:00", read: true },
];

export const favoritePharmacyIds = ["sifa", "deva"];

/* ---------- yardimcilar ---------- */

export const byId = <T extends { id: string }>(arr: T[], id: string) => arr.find((x) => x.id === id);

export function stockFor(medicineId: string): (StockItem & { pharmacy: Pharmacy })[] {
  return stock
    .filter((s) => s.medicineId === medicineId)
    .map((s) => ({ ...s, pharmacy: pharmacies.find((p) => p.id === s.pharmacyId)! }))
    .filter((s) => Boolean(s.pharmacy))
    .sort((a, b) => a.pharmacy.distanceKm - b.pharmacy.distanceKm);
}

export function stockOfPharmacy(pharmacyId: string): (StockItem & { medicine: Medicine })[] {
  return stock
    .filter((s) => s.pharmacyId === pharmacyId)
    .map((s) => ({ ...s, medicine: medicines.find((m) => m.id === s.medicineId)! }))
    .filter((s) => Boolean(s.medicine));
}

export const money = (n: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);
