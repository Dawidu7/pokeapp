import { getTableColumns, sql } from "drizzle-orm"
import { type AnyPgTable } from "drizzle-orm/pg-core"

export function createConflictUpdateSet<
  T extends AnyPgTable,
  K extends keyof T["_"]["columns"],
>(table: T, excluded: K[] = ["id" as K]) {
  const columns = getTableColumns(table)
  return Object.fromEntries(
    Object.entries(columns)
      .filter(([name]) => !excluded.includes(name as K))
      .map(([name, col]) => [name, sql.raw(`excluded.${col.name}`)]),
  )
}
