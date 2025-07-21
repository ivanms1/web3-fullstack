import { nextJsConfig } from "@repo/eslint-config/next-js";
import globals from "globals";

/** @type {import("eslint").Linter.Config} */
export default [
    ...nextJsConfig,
    {
        files: ["**/*.test.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}", "jest.setup.cjs"],
        languageOptions: {
            globals: {
                ...globals.jest,
                ...globals.browser,
            },
        },
        rules: {
            // Disable some rules for test files
            "@typescript-eslint/no-require-imports": "off",
            "no-undef": "off", // Jest globals are handled by globals.jest
        },
    },
];
