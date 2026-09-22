import * as z from "zod"
import { NameSchema, NamedApiResourceSchema } from "./utils"

export const PokemonSpeciesSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    order: z.number(),
    generation: NamedApiResourceSchema,
    names: NameSchema,
    flavor_text_entries: z.array(
      z.object({
        flavor_text: z.string(),
        language: NamedApiResourceSchema,
        version: NamedApiResourceSchema,
      }),
    ),
    genera: z.array(
      z.object({ genus: z.string(), language: NamedApiResourceSchema }),
    ),
  })
  .transform(ps => ({
    id: ps.id,
    slug: ps.name,
    name: ps.names ?? ps.name,
    order: ps.order,
    generation: ps.generation,
    flavorText:
      ps.flavor_text_entries.findLast(({ language }) => language === "en")
        ?.flavor_text ?? null,
    genus: ps.genera.find(({ language }) => language === "en")?.genus ?? null,
  }))

export type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>
