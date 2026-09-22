import { defineRelations } from "drizzle-orm"
import * as moves from "./moves"
import * as pokemon from "./pokemon"
import * as pokemonSpecies from "./pokemon-species"
import * as types from "./types"

export * from "./moves"
export * from "./pokemon"
export * from "./pokemon-species"
export * from "./types"

export const relations = defineRelations(
  { ...moves, ...pokemon, ...pokemonSpecies, ...types },
  r => ({}),
)
