import { pgTable } from "drizzle-orm/pg-core"
import { types } from "./types"

export const moves = pgTable("moves", t => ({
  id: t.integer("id").primaryKey(),
  slug: t.text("slug").notNull().unique(),
  name: t.text("name").notNull(),
  accuracy: t.integer("accuracy"),
  pp: t.integer("pp"),
  priority: t.integer("priority").notNull(),
  power: t.integer("power"),
  damageClass: t.text("damage_class").notNull(),
  effect: t.text("effect"),
  ailment: t.text("ailment"),
  category: t.text("category"),
  minHits: t.integer("min_hits"),
  maxHits: t.integer("max_hits"),
  minTurns: t.integer("min_turns"),
  maxTurns: t.integer("max_turns"),
  drain: t.real("drain"),
  healing: t.real("healing"),
  critRate: t.real("crit_rate"),
  ailmentChance: t.real("ailment_chance"),
  flinchChance: t.real("flinch_chance"),
  statChance: t.real("stat_chance"),
  effectChance: t.real("effect_chance"),
  target: t.text("target").notNull(),
  typeId: t
    .integer("type_id")
    .notNull()
    .references(() => types.id),
}))
