/* A NON-USED FILE */

// src/lib/validate.ts
import type { TableRow } from "../types/qr";

export type RowIssue = { id: string; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+\d][\d\s().-]{5,}$/;
const URL = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\S*)?$/i;

export function validateRows(rows: TableRow[]): RowIssue[] {
  const issues: RowIssue[] = [];
  for (const r of rows) {
    // if (!r.label.trim()) issues.push({ id: r.id, message: "العنوان فارغ" });
    if (r.type === "email" && r.value && !EMAIL.test(r.value)) issues.push({ id: r.id, message: "بريد غير صالح" });
    if (r.type === "phone" && r.value && !PHONE.test(r.value)) issues.push({ id: r.id, message: "هاتف غير صالح" });
    if (r.type === "website" && r.value && !URL.test(r.value)) issues.push({ id: r.id, message: "رابط غير صالح" });
  }
  return issues;
}
