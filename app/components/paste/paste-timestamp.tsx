import { format } from "date-fns";
import { Clock, PencilLine } from "lucide-react";

interface PasteTimestampProps {
  createdAt: string;
  updatedAt: string;
}

export function PasteTimestamp({ createdAt, updatedAt }: PasteTimestampProps) {
  const wasEdited =
    Math.abs(new Date(updatedAt).getTime() - new Date(createdAt).getTime()) > 1000;

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
      <span className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <time dateTime={createdAt}>{format(new Date(createdAt), "PPpp")}</time>
      </span>
      {wasEdited ? (
        <span className="flex items-center gap-2">
          <PencilLine className="h-4 w-4" />
          <time dateTime={updatedAt}>Edited {format(new Date(updatedAt), "PPpp")}</time>
        </span>
      ) : null}
    </div>
  );
}
