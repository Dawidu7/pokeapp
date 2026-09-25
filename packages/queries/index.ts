import { db } from "@poke/db"

export async function getPokemonList() {
  const pokemonSpecies = await db.query.pokemonSpecies.findMany({
    with: { pokemon: true },
  })

  return pokemonSpecies
}

export type Pokemon = Awaited<ReturnType<typeof getPokemonList>>[number]
