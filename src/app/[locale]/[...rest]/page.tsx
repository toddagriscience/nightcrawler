import { notFound } from 'next/navigation';

// Catch all unmatched routes within locale and trigger 404
export default function CatchAllPage() {
  notFound();
}
