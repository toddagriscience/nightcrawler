// Copyright © Todd Agriscience, Inc. All rights reserved.

import { pgEnum } from 'drizzle-orm/pg-core';

/** A general tag for different levels of quantity. */
export const levelCategory = pgEnum('level_category', ['Low', 'Med', 'High']);
