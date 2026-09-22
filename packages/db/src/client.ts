import env from "./env"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as _schema from "./schema"

const { relations, ...schema } = _schema

const client = postgres(env.DATABASE_URL)
const db = drizzle({ client, relations })

const closeDb = async () => await client.end()

export { db, closeDb, schema }
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]
