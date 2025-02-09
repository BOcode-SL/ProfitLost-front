// Importing necessary modules for ESLint configuration
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

// Exporting the ESLint configuration
export default tseslint.config(
  { ignores: ['dist'] }, // Ignoring the 'dist' directory
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended], // Extending recommended configurations
    files: ['**/*.{ts,tsx}'], // Targeting TypeScript files
    languageOptions: {
      ecmaVersion: 2020, // Setting ECMAScript version
      globals: globals.browser, // Defining global variables for the browser
    },
    plugins: {
      'react-hooks': reactHooks, // Adding React Hooks plugin
      'react-refresh': reactRefresh, // Adding React Refresh plugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules, // Using recommended rules from React Hooks
      'react-refresh/only-export-components': [
        'warn', // Warning for only exporting components
        { allowConstantExport: true }, // Allowing constant exports
      ],
    },
  },
)
