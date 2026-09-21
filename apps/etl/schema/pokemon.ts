import * as z from "zod"
import {
  ApiResourceSchema,
  NamedApiResourceSchema,
  UrlApiResourceSchema,
} from "./utils"

export const PokemonSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    height: z.number(),
    is_default: z.boolean(),
    order: z.number(),
    weight: z.number(),
    forms: UrlApiResourceSchema,
    moves: z
      .array(z.object({ move: ApiResourceSchema }))
      .transform(moves => moves.map(({ move }) => move)),
    species: ApiResourceSchema,
    stats: z.array(
      z.object({ base_stat: z.number(), stat: NamedApiResourceSchema }),
    ),
    types: z.array(z.object({ slot: z.number(), type: ApiResourceSchema })),
  })
  .transform(p => {
    const getStat = (name: string) =>
      p.stats.find(({ stat }) => stat === name)?.base_stat ?? 0

    return {
      id: p.id,
      slug: p.name,
      isDefault: p.is_default,
      order: p.order,
      height: p.height / 10,
      weight: p.weight / 10,
      hp: getStat("hp"),
      attack: getStat("attack"),
      defense: getStat("defense"),
      specialAttack: getStat("special-attack"),
      specialDefense: getStat("special-defense"),
      speed: getStat("speed"),
      formUrl: p.forms[0]!,
      speciesId: p.species,
      moveIds: p.moves,
      typeIds: p.types,
    }
  })

export const PokemonFormSchema = z
  .object({
    form_names: z.array(
      z.object({ name: z.string(), language: NamedApiResourceSchema }),
    ),
  })
  .transform(
    ({ form_names }) =>
      form_names.find(({ language }) => language === "en")?.name ?? null,
  )

export type Pokemon = z.infer<typeof PokemonSchema>
