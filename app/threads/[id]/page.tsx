import { PasteList } from "@/components/paste-list";
import { CreatePasteButton } from "@/components/create-paste-button";
import { ThreadHeader } from "@/components/thread/thread-header";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col min-h-screen">
      <ThreadHeader id={id} />
      <div className="container flex-1 py-8">
        <div className="flex justify-end mb-6">
          <CreatePasteButton threadId={id} />
        </div>
        <PasteList threadId={id} />
      </div>
    </div>
  );
}
