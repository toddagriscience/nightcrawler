// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SearchResult {
  id: number;
  title: string;
  content: string;
  category: string;
  source: string | null;
  similarity: number;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  hasResults: boolean;
  message: string | null;
}

const categoryLabels: Record<string, string> = {
  soil: 'Soil',
  planting: 'Planting',
  water: 'Water',
  insects_disease: 'Insects & Disease',
  harvest_storage: 'Harvest & Storage',
  go_to_market: 'Go-To-Market',
  seed_products: 'Seed Products',
};

/**
 * Knowledge base search page for authenticated farmers.
 * Searches Todd's human-written content using semantic search.
 */
export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch(
        '/api/search?q=' + encodeURIComponent(query.trim())
      );
      if (!res.ok) {
        throw new Error('Search failed');
      }
      const data: SearchResponse = await res.json();
      setResults(data);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Todd Knowledge Base
      </h1>
      <p className="text-foreground/60 mb-8">
        Search our guides, recommendations, and seed catalog.
      </p>

      <div className="flex gap-3 mb-8">
        <Input
          placeholder="Search topics... (e.g. carrots, soil pH, cover crops)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading || !query.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {error && (
        <p className="text-red-600 mb-4">{error}</p>
      )}

      {results && !results.hasResults && (
        <Card className="p-6 text-center">
          <p className="text-foreground/80 mb-2">
            We don&apos;t have information on that topic yet.
          </p>
          <p className="text-foreground font-medium">
            Please{' '}
            <a href="/contact" className="underline hover:opacity-70">
              contact a Todd advisor
            </a>{' '}
            for help with &quot;{results.query}&quot;.
          </p>
        </Card>
      )}

      {results && results.hasResults && (
        <div className="space-y-4">
          {results.results.map((result) => (
            <Card key={result.id} className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-foreground/10 text-foreground/70">
                  {categoryLabels[result.category] || result.category}
                </span>
                {result.source && (
                  <span className="text-xs text-foreground/50">
                    {result.source}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                {result.title}
              </h2>
              <p className="text-foreground/80 text-sm leading-relaxed">
                {result.content}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
