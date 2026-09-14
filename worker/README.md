# AI assistant proxy

This Worker is the only component allowed to read `DIFY_API_KEY`. The secret is
configured in Cloudflare and must never be added to this repository.

## Deploy

From the repository root:

```powershell
npx wrangler@latest deploy --config worker/wrangler.jsonc
```

The configuration preserves dashboard variables and requires the existing
`DIFY_API_KEY` secret before deployment. Local `.dev.vars` and `.env` files are
ignored by Git.
