import * as z from "zod"

export const ApiResourceSchema = z
  .object({ url: z.url() })
  .transform(({ url }) => {
    const id = Number(url.split("/").filter(Boolean).at(-1))
    if (!id) throw new Error(`Could not extract ID from url`)
    return id
  })

export const NamedApiResourceSchema = z
  .object({ name: z.string() })
  .transform(({ name }) => name)

export const UrlApiResourceSchema = z
  .array(z.object({ url: z.url() }))
  .transform(urls => urls.map(({ url }) => url))

export const NameSchema = z
  .array(z.object({ name: z.string(), language: NamedApiResourceSchema }))
  .transform(names => names.find(({ language }) => language === "en")?.name)

export const ResourceListSchema = z
  .object({
    results: UrlApiResourceSchema,
  })
  .transform(({ results }) => results)
