import createConfig from "@bunstack/eslint-config/create-config";

export default createConfig({
  rules: {
    "unicorn/filename-case": ["error", {
      case: "kebabCase",
    }],
  },
});
