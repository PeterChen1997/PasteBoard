import { db } from "@/lib/db";
import { errorResponse, readJsonBody } from "@/lib/http";
import { threads, pastes } from "@/lib/schema";
import { validateThreadInput } from "@/lib/validators";
import { desc, eq, ilike, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get("search")?.trim();
  const pageParam = Number.parseInt(searchParams.get("page") || "1", 10);
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const limit = 10;
  const offset = (page - 1) * limit;

  const result = await db
    .select({
      id: threads.id,
      title: threads.title,
      createdAt: threads.createdAt,
      updatedAt: threads.updatedAt,
      pasteCount: sql<number>`cast(count(${pastes.id}) as int)`,
    })
    .from(threads)
    .leftJoin(pastes, eq(pastes.threadId, threads.id))
    .where(search ? ilike(threads.title, `%${search}%`) : undefined)
    .groupBy(threads.id)
    .orderBy(desc(threads.updatedAt))
    .limit(limit)
    .offset(offset);

  return NextResponse.json(result);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await readJsonBody(req);
  const payload = validateThreadInput(body);

  if (!payload.success) {
    return errorResponse(payload.error, 400);
  }

  const [result] = await db
    .insert(threads)
    .values(payload.data)
    .returning();

  return NextResponse.json(result, { status: 201 });
}
