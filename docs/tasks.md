# Bazzarify Vendor – Improvement Tasks Checklist

Note: Check each item as you complete it. Tasks are ordered from foundational hygiene to deeper architectural work and product features.

1. [ ] Repository hygiene and documentation
   - [ ] Expand README.md to include project-specific context from .junie/guidelines.md (runtime, scripts, envs, images config, testing approaches) and link to docs/ index. 
   - [ ] Add CONTRIBUTING.md with Bun-first workflow, commit conventions, and testing instructions.
   - [ ] Add .editorconfig to align indentation, EOL, and trailing whitespace across IDEs.
   - [ ] Create docs/architecture.md describing module boundaries (core, guest, product.management), server/client separation, and request/response flow.
   - [ ] Create docs/testing.md with Bun/Vitest recipes and path alias setup guidance.

2. [ ] TypeScript and configuration hardening
   - [ ] Review tsconfig.json for allowJs=true; consider disabling to keep TS-only code unless JS files are intentional.
   - [ ] Ensure strict moduleResolution: bundler works with all tooling; document caveats in docs/testing.md.
   - [ ] Enforce noImplicitAny boundaries by adding explicit return types for all public functions and hooks (audit src/modules/**). 

3. [ ] Axios configuration and headers
   - [ ] Merge default headers with Authorization in authAxiosInstance to preserve X-APP-Key and Content-Type (currently overridden at src/modules/core/lib/utils.axios.ts, lines 36–39).
   - [ ] Unit-test defaultAxiosInstance/authAxiosInstance baseURL and header propagation given API_URL and APP_KEY.
   - [ ] Confirm 401 handling path deletes session and redirects; add negative tests to ensure we don’t swallow errors before the interceptor.

4. [ ] Error handling consistency
   - [ ] Unify handleUnknownError and handleRemoteError to a single consistent shape that returns IMetaData while preserving backend message/errorCode when present (src/modules/core/lib/utils.index.ts).
   - [ ] Standardize server action pattern: ApiResponse<T> parsing, metaData.error short-circuit, else return data.payload (audit all actions under src/modules/**/actions/).
   - [ ] Replace console.log debugging in actions with a structured logger or remove (e.g., actionStoreProducts logs payload at src/modules/product.management/actions/product.ts line 85).

5. [ ] Server actions and boundaries
   - [ ] Audit all server-only modules to begin with "use server" and ensure no client-side imports leak in; conversely, do not call authAxiosInstance from client components/hooks.
   - [ ] For any client-side API calls required, route via Next route handlers or server actions and revalidate from client as needed.

6. [ ] Environment variables and config
   - [ ] Document API_URL and APP_KEY usage in README.md, including dev defaults and examples.
   - [ ] Validate presence of API_URL during build/start; fail fast with clear error if missing.
   - [ ] Add runtime warning when APP_KEY is not set (if backend expects it) and ensure it’s sent via axios headers.
   - [ ] Align next.config.ts allowedDevOrigins with local dev proxy domains; document how to extend.

7. [ ] Images and uploads
   - [ ] Confirm next.config.ts images.remotePatterns include all needed hosts; add tests or lint rule to prevent regressions when adding external hosts.
   - [ ] Enforce IMAGE_CONSTANTS (MIN/MAX_DIMENSION, MAX_PRODUCT_IMAGES_COUNT, MAX_VARIANT_IMAGE_COUNT) across UI validations; ensure validateImage is used consistently.
   - [ ] Add file size/MIME type checks in addition to dimensions where relevant (validateImage currently checks MIME type prefix only).

8. [ ] Product variants contract and form serialization
   - [ ] Verify slugging + key join contract remains stable: slugify attribute keys and join combos with "|" (src/modules/product.management/utils/productForm.ts). Document server expectations in docs/architecture.md.
   - [ ] Ensure appendFormDataVariants only appends File instances (current behavior) and never existing URLs/ids; add tests to prevent regressions.
   - [ ] Confirm availability flag is serialized as "1" | "0" and audited across create/update flows.

9. [ ] Hooks and client code quality
   - [ ] Remove console.log statements from hooks (e.g., console.log in useCreateProduct at lines ~91, and AxiosError logs) or gate behind a debug flag.
   - [ ] Memoize expensive computations in hooks (variant combinations, columns reorder) and ensure stable references for callbacks to minimize rerenders.
   - [ ] Add explicit return types for hooks (useCreateProduct, useUpdateProduct, etc.) and narrow any/unknown in catch branches immediately.

10. [ ] Validation and schemas
    - [ ] Extend/Create Zod schemas for all forms (CreateProductSchema and UpdateProductSchema already referenced) and validate before network calls.
    - [ ] Provide user-friendly error aggregation and field mapping in forms.

11. [ ] React Query and data fetching
    - [ ] Introduce/reactivate @tanstack/react-query patterns where appropriate with stable query keys and cache invalidation on mutations.
    - [ ] Co-locate query key factory and type-safe fetchers per feature module.

12. [ ] Routing, errors, and UX
    - [ ] Implement shared error boundaries and loading UI in App Router (error.tsx, loading.tsx per route segment).
    - [ ] Provide standardized toast/error summarization for IMetaData.error across the app.

13. [ ] Security and sanitization
    - [ ] Sanitize or carefully encode HTML produced by lexicalJsonToHtml; ensure no XSS vectors in rich text rendering.
    - [ ] Consider adding basic Content Security Policy (CSP) via headers or middleware; document in README.
    - [ ] Ensure cookies/session tokens are HttpOnly, Secure, SameSite=Strict where applicable.

14. [ ] Performance and bundle health
    - [ ] Audit bundle size; leverage Next dynamic imports for heavy components (rich text editor, md editor, quill, lexical) on demand.
    - [ ] Verify Turbopack dev ergonomics; ensure no commonjs/esm pitfalls (libraries like jose, axios, lexical mix).
    - [ ] Add image optimization hints and proper sizes for next/image usage.

15. [ ] Testing strategy
    - [ ] Add Bun tests for pure utilities (e.g., productForm: isValidVariant, updateVariantValidity, createVariantsPayload, appendFormDataVariants file-only behavior).
    - [ ] Add minimal Vitest + jsdom for React components if/when component tests are needed; configure @ alias resolution.
    - [ ] Wire tests into CI (bun test or bun run test for Vitest).

16. [ ] Linting/formatting and pre-commit
    - [ ] Expand ESLint rules to include import/no-cycle and eslint-plugin-security as applicable; ensure next/typescript integration remains.
    - [ ] Configure lint-staged + simple pre-commit hook to run prettier and eslint on changed files.

17. [ ] Docker and deployment
    - [ ] Add Docker HEALTHCHECK and document necessary envs in Docker section.
    - [ ] Verify standalone output works with server actions and correct baseURL at runtime.

18. [ ] Dead code and dependency audit
    - [ ] Scan for unused exports and dead code paths (e.g., redundant utils, legacy routes); remove or deprecate.
    - [ ] Audit dependencies for unused packages and security updates; pin critical versions where necessary.

19. [ ] Observability and logging
    - [ ] Introduce a lightweight logger utility with log levels (debug/info/warn/error) configurable via env, replacing console.log across the codebase.
    - [ ] Add minimal request/response tracing for server actions (without leaking PII) to aid debugging.

20. [ ] Immediate quick wins (small PRs)
    - [ ] Remove console.log from actionStoreProducts (src/modules/product.management/actions/product.ts line 85).
    - [ ] Improve authAxiosInstance to merge default headers with Authorization (utils.axios.ts lines 36–39) to avoid dropping X-APP-Key.
    - [ ] Replace generic catch toasts with friendly messages and link to support page where relevant.
