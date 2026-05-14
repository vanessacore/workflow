This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

This repo ships with a GitHub Actions workflow (`.github/workflows/deploy-vercel.yml`) that deploys to Vercel automatically:

- **Push to `main`** → production deploy
- **Pull request to `main`** → preview deploy (URL posted as a PR comment)
- **Manual** → run the workflow via the Actions tab (`workflow_dispatch`)

### One-time setup

1. Install the Vercel CLI locally and link the repo (only needed once, from a machine that has Vercel access):

   ```bash
   npm install --global vercel
   vercel login
   vercel link
   ```

   This creates a `.vercel/project.json` containing the org and project IDs.

2. Create a Vercel access token at [vercel.com/account/tokens](https://vercel.com/account/tokens).

3. Add the following GitHub Actions secrets to this repository (Settings → Secrets and variables → Actions):

   | Secret              | Value                                                            |
   | ------------------- | ---------------------------------------------------------------- |
   | `VERCEL_TOKEN`      | The Vercel access token from step 2                              |
   | `VERCEL_ORG_ID`     | `orgId` from `.vercel/project.json` (or Vercel Team Settings)    |
   | `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json` (or Vercel Project Settings) |

After secrets are added, the next push to `main` will deploy to production. See the [Next.js deployment docs](https://nextjs.org/docs/app/getting-started/deploying) for more details.
