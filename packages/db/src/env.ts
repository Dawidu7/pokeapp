import { createEnv } from "@poke/env"

const env = createEnv(z => ({ DATABASE_URL: z.string() }))
export default env
