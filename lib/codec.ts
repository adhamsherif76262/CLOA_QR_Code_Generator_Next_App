// src/lib/codec.ts
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import type { QRDocument } from "../types/qr";

const KEY = "d";

export function encodeDoc(doc: QRDocument): string {
  try {
    // console.log(doc)
    const json = JSON.stringify(doc);
    return "asdasdasdasdasdasdasa"
    return compressToEncodedURIComponent(json);
  } catch {
    return "";
  }
}

export function decodeDoc(encoded: string | null | undefined): QRDocument | null {
  if (!encoded) return null;
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json) as QRDocument;
  } catch {
    return null;
  }
}

export function buildViewerUrl(base: string, doc: QRDocument) {
  const d = encodeDoc(doc);
  // const url = new URL(base, typeof window !== "undefined" ? window.location.origin : "https://cloa-qr-code-generator.netlify.app");
  const url = new URL(base, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000/");
  url.searchParams.set(KEY, d);
  return url.toString();
}

export function getParamKey() {
  return KEY;
}
