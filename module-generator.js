/* eslint-disable @typescript-eslint/no-require-imports */
// create-module.js
const fs = require("fs");
const path = require("path");

const moduleName = process.argv[2];

if (!moduleName) {
  console.error(
    "Module name not provided. Usage: npm run create-module <module-name>",
  );
  process.exit(1);
}

function createModule(moduleName) {
  const modulePath = path.join(__dirname, "src/modules", moduleName);
  fs.mkdirSync(modulePath);

  const structure = [
    { path: "data/", file: "[module]-service.ts" },
    { path: "data/", file: "[module]-endpoints.ts" },
    { path: "domain/types", file: "[module].d.ts" },
    { path: "domain/", file: "[module]-actions.ts" },
    { path: "presentation/components" },
    { path: "presentation/components/client" },
    { path: "presentation/components/server" },
    { path: "presentation/pages", file: "[module]-page.tsx" },
    { path: "presentation/hooks", file: "use-[module].ts" },
    { path: "presentation/atoms", file: "[module]-atom.ts" },
  ];

  structure.forEach((folder) => {
    const folderPath = path.join(modulePath, folder.path);
    fs.mkdirSync(folderPath, { recursive: true });

    if (folder.file) {
      const filename = folder.file.replace("[module]", moduleName);
      const filePath = path.join(folderPath, filename);
      fs.writeFileSync(filePath, "");
    }
  });
}

createModule(moduleName);
