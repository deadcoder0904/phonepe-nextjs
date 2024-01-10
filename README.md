## phonepe-nextjs

## Usage

Install [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/).

Get PhonePe Business Account to get your Merchant Id & Test Keys.

### .env.development

```bash
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NGROK_URL=https://early-kind-chimp.ngrok-free.app

# PhonePe Keys
PHONEPE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay
PHONEPE_MERCHANT_ID=PGTESTPAYUAT
PHONEPE_API_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
PHONEPE_KEY_INDEX=1

NEXT_PUBLIC_EBOOK_PRICE=7

NEXT_TELEMETRY_DISABLED=1
```

Run `pnpm dev` (or `pnpm turbo`) in one terminal and `pnpm ngrok:listen` in another terminal. `ngrok` is needed for webhooks as webhooks don't work on http, they need https.

> Make sure to set up [ngrok](https://ngrok.com) with [static domain](https://ngrok.com/blog-post/free-static-domains-ngrok-users).
