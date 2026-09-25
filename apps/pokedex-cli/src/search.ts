type Filters = {
  search: string
}

type PrefixHandler = (value: string, filters: Filters) => void

const PREFIXES: Record<string, PrefixHandler> = {}

export function parseQuery(query: string) {
  const tokens = query.toLowerCase().trim().split(/\s+/)
  const filters: Filters = {
    search: "",
  }

  for (const token of tokens) {
    const prefix = Object.entries(PREFIXES).find(([prefix]) =>
      token.startsWith(prefix),
    )

    if (prefix) {
      const [key, handler] = prefix
      handler(token.slice(key.length), filters)
    } else filters.search ||= token
  }

  return filters
}

export function score(query: string, target: string, strict = false) {
  const q = query.toLowerCase()
  const t = target.toLowerCase()

  if (t === q) return 3
  if (t.startsWith(q)) return 2
  if (strict) return 0
  if (t.includes(q)) return 1
  return 0
}
