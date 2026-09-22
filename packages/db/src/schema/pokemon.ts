import { pgTable, primaryKey } from "drizzle-orm/pg-core"
import { moves } from "./moves"
import { pokemonSpecies } from "./pokemon-species"
import { types } from "./types"

export const pokemon = pgTable("pokemon", t => ({
  id: t.integer("id").primaryKey(),
  slug: t.text("slug").notNull().unique(),
  isDefault: t.boolean("is_default").notNull(),
  formName: t.text("form_name"),
  order: t.integer("order").notNull(),
  height: t.real("height").notNull(),
  weight: t.real("weight").notNull(),
  hp: t.integer("hp").notNull(),
  attack: t.integer("attack").notNull(),
  defense: t.integer("defense").notNull(),
  specialAttack: t.integer("special_attack").notNull(),
  specialDefense: t.integer("special_defense").notNull(),
  speed: t.integer("speed").notNull(),
  speciesId: t
    .integer("species_id")
    .notNull()
    .references(() => pokemonSpecies.id),
}))

export const pokemonMoves = pgTable(
  "pokemon_moves",
  t => ({
    pokemonId: t
      .integer("pokemon_id")
      .notNull()
      .references(() => pokemon.id),
    moveId: t
      .integer("move_id")
      .notNull()
      .references(() => moves.id),
  }),
  table => [primaryKey({ columns: [table.pokemonId, table.moveId] })],
)

export const pokemonTypes = pgTable(
  "pokemon_types",
  t => ({
    pokemonId: t
      .integer("pokemon_id")
      .notNull()
      .references(() => pokemon.id),
    typeId: t
      .integer("type_id")
      .notNull()
      .references(() => types.id),
    slot: t.integer("slot").notNull(),
  }),
  table => [primaryKey({ columns: [table.pokemonId, table.typeId] })],
)
