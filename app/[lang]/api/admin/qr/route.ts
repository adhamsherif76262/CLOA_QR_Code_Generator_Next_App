import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ✅ server-only secure key
);

const BUCKET = "cloa-qr-generator-app"; // replace with your actual Supabase bucket name

export async function POST(req: Request) {
  try {
    const { action, id } = await req.json();

    if (!action || !id)
      return NextResponse.json({ error: "Missing action or id" }, { status: 400 });

    if (action === "search") {
      const { data, error } = await supabaseAdmin.storage
        .from(BUCKET)
        .download(`${id}.json`);
      if (error) throw error;
      const text = await data.text();
      const json = JSON.parse(text);
      return NextResponse.json({ data: json });
    }

    if (action === "extend") {
      // fetch file
      const { data, error } = await supabaseAdmin.storage
        .from(BUCKET)
        .download(`${id}.json`);
      if (error) throw error;
      const text = await data.text();
      const json = JSON.parse(text);

      // extend expiry by 1 year
      const now = new Date(json.expiresAt || new Date());
      now.setFullYear(now.getFullYear() + 1);
      json.expiresAt = now.toISOString();

      // re-upload
      const updated = new Blob([JSON.stringify(json, null, 2)], {
        type: "application/json",
      });
      const { error: uploadError } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(`${id}.json`, updated, { upsert: true });

      if (uploadError) throw uploadError;
      return NextResponse.json({ success: true, message: "Extended by 1 year" });
    }

    if (action === "delete") {
      const { error } = await supabaseAdmin.storage
        .from(BUCKET)
        .remove([`${id}.json`]);
      if (error) throw error;
      return NextResponse.json({ success: true, message: "Deleted successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    console.error("❌ Admin action failed:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Unknown error" },
      { status: 500 }
    );
  }
}
