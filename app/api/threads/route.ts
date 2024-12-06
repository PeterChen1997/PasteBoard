import { db } from "@/lib/db";
import { threads } from "@/lib/schema";
import { desc, eq, ilike } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;
  const offset = (page - 1) * limit;

  let query = db
    .select()
    .from(threads)
    .where(search ? ilike(threads.title, `%${search}%`) : undefined)
    .orderBy(desc(threads.updatedAt))
    .limit(limit)
    .offset(offset);

  const result = await query;

  return NextResponse.json(result, {});
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await db
    .insert(threads)
    .values({ ...body })
    .returning();

  return NextResponse.json(result[0], {});
}
