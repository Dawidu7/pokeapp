import * as z from "zod"
import { ApiResourceSchema, NameSchema } from "./utils"

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

export type Type = z.infer<typeof TypeSchema>
