import eslint from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import reactCompilerPlugin from 'eslint-plugin-react-compiler';
import hooksPlugin from 'eslint-plugin-hooks';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: true,
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin,
      'react-refresh': reactRefreshPlugin,
      'react-compiler': reactCompilerPlugin,
      hooks: hooksPlugin,
    },
    rules: {
      ...tsPlugin.configs['strict-type-checked'].rules,
      ...tsPlugin.configs['stylistic-type-checked'].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      'no-redeclare': 'off',
      'hooks/sort': [
        2,
        {
          groups: [
            'useNavigate',
            'useIsLandscape',
            'useSaveId',
            'usePreventKeys',
            'useContext',
            'useGetSizesContext',
            'useShowToast',
            'useMainStore',
            'useShallowMainStore',
            'useAtom',
            'useAtomValue',
            'useSetAtom',
            'useGetSelectedId',
            'useIsCurrentTextSelected',
            'useRef',
            'useState',
            'useForm',
            'useMemo',
            'useCallback',
            'useEffect',
          ],
        },
      ],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'import/order': [
        'error',
        {
          'newlines-between': 'always-and-inside-groups',
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
        },
      ],
      'jsx-a11y/no-autofocus': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-duplicate-type-constituents': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/prefer-literal-enum-member': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        {
          ignoreConditionalTests: true,
          ignorePrimitives: { string: true },
        },
      ],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowNullableBoolean: true,
          allowNullableString: true,
          allowNullableNumber: false,
          allowNullableEnum: true,
          allowAny: true,
        },
      ],
      'react-compiler/react-compiler': [
        'error',
        {
          reportableLevels: ['InvalidReact'],
          __unstable_donotuse_reportAllBailouts: true,
        },
      ],
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
          moduleDirectory: ['node_modules', './src/'],
        },
      },
    },
  },
  {
    ignores: ['dist', 'eslint.config.js', 'vite.config.ts'],
  },
];
