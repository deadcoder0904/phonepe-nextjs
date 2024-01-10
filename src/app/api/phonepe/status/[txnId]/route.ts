import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

import {
  PHONEPE_API_KEY,
  PHONEPE_KEY_INDEX,
  PHONEPE_MERCHANT_ID,
  PHONEPE_URL,
} from '@/app/lib/env/server'

export const POST = async (
  request: NextRequest,
  { params: { txnId } }: { params: { txnId: string } }
) => {
  console.info(`[PhonePe] Listening to Webhook Event!`)

  try {
    const merchantTransactionId = txnId
    const merchantId = PHONEPE_MERCHANT_ID
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}${PHONEPE_API_KEY}`
    const sha256 = crypto.createHash('sha256').update(string).digest('hex')
    const checksum = `${sha256}###${PHONEPE_KEY_INDEX}`

    const response = await fetch(
      `${PHONEPE_URL}/status/${merchantId}/${merchantTransactionId}`,
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': `${merchantId}`,
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
      }
    )

    console.log({ response })

    const session = await response.json()
    console.log({ session })

    if (session.success === true) {
      console.info(
        { email: 'obfuscateEmail(buyerEmail)' },
        `[PhonePe] 💰 Successfully charged`
      )
      return NextResponse.json({ success: true, message: 'Payment Success' })
    } else {
      console.error(
        { email: 'obfuscateEmail(buyerEmail)' },
        `[PhonePe] ❌ Payment failed`
      )
      return NextResponse.json(
        { success: false, message: 'Payment Failure' },
        { status: 400 }
      )
    }
  } catch (err) {
    console.error({ err }, `[PhonePe] Webhook Error`)
    return NextResponse.json(
      { err: 'Webhook handler failed. View logs.' },
      {
        status: 400,
      }
    )
  }
}
