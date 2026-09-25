import { Box, Text, useApp, useInput } from "ink"
import TextInput from "ink-text-input"
import { useRef, useState } from "react"

type InputProps = {
  query: string
  onSearchChange: (value: string) => void
}

export function Input({ query, onSearchChange }: InputProps) {
  const [isSearching, setIsSearching] = useState(false)
  const prevQuery = useRef(query)
  const { exit } = useApp()

  useInput(
    (_, key) => {
      if (key.return) setIsSearching(false)
      if (key.escape) {
        setIsSearching(false)
        onSearchChange(prevQuery.current)
      }
    },
    { isActive: isSearching },
  )

  useInput(
    input => {
      if (input === "q") exit()

      if (input === "s") {
        prevQuery.current = query
        setIsSearching(true)
      }
      if (input === "x") onSearchChange("")
    },
    { isActive: !isSearching },
  )

  if (isSearching)
    return (
      <Box flexDirection="column">
        <Box>
          <Text>Search: </Text>
          <TextInput value={query} onChange={onSearchChange} />
        </Box>
        <Text>Enter - submit | Esc - cancel</Text>
      </Box>
    )

  return (
    <Box flexDirection="column">
      <Text> </Text>
      <Text>
        {[
          "⇅ - scroll list",
          "⇄ - scroll forms",
          "s - search",
          "x - clear",
          "q - quit",
        ].join(" | ")}
      </Text>
    </Box>
  )
}
