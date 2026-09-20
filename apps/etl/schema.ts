import * as z from "zod"

export const ApiResourceSchema = z
  .object({ url: z.url() })
  .transform(({ url }) => {
    const id = Number(url.split("/").filter(Boolean).at(-1))
    if (!id) throw new Error(`Could not extract ID from url`)
    return id
  })

export const NamedApiResourceSchema = z
  .object({ name: z.string() })
  .transform(({ name }) => name)

const UrlApiResourceSchema = z
  .array(z.object({ url: z.url() }))
  .transform(urls => urls.map(({ url }) => url))

export const ResourceListSchema = z
  .object({
    results: UrlApiResourceSchema,
  })
  .transform(({ results }) => results)

const NameSchema = z
  .array(z.object({ name: z.string(), language: NamedApiResourceSchema }))
  .transform(names => names.find(({ language }) => language === "en")?.name)

export const TypeSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    damage_relations: z.object({
      no_damage_to: z.array(ApiResourceSchema),
      half_damage_to: z.array(ApiResourceSchema),
      double_damage_to: z.array(ApiResourceSchema),
    }),
    names: NameSchema,
  })
  .transform(t => {
    const createDamageRelations = (ids: number[], multiplier: number) =>
      ids.map(id => ({
        attackerId: t.id,
        defenderId: id,
        multiplier,
      }))

    return {
      id: t.id,
      slug: t.name,
      name: t.names ?? t.name,
      damageRelations: [
        ...createDamageRelations(t.damage_relations.no_damage_to, 0),
        ...createDamageRelations(t.damage_relations.half_damage_to, 0.5),
        ...createDamageRelations(t.damage_relations.double_damage_to, 2),
      ],
    }
  })

export const MoveSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    accuracy: z.number().nullable(),
    effect_chance: z.number().nullable(),
    pp: z.number().nullable(),
    priority: z.number(),
    power: z.number().nullable(),
    damage_class: NamedApiResourceSchema,
    effect_entries: z.array(
      z.object({ short_effect: z.string(), language: NamedApiResourceSchema }),
    ),
    meta: z
      .object({
        ailment: NamedApiResourceSchema,
        category: NamedApiResourceSchema,
        min_hits: z.number().nullable(),
        max_hits: z.number().nullable(),
        min_turns: z.number().nullable(),
        max_turns: z.number().nullable(),
        drain: z.number(),
        healing: z.number(),
        crit_rate: z.number(),
        ailment_chance: z.number(),
        flinch_chance: z.number(),
        stat_chance: z.number(),
      })
      .nullable(),
    names: NameSchema,
    target: NamedApiResourceSchema,
    type: ApiResourceSchema,
  })
  .transform(m => ({
    id: m.id,
    slug: m.name,
    name: m.names ?? m.name,
    accuracy: m.accuracy,
    pp: m.pp,
    priority: m.priority,
    power: m.power,
    damageClass: m.damage_class,
    effect:
      m.effect_entries.find(({ language }) => language === "en")
        ?.short_effect ?? null,
    ailment: m.meta?.ailment ?? null,
    category: m.meta?.category ?? null,
    minHits: m.meta?.min_hits ?? null,
    maxHits: m.meta?.max_hits ?? null,
    minTurns: m.meta?.min_turns ?? null,
    maxTurns: m.meta?.max_turns ?? null,
    drain: m.meta?.drain ?? null,
    healing: m.meta?.healing ?? null,
    critRate: m.meta?.crit_rate ?? null,
    ailmentChance: m.meta?.ailment_chance ?? null,
    flinchChance: m.meta?.flinch_chance ?? null,
    statChance: m.meta?.stat_chance ?? null,
    effectChance: m.effect_chance,
    target: m.target,
    typeId: m.type,
  }))
