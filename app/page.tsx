import { ThreadList } from '@/components/thread-list';
import { CreateThreadButton } from '@/components/create-thread-button';

export default function Home() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Threads</h1>
        <CreateThreadButton />
      </div>
      <ThreadList />
    </div>
  );
}