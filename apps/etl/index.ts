import PQueue from "p-queue"
import type z from "zod"
import { buildConflictUpdateSet, closeDb, db, tables } from "@poke/db"
import * as schemas from "./schema"

/** Extracts and normalizes data from PokéAPI given a Zod schema. */
async function extract<T extends z.ZodType>(endpoint: string, schema: T) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/${endpoint}?limit=100000`,
  )

  if (!response.ok)
    throw new Error(
      `Failed to fetch list for '${endpoint}': ${response.status}`,
    )

  const urls = schemas.ResourceListSchema.parse(await response.json())

  const q = new PQueue({
    concurrency: 15,
    interval: 500,
    intervalCap: 30,
  })

  let completed = 0
  const results = await Promise.allSettled(
    urls.map(url =>
      q.add(async () => {
        try {
          const res = await fetch(url)
          if (!res.ok)
            throw new Error(`Failed to process resource: ${res.status}`)
          return schema.parse(await res.json())
        } finally {
          completed++
          process.stdout.write(`\r${completed}/${urls.length}`)
        }
      }),
    ),
  )
  process.stdout.write("\n")

  const failed = results.flatMap((result, i) => {
    if (result.status === "fulfilled") return []

    return [
      {
        url: urls[i],
        error:
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason),
      },
    ]
  })

  if (failed.length) {
    console.warn(`Failed to fetch ${failed.length} resources`)
    console.warn(failed)
  }

  return results
    .filter(result => result.status === "fulfilled")
    .map(({ value }) => value)
}

async function etl() {
  const types = await extract("type", schemas.TypeSchema)
  const moves = await extract("move", schemas.MoveSchema)

  await db.transaction(async tx => {
    await tx
      .insert(tables.types)
      .values(types.map(({ id, slug, name }) => ({ id, slug, name })))
      .onConflictDoUpdate({
        target: tables.types.id,
        set: buildConflictUpdateSet(tables.types),
      })

    await tx
      .insert(tables.typeEffectivenesses)
      .values(types.flatMap(({ damageRelations }) => damageRelations))
      .onConflictDoUpdate({
        target: [
          tables.typeEffectivenesses.attackerId,
          tables.typeEffectivenesses.defenderId,
        ],
        set: buildConflictUpdateSet(tables.typeEffectivenesses, [
          "attackerId",
          "defenderId",
        ]),
      })

    await tx
      .insert(tables.moves)
      .values(moves)
      .onConflictDoUpdate({
        target: tables.moves.id,
        set: buildConflictUpdateSet(tables.moves),
      })
  })
}

etl()
  .catch(err => {
    console.error("ETL failed: ", err)
    process.exit(1)
  })
  .finally(async () => {
    await closeDb()
    process.exit(0)
  })
