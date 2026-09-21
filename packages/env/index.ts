import { config } from "dotenv"
import path from "node:path"
import { fileURLToPath } from "node:url"
import * as z from "zod"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, "../../.env") })

export function createEnv<T extends z.ZodRawShape>(
  shape: T | ((_z: typeof z) => T),
) {
  const schema = z.object(typeof shape === "function" ? shape(z) : shape)
  const env = schema.safeParse(process.env)

  if (!env.success) {
    console.error(env.error)
    process.exit(1)
  }

  return env.data
}
