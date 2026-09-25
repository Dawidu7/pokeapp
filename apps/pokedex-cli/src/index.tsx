import { Box, Text, render } from "ink"
import { useState } from "react"
import { closeDb } from "@poke/db"
import { type Pokemon, getPokemonList } from "@poke/queries"
import { Input } from "./input"
import { List } from "./list"
import { parseQuery, score } from "./search"

const LIST_SIZE = 10

function App({ pokemonList }: { pokemonList: Pokemon[] }) {
  const [query, setQuery] = useState("")
  const filters = parseQuery(query)
  const filtered = pokemonList
    .filter(p => {
      return true
    })
    .map(p => ({ item: p, score: score(filters.search, p.name) }))
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(p => p.item)

  const [selected, setSelected] = useState(filtered[0]!)

  return (
    <Box flexDirection="column" gap={1}>
      <Box>
        <Box height={LIST_SIZE}>
          {filtered.length > 0 ? (
            <List
              items={filtered.map(p => ({
                label: p.name,
                key: p.slug,
                value: p,
              }))}
              onChange={p => setSelected(p)}
              limit={LIST_SIZE}
            />
          ) : (
            <Text> No Pokémon Found</Text>
          )}
        </Box>
        <Box flexDirection="column">
          <List
            key={selected.slug}
            items={selected.pokemon.map(p => ({
              label: p.formName ?? "Default",
              key: p.id.toString(),
              value: p,
            }))}
            limit={3}
            horizontal
          />
        </Box>
      </Box>
      <Input query={query} onSearchChange={setQuery} />
    </Box>
  )
}
const pokemonList = await getPokemonList()
const { waitUntilExit } = render(<App pokemonList={pokemonList} />)

await waitUntilExit()
await closeDb()
process.exit(0)
