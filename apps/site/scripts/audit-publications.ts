// Copyright © Todd Agriscience, Inc. All rights reserved.

import { client } from '../src/lib/sanity/client';
import type { SanityArticle } from '../src/lib/sanity/article-types';
import { getArticlePresentation } from '../src/lib/sanity/article-presentation';

const articles = await client.fetch<SanityArticle[]>(
  '*[_type == "news" && !(_id in path("drafts.**")) && (!defined(offSiteUrl) || offSiteUrl == "")]{_id,_type,title,slug,date,author,editorialOwner,summary,content,headerImage,thumbnail,language}'
);
const proposals = articles.map((article) => {
  const facts = getArticlePresentation(article);
  return {
    id: article._id,
    slug: article.slug.current,
    language: article.language ?? 'en',
    proposedSummary:
      facts.description !== article.summary ? facts.description : undefined,
    proposedEditorialOwner:
      !article.author?.trim() && !article.editorialOwner?.trim()
        ? facts.owner
        : undefined,
    publicationDateNeedsReview: !facts.datePublished,
    mainImageNeedsReview: !facts.imageAsset,
  };
});
// Read-only: output proposals for editorial approval; never mutate CMS records.
console.log(JSON.stringify(proposals, null, 2));
