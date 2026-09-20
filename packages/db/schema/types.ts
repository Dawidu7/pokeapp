import { pgTable, primaryKey } from "drizzle-orm/pg-core"

export const types = pgTable("types", t => ({
  id: t.integer("id").primaryKey(),
  slug: t.text("slug").notNull(),
  name: t.text("name").notNull(),
}))

export const typeEffectivenesses = pgTable(
  "type_effectivenesses",
  t => ({
    attackerId: t
      .integer("attacker_id")
      .notNull()
      .references(() => types.id),
    defenderId: t
      .integer("defender_id")
      .notNull()
      .references(() => types.id),
    multiplier: t.real("multiplier").notNull(),
  }),
  table => [primaryKey({ columns: [table.attackerId, table.defenderId] })],
)
