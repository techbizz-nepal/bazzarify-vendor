This is a [Next.js](https://nextjs.org) project.

## Getting Started (Bun)

Install dependencies (uses bun.lock):

```bash
bun install
```

Run the development server (Turbopack enabled by default):

```bash
bun run dev
```

Build for production:

```bash
bun run build
```

Start the production server:

```bash
bun run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Docker

A multi-stage Docker build based on `oven/bun:1` is provided. Build and run:

```bash
docker build -t bazzarify-vendor .
docker run -p 3000:3000 --env API_URL=... --env APP_KEY=... bazzarify-vendor
```

For more details, see `.junie/guidelines.md`.
