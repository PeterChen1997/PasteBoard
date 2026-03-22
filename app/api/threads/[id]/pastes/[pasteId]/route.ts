import { db } from "@/lib/db";
import { errorResponse, readJsonBody } from "@/lib/http";
import { pastes } from "@/lib/schema";
import { touchThread } from "@/lib/threads";
import { validatePasteUpdateInput } from "@/lib/validators";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

function buildAppendedContent(existingContent: string, newContent: string): string {
  if (!existingContent) {
    return newContent;
  }

  if (existingContent.endsWith("\n") || newContent.startsWith("\n")) {
    return `${existingContent}${newContent}`;
  }

  return `${existingContent}\n${newContent}`;
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string; pasteId: string }> }
): Promise<NextResponse> {
  const params = await props.params;
  const body = await readJsonBody(req);
  const payload = validatePasteUpdateInput(body);

  if (!payload.success) {
    return errorResponse(payload.error, 400);
  }

  const pasteFilter = and(
    eq(pastes.id, params.pasteId),
    eq(pastes.threadId, params.id)
  );

  const [existingPaste] = await db
    .select()
    .from(pastes)
    .where(pasteFilter)
    .limit(1);

  if (!existingPaste) {
    return errorResponse("Paste not found", 404);
  }

  const nextContent =
    payload.data.mode === "append"
      ? buildAppendedContent(existingPaste.content, payload.data.content)
      : payload.data.content;

  const [updatedPaste] = await db
    .update(pastes)
    .set({
      content: nextContent,
      updatedAt: new Date(),
    })
    .where(pasteFilter)
    .returning();

  await touchThread(params.id);

  return NextResponse.json(updatedPaste);
}

export async function DELETE(
  _req: NextRequest,
  props: { params: Promise<{ id: string; pasteId: string }> }
): Promise<NextResponse> {
  const params = await props.params;

  const [deletedPaste] = await db
    .delete(pastes)
    .where(
      and(eq(pastes.id, params.pasteId), eq(pastes.threadId, params.id))
    )
    .returning({ id: pastes.id });

  if (!deletedPaste) {
    return errorResponse("Paste not found", 404);
  }

  await touchThread(params.id);

  return new NextResponse(null, { status: 204 });
}
