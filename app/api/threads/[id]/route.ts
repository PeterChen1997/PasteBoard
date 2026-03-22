import { db } from "@/lib/db";
import { errorResponse } from "@/lib/http";
import { threads, pastes } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const params = await props.params;

  const [result] = await db
    .select({
      id: threads.id,
      title: threads.title,
      createdAt: threads.createdAt,
      updatedAt: threads.updatedAt,
      pasteCount: sql<number>`cast(count(${pastes.id}) as int)`,
    })
    .from(threads)
    .leftJoin(pastes, eq(pastes.threadId, threads.id))
    .where(eq(threads.id, params.id))
    .groupBy(threads.id)
    .limit(1);

  if (!result) {
    return errorResponse("Thread not found", 404);
  }

  return NextResponse.json(result);
}
