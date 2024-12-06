import { Clock } from 'lucide-react';
import { format } from 'date-fns';

export function PasteTimestamp({ createdAt }: { createdAt: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <time dateTime={createdAt}>{format(new Date(createdAt), 'PPpp')}</time>
    </div>
  );
}