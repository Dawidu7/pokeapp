import env from "./env"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const client = postgres(env.DATABASE_URL)
const db = drizzle({ client, schema })

const closeDb = async () => await client.end()

export { db, closeDb, schema }
export * from "./utils"
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]
