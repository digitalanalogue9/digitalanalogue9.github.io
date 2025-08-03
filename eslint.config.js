// eslint.config.js (flat-config, ESLint v8+)
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  // Ignore built output and misc files
  globalIgnores(['dist', 'coverage']),

  {
    files: ['**/*.{ts,tsx}'],

    // ➊ Plugins
    plugins: {
      react,
      '@typescript-eslint': tseslint.plugin,
    },

    // ➋ Base configs (order matters → prettier last)
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      prettier, // must be last to override formatting rules
    ],

    // ➌ Parser / env
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    // ➍ React settings
    settings: {
      react: { version: 'detect' },
    },

    // ➎ Rule tweaks
    rules: {
      // React specifics
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // TypeScript: relax noisy rules you don’t need
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
    },
  },
])
