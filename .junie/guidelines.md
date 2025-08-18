# Project Development Guidelines (Bazzarify Vendor)

Audience: Advanced developers working on this codebase. This document captures project-specific practices and decisions so you can be productive quickly without rediscovering context.

## Build and Configuration

- Package manager/runtime: Bun 1.x is the first-class runtime for CI/Docker. Node.js >= 20 is supported locally (Next.js 15). Prefer Bun for installs and scripts when possible.
  - Install deps: bun install
  - Dev server: bun run dev (Turbopack enabled by default)
  - Build: bun run build
  - Start: bun run start
- Next.js: App Router, TypeScript strict, moduleResolution: bundler, path alias @/* -> src/*.
- Server Actions: enabled with bodySizeLimit 25mb (see next.config.ts). Use "use server" at top of server-only modules.
- Images: next/image remotePatterns allow gw.alicdn.com and local-ne.bazzarify.local:8081. When adding external images, update next.config.ts accordingly.
- API Clients:
  - src/modules/core/lib/utils.axios.ts exports defaultAxiosInstance and authAxiosInstance.
  - Base URL: API_URL env (default http://local-ne.bazzarify.local:8081/api/v1)
  - App key header: APP_KEY env if set.
  - authAxiosInstance adds Bearer token from session; 401 triggers deleteSession() and redirect('/login'). Only call authAxiosInstance in server contexts.
- Docker/Bun image:
  - Multi-stage build in Dockerfile using oven/bun:1; installs with bun, builds with bun run build and runs standalone server with bun.
  - Build image: docker build -t bazzarify-vendor .
  - Run image: docker run -p 3000:3000 --env API_URL=... --env APP_KEY=... bazzarify-vendor

Environment variables
- API_URL: Backend API base (e.g., http://local-ne.bazzarify.local:8081/api/v1)
- APP_KEY: Optional application key header (X-APP-Key)

Notes
- next.config.ts includes allowedDevOrigins for local-ne.* domains. If you rely on CORS or cookies across those domains, keep values aligned with your dev proxy setup.

## Testing

We currently leverage Bun’s built-in test runner for quick JS/TS tests without additional dependencies. For broader TS/React testing, see recommendations below.

Running a simple test (verified)
- One-off example using Bun’s built-in test runner was executed successfully in this environment:
  1) Create tests/demo.test.ts with bun:test (e.g., import { describe, it, expect } from "bun:test").
  2) Run: bun test tests/demo.test.ts
  3) Expected: tests pass. After verification, the tests directory was removed to keep the repo clean.
- Rationale: Demonstrates how to execute tests without adding tools. Works with Bun 1.x.

Recommended testing approaches
- JS/utility tests (no framework): bun test is sufficient for small, framework-agnostic checks.
- TypeScript tests:
  - Option A (recommended): use Bun’s built-in runner directly (bun test) — Bun transpiles TS out of the box.
  - Option B: Vitest for unit tests and good TS/React support.
    - Install: bun add -d vitest @vitest/ui @vitejs/plugin-react jsdom @types/jsdom
    - Add scripts: {
        "test": "vitest run",
        "test:ui": "vitest"
      }
    - Configure vite/vitest if importing via @/* (use tsconfig paths plugin or alias config).
  - Option C: Jest if required by the org. Prefer Vitest for speed and ESM harmony with Next 15.
- React component tests:
  - Use @testing-library/react with jsdom when adopting Vitest/Jest.
  - For App Router server components, prefer integration/e2e where practical; server actions can be exercised via route handlers or API mocks.

Conventions for writing tests
- Keep tests colocated under tests/ mirroring src/ structure; suffix .test.ts(x).
- Use constants instead of magic strings in assertions when those constants exist in src (e.g., IMAGE_CONSTANTS).
- For modules using path alias @/*, ensure the test runner resolves paths (tsx loader or vitest alias).
- Avoid testing implementation details (private shapes); test observable behavior and API types.

CI considerations
- Bun’s test runner works out-of-the-box. For TS/React tests with Vitest, ensure Bun installs dev deps and CI invokes bun run test or bun test as appropriate.

## Code Style and Architecture

TypeScript/ESM
- strict: true; strongly type all boundaries and return types. Avoid any and unknown unless narrowing follows immediately.
- Path alias @/*: prefer absolute imports from src/. Don’t import across feature modules bypassing their public index unless justified.

HTTP/Server actions
- Always use authAxiosInstance within server-only code (files beginning with "use server"). Don’t call it from client components.
- Pattern used in actions:
  - Call API
  - Parse as ApiResponse<T>
  - If metaData.error present, return IMetaData { error }
  - Else return data.payload
  - On catch, return handleUnknownError(error)
- Follow the pattern for new actions to keep error-handling predictable and type-safe.

Constants over magic strings
- Use existing constants (e.g., IMAGE_CONSTANTS for dimensions/file size limits; PRODUCT_MANAGEMENT_ROUTES for API endpoints) instead of inlining strings.
- When adding new limits or keys, add them under an appropriate config/constants module.

FormData and file handling
- appendFormDataVariants only appends File instances to avoid re-sending existing URLs/ids. Maintain this behavior on updates to prevent backend duplication.
- Ensure availability flag is serialized as "1" | "0" (string) for server expectations.

Slugging and variant keys
- Variant attribute keys are slugified and joined by "|". Keep this contract stable: changes impact client/server mapping and persisted data.

Error handling and redirects
- 401 from backend leads to session deletion and redirect to /login via axios interceptor. Don’t swallow errors before they reach the interceptor.

Lint/Format
- ESLint: next/core-web-vitals + next/typescript via flat config.
- Prettier with plugins: organize-imports and tailwindcss. Use format:write and format:check scripts.

Bun-first workflow
- Use bun install to respect bun.lock. Prefer bun run <script>.
- Docker uses bun to build and run the standalone output, matching local bun behavior.

## How to add new tests (suggested workflow)

1. Choose a runner:
   - Quick JS/TS utility: bun test
   - React/DOM-heavy: adopt Vitest (richer), as described above.
2. Create a test file under tests/ following the src path. Example: tests/modules/product.management/utils/productForm.test.ts
3. If using Vitest and importing via @/*, enable path resolution:
   - Set resolve.alias { '@': fileURLToPath(new URL('./src', import.meta.url)) }
4. Run tests: bun test or bun run test.
5. Keep tests deterministic; for file/image code, stub File and DOM globals or run tests under jsdom.

## Verified demo test (now removed to keep repo clean)

- A minimal Bun test at tests/demo.test.ts asserted a couple of pure additions using bun:test. The run output showed passing tests. The tests directory was removed after verification to satisfy repository cleanliness.

## Troubleshooting

- API requests redirect to /login unexpectedly:
  - Ensure a valid session is present and token is available in getSessionPayload().
  - Confirm API_URL points to a reachable backend and CORS is configured for allowedDevOrigins.
- Multipart uploads failing for variants:
  - Check MAX_VARIANT_IMAGE_COUNT and image dimensions in IMAGE_CONSTANTS. validateImage enforces MIN/MAX_DIMENSION and shows toast on failures.
- External images not loading:
  - Add host to next.config.ts images.remotePatterns and restart dev server.