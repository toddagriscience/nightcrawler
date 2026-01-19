import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

/** Notes table, separated to improve performance. */
export const notes = pgTable('notes', {
  /** Auto increment ID */
  id: serial().primaryKey().notNull(),
  /** Note category (crop, livestock, etc.) */
  category: varchar({ length: 100 }),
  /** Note contents */
  note: text(),
});
