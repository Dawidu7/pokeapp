import { pgTable } from "drizzle-orm/pg-core"

export const pokemonSpecies = pgTable("pokemon_species", t => ({
  id: t.integer("id").primaryKey(),
  slug: t.text("slug").notNull().unique(),
  name: t.text("name").notNull(),
  order: t.integer("order").notNull(),
  generation: t.text("generation").notNull(),
  flavorText: t.text("flavor_text"),
  genus: t.text("genus"),
}))
