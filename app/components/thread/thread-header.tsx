"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronLeft, Clock, Hash } from "lucide-react";
import { format } from "date-fns";
import { ThreadStats } from "./thread-stats";
import { Thread } from "@/lib/types";

export function ThreadHeader({ id }: { id: string }) {
  const { data: thread, isLoading } = useQuery<Thread>({
    queryKey: ["thread", id],
    queryFn: async () => {
      const res = await fetch(`/api/threads/${id}`);
      if (!res.ok) throw new Error("Failed to fetch thread");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="sticky top-14 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-6">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!thread) return null;

  return (
    <div className="sticky top-14 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                {thread.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6 pl-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Created {format(new Date(thread.createdAt), "PPpp")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              <span>Thread ID: {id.slice(0, 8)}</span>
            </div>
            <ThreadStats threadId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
