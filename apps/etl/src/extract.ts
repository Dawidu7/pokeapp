import PQueue from "p-queue"
import z from "zod"
import { type Pokemon, PokemonFormSchema, ResourceListSchema } from "./schema"

const ERROR_FILENAME = "errors.json"

export async function assertNoErrors() {
  const file = Bun.file(ERROR_FILENAME)
  if (await file.exists())
    throw new Error(`Solve all issues and delete ${ERROR_FILENAME}`)
}

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

    const reason = result.reason
    return [
      {
        url: urls[i],
        error:
          reason instanceof z.ZodError
            ? reason.issues
            : reason instanceof Error
              ? reason.message
              : String(reason),
      },
    ]
  })

  if (failed.length) {
    const file = Bun.file(ERROR_FILENAME)
    const errors = (await file.exists()) ? await file.json() : []
    await Bun.write(
      ERROR_FILENAME,
      JSON.stringify([...errors, ...failed], null, 2),
    )
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
  names.forEach(({ pokemonId, name }) => formNames.set(pokemonId, name))

  return formNames
}

export type FormNames = Awaited<ReturnType<typeof getFormNames>>
