import drizzle from "eslint-plugin-drizzle";

import createConfig from "@bunstack/eslint-config/create-config";

export default createConfig({
  ignores: ["src/database/migrations/*"],
  plugins: { drizzle },
  rules: {
    ...drizzle.configs.recommended.rules,
  },
});
