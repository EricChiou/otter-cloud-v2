module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // 關閉斷行規則，在 windows 及 linux 中開發會有不同的斷行符號，因此關閉此規則
    'linebreak-style': ['off'],

    // 開啟多行末尾逗號規則
    'comma-dangle': ['error', 'always-multiline'],

    // code 單行最大長度建議為 120 個字
    'max-len': ['error', { 'code': 120 }],

    // 單檔最大行數限制為 500 行，建議範圍為 100 ~ 500
    'max-lines': ['error', 300],

    // 箭頭函式規則，使用 'always' 規則
    'arrow-parens': ['error', 'always'],

    // 禁止對函式參數再賦予值，但是對 object 內的資料可以再賦予值
    'no-param-reassign': ['error', { 'props': false }],

    // 換行時將操作符放在行末
    'operator-linebreak': ['error', 'before'],

    // 行末加上分號
    'semi': ['error', 'always'],

    // 不要有多餘的分號
    'no-extra-semi': 'error',

    // 字串使用單引號
    'quotes': ['error', 'single'],

    // Function 後的括號是否要有空格
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always',
    }],

    // 不要有 tab, 用空格取代 tab
    'no-tabs': ['error'],

    // 行末不要出現空格
    'no-trailing-spaces': 'error',

    // 巢狀 code 不要超過 4 層
    'max-depth': ['error', 4],

    // react
    'react-hooks/exhaustive-deps': 'off',
  },
}
