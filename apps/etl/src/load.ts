import { type Tx, createConflictUpdateSet, schema } from "@poke/db"
import { type FormNames } from "./extract"
import type * as Schema from "./schema"

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size)
    chunks.push(items.slice(i, i + size))
  return chunks
}

export async function types(tx: Tx, types: Schema.Type[]) {
  await tx
    .insert(schema.types)
    .values(types.map(({ id, slug, name }) => ({ id, slug, name })))
    .onConflictDoUpdate({
      target: schema.types.id,
      set: createConflictUpdateSet(schema.types),
    })

  await tx
    .insert(schema.typeEffectivenesses)
    .values(types.flatMap(({ damageRelations }) => damageRelations))
    .onConflictDoUpdate({
      target: [
        schema.typeEffectivenesses.attackerId,
        schema.typeEffectivenesses.defenderId,
      ],
      set: createConflictUpdateSet(schema.typeEffectivenesses, [
        "attackerId",
        "defenderId",
      ]),
    })
}

export async function moves(tx: Tx, moves: Schema.Move[]) {
  await tx
    .insert(schema.moves)
    .values(moves)
    .onConflictDoUpdate({
      target: schema.moves.id,
      set: createConflictUpdateSet(schema.moves),
    })
}

export async function pokemonSpecies(
  tx: Tx,
  pokemonSpecies: Schema.PokemonSpecies[],
) {
  await tx
    .insert(schema.pokemonSpecies)
    .values(pokemonSpecies)
    .onConflictDoUpdate({
      target: schema.pokemonSpecies.id,
      set: createConflictUpdateSet(schema.pokemonSpecies),
    })
}

export async function pokemon(
  tx: Tx,
  pokemon: Schema.Pokemon[],
  formNames: FormNames,
) {
  await tx
    .insert(schema.pokemon)
    .values(
      pokemon.map(({ formUrl, moveIds, typeIds, ...p }) => ({
        ...p,
        formName: formNames.get(p.id) ?? null,
      })),
    )
    .onConflictDoUpdate({
      target: schema.pokemon.id,
      set: createConflictUpdateSet(schema.pokemon),
    })

  await tx
    .insert(schema.pokemonTypes)
    .values(
      pokemon.flatMap(p =>
        p.typeIds.map(t => ({
          pokemonId: p.id,
          typeId: t.type,
          slot: t.slot,
        })),
      ),
    )
    .onConflictDoUpdate({
      target: [schema.pokemonTypes.pokemonId, schema.pokemonTypes.typeId],
      set: createConflictUpdateSet(schema.pokemonTypes, [
        "pokemonId",
        "typeId",
      ]),
    })

  const pokemonMoves = pokemon.flatMap(p =>
    p.moveIds.map(moveId => ({ pokemonId: p.id, moveId })),
  )
  for (const batch of chunk(pokemonMoves, 1000)) {
    await tx
      .insert(schema.pokemonMoves)
      .values(batch)
      // .onConflictDoUpdate({
      //   target: [schema.pokemonMoves.pokemonId, schema.pokemonMoves.moveId],
      //   set: createConflictUpdateSet(schema.pokemonMoves, [
      //     "pokemonId",
      //     "moveId",
      //   ]),
      // })
      .onConflictDoNothing()
  }
}
