"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDeferredValue, useState } from "react";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { PasteItem } from "./paste-item";
import { Paste } from "@/lib/types";
import { LoaderCircle, Search } from "lucide-react";

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error || "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

export function PasteList({ threadId }: { threadId: string }) {
  const [search, setSearch] = useState("");
  const [pendingPasteId, setPendingPasteId] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search.trim());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: pastes,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery<Paste[]>({
    queryKey: ["pastes", threadId, deferredSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (deferredSearch) params.append("search", deferredSearch);
      const res = await fetch(`/api/threads/${threadId}/pastes?${params}`);
      if (!res.ok) throw new Error("Failed to fetch pastes");
      return res.json();
    },
  });

  const refreshQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["pastes", threadId] }),
      queryClient.invalidateQueries({ queryKey: ["thread", threadId] }),
      queryClient.invalidateQueries({ queryKey: ["threads"] }),
    ]);
  };

  const runPasteMutation = async ({
    pasteId,
    method,
    body,
    successTitle,
    successDescription,
  }: {
    pasteId: string;
    method: "PATCH" | "DELETE";
    body?: Record<string, string>;
    successTitle: string;
    successDescription: string;
  }) => {
    setPendingPasteId(pasteId);

    try {
      const res = await fetch(`/api/threads/${threadId}/pastes/${pasteId}`, {
        method,
        headers: body
          ? {
              "Content-Type": "application/json",
            }
          : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res));
      }

      await refreshQueries();
      toast({
        title: successTitle,
        description: successDescription,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update paste",
        variant: "destructive",
      });
      throw error;
    } finally {
      setPendingPasteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Loading pastes...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search pastes..."
            className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          {isFetching ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {isFetching
            ? "Refreshing pastes..."
            : `${pastes?.length ?? 0} paste${pastes?.length === 1 ? "" : "s"} visible`}
        </p>
      </div>

      {isError ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <p className="text-sm font-medium text-foreground">
            We couldn&apos;t load the pastes in this thread.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 text-sm font-medium text-primary"
          >
            Try again
          </button>
        </div>
      ) : pastes?.length ? (
        <div className="space-y-4">
          {pastes.map((paste) => (
            <PasteItem
              key={paste.id}
              paste={paste}
              isPending={pendingPasteId === paste.id}
              onDelete={(pasteId) =>
                runPasteMutation({
                  pasteId,
                  method: "DELETE",
                  successTitle: "Paste deleted",
                  successDescription: "The paste was removed from this thread.",
                })
              }
              onEdit={(pasteId, content) =>
                runPasteMutation({
                  pasteId,
                  method: "PATCH",
                  body: { content, mode: "replace" },
                  successTitle: "Paste updated",
                  successDescription: "Your changes were saved.",
                })
              }
              onAppend={(pasteId, content) =>
                runPasteMutation({
                  pasteId,
                  method: "PATCH",
                  body: { content, mode: "append" },
                  successTitle: "Content appended",
                  successDescription: "The new content was added to the paste.",
                })
              }
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
          <p className="text-lg font-medium text-foreground">
            {deferredSearch ? "No pastes match that search." : "No pastes yet."}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {deferredSearch
              ? "Try a different keyword or clear the search field."
              : "Create the first paste in this thread to start building context."}
          </p>
        </div>
      )}
    </div>
  );
}
