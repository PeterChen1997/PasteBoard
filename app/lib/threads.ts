import { db } from "@/lib/db";
import { threads } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function touchThread(threadId: string): Promise<void> {
  await db
    .update(threads)
    .set({ updatedAt: new Date() })
    .where(eq(threads.id, threadId));
}
