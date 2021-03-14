import { paramCase } from "change-case"

export const dataset = (obj: {
  [key: string]: string | boolean
}): { [key: string]: string } => {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, value]) => {
        if (!value) return
        return [`--data-${paramCase(key)}`, String(value)]
      })
      .filter((nullable) => nullable != null)
  )
}
