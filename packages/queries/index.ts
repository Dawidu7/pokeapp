import { db } from "@poke/db"

export async function getPokemonList() {
  const pokemonSpecies = await db.query.pokemonSpecies.findMany({
    with: { pokemon: true },
  })

  return pokemonSpecies.map(ps => ({
    ...ps,
    pokemon: Object.fromEntries(
      ps.pokemon.map(p => [p.formName ?? "Default", p]),
    ),
  }))
}
