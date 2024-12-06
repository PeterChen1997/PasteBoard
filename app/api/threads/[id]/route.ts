import { db } from "@/lib/db";
import { threads } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  const result = await db
    .select()
    .from(threads)
    .where(eq(threads.id, params.id))
    .limit(1);

  if (!result.length) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  return NextResponse.json(result[0], {});
}
