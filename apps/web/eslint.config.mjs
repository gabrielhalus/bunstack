import createConfig from "@bunstack/eslint-config/create-config";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default createConfig({
  react: true,
  ignores: ["src/routeTree.gen.ts", "src/components/ui"],
}, {
  plugins: {
    "@tanstack/query": pluginQuery,
  },
  rules: {
    "antfu/top-level-function": "off",
    "@tanstack/query/exhaustive-deps": "error",
    "unicorn/filename-case": ["error", {
      case: "kebabCase",
      ignore: ["README.md", "~__root.tsx"],
    }],
  },
});
