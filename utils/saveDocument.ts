// import fs from "fs";
// import path from "path";
// import { QRDocument } from "../types/qr";

// export async function saveDocument(id: string, doc: QRDocument) {
//   const filePath = path.join(process.cwd(), "public", "data", `${id}.json`);
//   fs.writeFileSync(filePath, JSON.stringify(doc, null, 2), "utf-8");
// }


/* A NON Used File */
"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { QRDocument } from "../types/qr";

/**
 * Save a QRDocument as a JSON file under /public/data/{id}.json
 */
export async function saveDocument(id: string, doc: QRDocument): Promise<void> {
  try {
    // Ensure /public/data exists
    const dir = path.join(process.cwd(), "public", "data");
    await mkdir(dir, { recursive: true });

    // Build file path
    const filePath = path.join(dir, `${id}.json`);

    // Write JSON file
    await writeFile(filePath, JSON.stringify(doc, null, 2), "utf8");

    console.log(`✅ Saved QR document: ${filePath}`);
  } catch (err) {
    console.error("❌ Error saving QR document:", err);
    throw err;
  }
}

