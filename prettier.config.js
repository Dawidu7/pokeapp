/** @type {import("prettier").Config & import("@trivago/prettier-plugin-sort-imports").PluginConfig} */
const config = {
  arrowParens: "avoid",
  semi: false,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: ["^(.*)/env$", "<THIRD_PARTY_MODULES>", "^@poke/(.*)$", "^[./]"],
  importOrderSortSpecifiers: true,
}

export default config
