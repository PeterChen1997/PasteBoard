import { db } from "@/lib/db";
import { errorResponse, readJsonBody } from "@/lib/http";
import { pastes } from "@/lib/schema";
import { touchThread } from "@/lib/threads";
import { validatePasteInput } from "@/lib/validators";
import { and, desc, eq, ilike } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const params = await props.params;

  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get("search")?.trim();

  const result = await db
    .select()
    .from(pastes)
    .where(
      search
        ? and(eq(pastes.threadId, params.id), ilike(pastes.content, `%${search}%`))
        : eq(pastes.threadId, params.id)
    )
    .orderBy(desc(pastes.updatedAt));

  return NextResponse.json(result);
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const params = await props.params;
  const body = await readJsonBody(req);
  const payload = validatePasteInput(body);

  if (!payload.success) {
    return errorResponse(payload.error, 400);
  }

  const [result] = await db
    .insert(pastes)
    .values({ content: payload.data.content, threadId: params.id })
    .returning();

  await touchThread(params.id);

  return NextResponse.json(result, { status: 201 });
}
