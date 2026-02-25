// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NextRequest, NextResponse } from 'next/server';
import { searchKnowledge } from '@/lib/ai/search';
import { logger } from '@/lib/logger';

/**
 * GET /api/search?q=carrots
 *
 * Searches Todd's knowledge base and returns matching human-written content.
 * If no results match, returns an empty array (UI shows "contact advisor" message).
 */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      // eslint-disable-next-line no-secrets/no-secrets
      { error: 'Missing search query. Use ?q=your+search+term' },
      { status: 400 }
    );
  }

  try {
    const results = await searchKnowledge(query.trim());

    return NextResponse.json({
      query,
      results,
      hasResults: results.length > 0,
      message:
        results.length === 0
          ? 'No matching information found. Please contact a Todd advisor for help with this topic.'
          : null,
    });
  } catch (error) {
    logger.error('[API] /api/search error:', error);
    return NextResponse.json(
      { error: 'Search failed. Please try again.' },
      { status: 500 }
    );
  }
}
