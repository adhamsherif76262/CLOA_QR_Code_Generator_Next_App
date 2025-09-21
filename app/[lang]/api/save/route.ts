/* A NON-USED FILE */
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const { id, doc } = await req.json();

    if (!id || !doc) {
      return NextResponse.json(
        { error: "Missing id or doc" },
        { status: 400 }
      );
    }

    // ensure /public/data exists
    const dir = path.join(process.cwd(), "public", "data");
    await mkdir(dir, { recursive: true });

    // save JSON
    const filePath = path.join(dir, `${id}.json`);
    await writeFile(filePath, JSON.stringify(doc, null, 2), "utf8");

    return NextResponse.json({ success: true, file: `/data/${id}.json` });
  } 
  // catch (err : Error) {
  //   console.error("❌ Error saving document:", err);
  //   return NextResponse.json({ error: err.message }, { status: 500 });
  // }
  catch (err: unknown) {
    console.error("❌ Error saving document:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

}
