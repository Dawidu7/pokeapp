import { Box, Text, useInput } from "ink"
import { useState } from "react"

type ListProps<T> = {
  items: { label: string; key: string; value?: T }[]
  limit: number
  horizontal?: boolean
  highlightColor?: string
  onChange?: (value: T) => void
}

export function List<T>({ items, limit, horizontal, onChange }: ListProps<T>) {
  const [{ currentIndex, offset }, setState] = useState({
    currentIndex: 0,
    offset: 0,
  })

  const windowSize = limit ?? items.length

  useInput((_, key) => {
    const direction =
      (horizontal && key.rightArrow) || (!horizontal && key.downArrow)
        ? 1
        : (horizontal && key.leftArrow) || (!horizontal && key.upArrow)
          ? -1
          : 0

    if (direction === 0) return

    const nextIndex = Math.max(
      0,
      Math.min(items.length - 1, currentIndex + direction),
    )

    if (nextIndex === currentIndex) return

    let nextOffset = offset
    if (nextIndex >= offset + windowSize)
      nextOffset = nextIndex - windowSize + 1
    else if (nextIndex < offset) nextOffset = nextIndex

    const nextValue = items[nextIndex]?.value
    if (nextValue !== undefined) onChange?.(nextValue)

    setState({ currentIndex: nextIndex, offset: nextOffset })
  })

  const window = items.slice(offset, offset + windowSize)

  return (
    <Box
      flexDirection={horizontal ? "row" : "column"}
      gap={horizontal ? 1 : undefined}
    >
      {window.map(({ label, key }, i) => {
        const isSelected = currentIndex - offset === i
        const isScrollablePrev = i === 0 && offset > 0
        const isScrollableNext =
          i === window.length - 1 && offset + windowSize < items.length

        return (
          <Box key={key}>
            {horizontal ? (
              <Text dimColor>{isScrollablePrev ? "← " : "  "}</Text>
            ) : (
              <Text dimColor>
                {isScrollablePrev ? "↑ " : isScrollableNext ? "↓ " : "  "}
              </Text>
            )}
            <Box width={15}>
              <Text dimColor={!isSelected} underline={horizontal && isSelected}>
                {!horizontal && isSelected ? "> " : ""}
                {label}
              </Text>
            </Box>
            {horizontal && (
              <Text dimColor>{isScrollableNext ? "  →" : ""}</Text>
            )}
          </Box>
        )
      })}
    </Box>
  )
}
