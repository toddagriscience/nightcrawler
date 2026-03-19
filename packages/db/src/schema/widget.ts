// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  unique,
} from 'drizzle-orm/pg-core';
import { managementZone } from './management-zone';
import { LayoutItem } from 'react-grid-layout';

/** The type of the widget. For example, there could be PHWidget and MacroWidget */
export const widgetEnum = pgEnum('widgets', [
  'Macro Radar',
  'Calcium Widget',
  'PH Widget',
  'Salinity Widget',
  'Magnesium Widget',
  'Sodium Widget',
  'Nitrate Nitrogen Widget',
  'Phosphate Phosphorus Widget',
  'Potassium Widget',
  'Zinc Widget',
  'Iron Widget',
  'Organic Matter Widget',
  'Insights',
]);

/** Active widgets on a given management zone. A widget will need to be deleted from this table if it is to be removed from the user's UI. */
export const widget = pgTable(
  'widget',
  {
    id: serial().primaryKey().notNull(),
    managementZone: integer()
      .references(() => managementZone.id, { onDelete: 'cascade' })
      .notNull(),
    name: widgetEnum().notNull(),
    widgetMetadata: jsonb()
      .$type<Pick<LayoutItem, 'i' | 'x' | 'y'>>()
      .notNull(),
  },
  (t) => [unique().on(t.managementZone, t.name)]
);
