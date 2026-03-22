import { NextResponse } from "next/server";

export async function readJsonBody(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function errorResponse(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}
