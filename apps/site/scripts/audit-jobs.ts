// Copyright © Todd Agriscience, Inc. All rights reserved.

import { client } from '../src/lib/sanity/client';
import type { SanityArticle } from '../src/lib/sanity/article-types';
import {
  getJobPostingMissingFields,
  isActiveJob,
  isGeneralApplication,
} from '../src/lib/sanity/job-posting';

const jobs = await client.fetch<SanityArticle[]>(
  '*[_type == "career" && !(_id in path("drafts.**"))]{...}'
);
console.log(
  JSON.stringify(
    jobs.map((job) => ({
      id: job._id,
      title: job.title,
      slug: job.slug.current,
      active: isActiveJob(job),
      generalApplication: isGeneralApplication(job),
      missingVerifiedFields: getJobPostingMissingFields(job),
    })),
    null,
    2
  )
);
