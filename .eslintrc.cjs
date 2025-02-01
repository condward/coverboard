module.exports = {
  root: true,
  env: { browser: true, es2024: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:deprecation/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks-addons/recommended-legacy',
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    'vite.config.ts',
    'lib/react-compiler-runtime',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: true,
    tsconfigRootDir: '.',
  },
  plugins: [
    'react-refresh',
    'eslint-plugin-react-compiler',
    'prettier',
    'jsx-a11y',
    'hooks',
  ],
  rules: {
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
          'useGetSelected',
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
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always-and-inside-groups',
        groups: [
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'builtin',
        ],
      },
    ],
    'jsx-a11y/no-autofocus': 0,
    '@typescript-eslint/no-confusing-void-expression': 'OFF',
    '@typescript-eslint/array-type': 'OFF',
    '@typescript-eslint/restrict-template-expressions': 'OFF',
    '@typescript-eslint/no-duplicate-type-constituents': 'OFF',
    '@typescript-eslint/no-misused-promises': 'OFF',
    '@typescript-eslint/unbound-method': 'OFF',
    '@typescript-eslint/no-unsafe-call': 'OFF',
    '@typescript-eslint/prefer-literal-enum-member': 'OFF',
    '@typescript-eslint/no-unsafe-member-access': 'OFF',
    '@typescript-eslint/prefer-nullish-coalescing': [
      'error',
      {
        ignoreConditionalTests: true,
        ignorePrimitives: {
          string: true,
        },
      },
    ],
    'react-refresh/only-export-components': [
      'warn',
      {
        allowConstantExport: true,
      },
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
        reportableLevels: new Set(['InvalidReact']),
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
};
