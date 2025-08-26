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
}

export interface QRDocument {
  rows: TableRow[];
  theme: TableTheme;
}
