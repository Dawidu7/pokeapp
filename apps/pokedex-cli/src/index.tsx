import { Box, Text, render, useApp, useInput } from "ink"
import { useState } from "react"
import { closeDb } from "@poke/db"
import { getPokemonList } from "@poke/queries"
import { List } from "./list"

function App({
  pokemonList,
}: {
  pokemonList: Awaited<ReturnType<typeof getPokemonList>>
}) {
  const { exit } = useApp()
  useInput((input, key) => {
    if (input === "q") exit()
  })

  const [selected, setSelected] = useState(pokemonList[0]!)

  const legend = ["⇅ - scroll list", "⇄ - scroll forms", "q - quit"]

  return (
    <Box flexDirection="column" gap={1}>
      <Box>
        <Box>
          <List
            items={pokemonList.map(p => ({
              label: p.name,
              key: p.slug,
              value: p,
            }))}
            onChange={p => setSelected(p)}
            limit={10}
          />
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
      <Text>{legend.filter(Boolean).join(" | ")}</Text>
    </Box>
  )
}
const pokemonList = await getPokemonList()
const { waitUntilExit } = render(<App pokemonList={pokemonList} />)

await waitUntilExit()
await closeDb()
process.exit(0)
