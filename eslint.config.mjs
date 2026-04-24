import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";
import paths from "eslint-plugin-paths";

const eslintConfig = [
  { ignores: ["src/components/editor/**"] },
  ...coreWebVitals,
  ...typescript,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      paths,
    },
    rules: {
      "paths/alias": "error",
    },
  },
];

export default eslintConfig;
