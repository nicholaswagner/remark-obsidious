import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default [
    { files: ["**/*.{md,ts,tsx}"] },
    ...tseslint.configs.recommended,
    {
        plugins: {
            "simple-import-sort": simpleImportSortPlugin,
        },
        rules: {
            "prefer-const": "warn",
            "prefer-spread": "warn",
            "simple-import-sort/exports": "error",
            "simple-import-sort/imports": "error",
            "@typescript-eslint/no-unused-vars": ["error", { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_" }],
        },
        settings: {
            "import/resolver-next": [
                createTypeScriptImportResolver({
                    alwaysTryTypes: true,
                }),
            ]
        }
    },
];