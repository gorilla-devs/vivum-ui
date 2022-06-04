module.exports = {
  root: true,
  extends: ["eslint-config-common"],
  plugins: ["import"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx", ".jsx", ".js"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
    },
  },
};
