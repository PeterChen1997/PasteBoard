import { db } from "@/lib/db";
import { pastes } from "@/lib/schema";
import { desc, eq, ilike } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get("search");

  let query = db
    .select()
    .from(pastes)
    .where(
      search
        ? eq(pastes.threadId, params.id) && ilike(pastes.content, `%${search}%`)
        : eq(pastes.threadId, params.id)
    )
    .orderBy(desc(pastes.updatedAt));

  const result = await query;

  return NextResponse.json(result, {});
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  const body = await req.json();
  const result = await db
    .insert(pastes)
    .values({ ...body, threadId: params.id })
    .returning();

  return NextResponse.json(result[0], {});
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string; pasteId: string }> }
) {
  const params = await props.params;

  await db.select().from(pastes).where(eq(pastes.id, params.pasteId)).limit(1);

  await db.delete(pastes).where(eq(pastes.id, params.pasteId));

  return new NextResponse(null, {
    status: 204,
  });
}
