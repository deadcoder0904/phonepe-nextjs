import { isBrowser } from '@/app/lib/isBrowser'

if (isBrowser()) {
  throw new Error(
    'DO NOT USE @/app/lib/env/server.ts IN THE BROWSER AS YOU WILL EXPOSE FULL CONTROL OVER YOUR PHONEPE ACCOUNT!'
  )
}

export const PHONEPE_URL = process.env.PHONEPE_URL as string
export const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID as string
export const PHONEPE_KEY_INDEX = process.env.PHONEPE_KEY_INDEX as string
export const PHONEPE_API_KEY = process.env.PHONEPE_API_KEY as string
