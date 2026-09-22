import { Text, render } from "ink"
import { closeDb } from "@poke/db"

function App() {
  return <Text>Hello World.</Text>
}

const { waitUntilExit } = render(<App />)

await waitUntilExit()
await closeDb()
