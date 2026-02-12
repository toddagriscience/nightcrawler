// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  unique,
} from 'drizzle-orm/pg-core';
import { tab } from './tab';
import { LayoutItem } from 'react-grid-layout';

/** The type of the widget. For example, there could be PHWidget and MacroWidget */
export const widgetEnum = pgEnum('widgets', ['macroRadar']);

/** Active widgets on a given tab. A widget will need to be deleted from this table if it is to be removed from the user's UI. */
export const widget = pgTable(
  'widget',
  {
    id: serial().primaryKey().notNull(),
    tab: integer()
      .references(() => tab.id, { onDelete: 'cascade' })
      .notNull(),
    name: widgetEnum().notNull(),
    widgetMetadata: jsonb().$type<LayoutItem>(),
  },
  (t) => [unique().on(t.tab, t.name)]
);
