import createConfig from "@bunstack/eslint-config/create-config";

export default createConfig({
  ignores: ["src/db/migrations/*", "public/*"],
});
