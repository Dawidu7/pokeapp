import PQueue from "p-queue"
import type z from "zod"
import { type Pokemon, PokemonFormSchema, ResourceListSchema } from "./schema"

const q = new PQueue({
  concurrency: 15,
  interval: 500,
  intervalCap: 30,
})

async function fetchQueue<T extends z.ZodType>(
  urls: string[],
  schema: T,
  label?: string,
) {
  if (label) console.log(`Fetching '${label}'..`)

  let completed = 0
  const results = await Promise.allSettled(
    urls.map(url =>
      q.add(async () => {
        try {
          const res = await fetch(url)
          if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
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
  }

  return results
    .filter(result => result.status === "fulfilled")
    .map(({ value }) => value)
}

export async function extract<T extends z.ZodType>(
  endpoint: string,
  schema: T,
) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/${endpoint}?limit=100000`,
  )

  if (!response.ok)
    throw new Error(
      `Failed to fetch list for '${endpoint}': ${response.status}`,
    )

  const urls = ResourceListSchema.parse(await response.json())

  return await fetchQueue(urls, schema, endpoint)
}

export async function getFormNames(_pokemon: Pokemon[]) {
  const pokemon = _pokemon.filter(p => !p.isDefault)
  const names = await fetchQueue(
    pokemon.map(({ formUrl }) => formUrl),
    PokemonFormSchema,
    "form",
  )

  const formNames = new Map<number, string | null>()
  pokemon.forEach((p, i) => formNames.set(p.id, names[i] ?? null))

  return formNames
}

export type FormNames = Awaited<ReturnType<typeof getFormNames>>
