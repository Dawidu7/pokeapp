import { closeDb, db } from "@poke/db"
import { assertNoErrors, extract, getFormNames } from "./extract"
import * as load from "./load"
import * as schema from "./schema"

async function etl() {
  await assertNoErrors()

  const types = await extract("type", schema.TypeSchema)
  const moves = await extract("move", schema.MoveSchema)
  const pokemonSpecies = await extract(
    "pokemon-species",
    schema.PokemonSpeciesSchema,
  )
  const pokemon = await extract("pokemon", schema.PokemonSchema)
  const formNames = await getFormNames(pokemon)

  await assertNoErrors()

  await db.transaction(async tx => {
    await load.types(tx, types)
    await load.moves(tx, moves)
    await load.pokemonSpecies(tx, pokemonSpecies)
    await load.pokemon(tx, pokemon, formNames)
  })
}

etl()
  .catch(err => {
    console.error("ETL failed: ", err)
    process.exitCode = 1
  })
  .finally(async () => {
    await closeDb()
  })
