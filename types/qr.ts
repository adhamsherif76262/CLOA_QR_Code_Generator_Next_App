// src/types/qr.ts
export type RowTypeEn =
  | "custom"
  | "name"
  | "phone"
  | "email"
  | "website"
  | "address";

export type RowTypeAr =
  | "مخصص"
  | "الأسم"
  | "الهاتف"
  | "البريد"
  | "الموقع"
  | "العنوان";

export interface TableRow {
  id: string;
  type: RowTypeEn | RowTypeAr;
  // label: string;
  value: string;
  extra?: string;
}

export interface TableTheme {
  dir: "rtl" | "ltr";
  fontFamily: "sans" | "serif" | "mono";
  fontSize: number;
  headerBg: string;
  headerText: string;
  valueText: string;
  rowBorder: string;
  rowGap: number;
  docTitle : string;
}

export interface QRDocument {
  rows: TableRow[];
  theme: TableTheme;
    // ✅ New expiry-related properties
  expirable?: boolean;   // whether expiry is active
  expiresAt?: string;       // ISO date string (e.g. "2025-12-31")
  expiryMessageAr?: string;  // custom Arabic message after expiry
  expiryMessageEn?: string;  // custom English message after expiry
}
