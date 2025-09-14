import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  // Targeted rule overrides for infra and API layers to reduce lint noise
  {
    files: [
      "src/lib/api/**/*.ts",
      "src/lib/utils/**/*.ts",
      "src/lib/interfaces/**/*.ts",
      "src/lib/auth/**/*.ts",
      "src/hooks/api-hooks.ts",
    ],
    rules: {
      // Many infrastructure boundaries use generics/unknown backends
      // Keep app code strict; relax here only
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // React hook deps warnings are sometimes false positives in infra hooks
  {
    files: ["src/hooks/**/*.ts", "src/hooks/**/*.tsx"],
    rules: {
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
