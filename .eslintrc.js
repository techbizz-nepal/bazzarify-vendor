// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  ignorePatterns: ["/dist/*", "/*.config.js", "/*.config.ts", "/*-env.d.ts"],
  rules: {
    "prettier/prettier": "error",
  },
};
