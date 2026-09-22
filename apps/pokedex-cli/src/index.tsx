import { Box, render, useApp, useInput } from "ink"
import SelectInput from "ink-select-input"
import { closeDb } from "@poke/db"
import { getPokemonList } from "@poke/queries"

function App({
  pokemonList,
}: {
  pokemonList: Awaited<ReturnType<typeof getPokemonList>>
}) {
  const { exit } = useApp()
  useInput((input, key) => {
    if (input === "q") exit()
  })

  return (
    <Box>
      <SelectInput
        items={pokemonList.map(p => ({
          label: p.name,
          value: p,
          key: p.slug,
        }))}
        limit={15}
      />
    </Box>
  )
}

const pokemonList = await getPokemonList()
const { waitUntilExit } = render(<App pokemonList={pokemonList} />)

await waitUntilExit()
await closeDb()
