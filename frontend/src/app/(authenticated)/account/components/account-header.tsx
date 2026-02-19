// Copyright © Todd Agriscience, Inc. All rights reserved.

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/**
 * Header for the account section.
 * Displays a back button to the dashboard and the farm name.
 * @param {Object} props - Component props
 * @param {string} props.farmName - The name of the farm to display
 * @returns {JSX.Element} - The account header component
 */
export default function AccountHeader({ farmName }: { farmName: string }) {
  return (
    <header className="flex items-center gap-4 border-b border-border border-black/40 px-6 h-20 py-4">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Back to dashboard"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <h1 className="text-foreground text-lg font-semibold">{farmName}</h1>
    </header>
  );
}
