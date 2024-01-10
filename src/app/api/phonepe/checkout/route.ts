import { NextResponse } from 'next/server'
// import { email, object, parse, string } from "valibot"
import { createId } from '@paralleldrive/cuid2'
import crypto from 'crypto'

import { BASE_URL, EBOOK_PRICE, IS_DEV, NGROK_URL } from '@/app/lib/constants'
import {
  PHONEPE_API_KEY,
  PHONEPE_KEY_INDEX,
  PHONEPE_MERCHANT_ID,
  PHONEPE_URL,
} from '@/app/lib/env/server'

export const POST = async () => {
  console.info('🏁 POST /api/phonepe/checkout/route')

  if (
    typeof BASE_URL === 'undefined' ||
    typeof EBOOK_PRICE === 'undefined' ||
    typeof PHONEPE_API_KEY === 'undefined' ||
    typeof PHONEPE_MERCHANT_ID === 'undefined' ||
    typeof PHONEPE_KEY_INDEX === 'undefined' ||
    typeof PHONEPE_URL === 'undefined'
  ) {
    throw new Error('Env variables are not defined')
  }

  // NOTE: The commented stuff shouldn't be commented. I want `email` of the user paying for the product
  // const phonepeSchema = object({
  // 	email: string([email()]),
  // })

  try {
    // const { email } = parse(phonepeSchema, req)

    const project_name = 'PhonePe Dev'
    const amount = Number(EBOOK_PRICE)
    const currency = 'USD'

    const merchantTransactionId =
      'M' + createId().replace(/[^a-zA-Z0-9_-]/g, '')
    const REDIRECT_URL = IS_DEV ? NGROK_URL : BASE_URL
    const redirectUrl = `${REDIRECT_URL}/api/phonepe/status/${merchantTransactionId}` // `${BASE_URL}/payment/successful`
    console.log({ REDIRECT_URL, redirectUrl })
    const price = amount * 83
    const data = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: 'MUID' + createId(),
      name: project_name,
      amount: price * 100,
      redirectUrl,
      redirectMode: 'POST',
      callbackUrl: 'POST',
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    }
    const payload = JSON.stringify(data)
    const payloadMain = Buffer.from(payload).toString('base64')

    const sha256 = crypto
      .createHash('sha256')
      .update(`${payloadMain}/pg/v1/pay${PHONEPE_API_KEY}`)
      .digest('hex')
    const checksum = `${sha256}###${PHONEPE_KEY_INDEX}`

    const response = await fetch(`${PHONEPE_URL}`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({
        request: payloadMain,
      }),
    })

    const session = await response.json()
    console.log(JSON.stringify({ session }, null, 2))
    console.info(`[PhonePe] ✅ Successfully created Checkout Page!`)

    return NextResponse.json({
      success: true,
      url: session.data.instrumentResponse.redirectInfo.url,
    })
  } catch (error) {
    console.error(error, `[PhonePe] Checkout Error`)
    return NextResponse.json(error, { status: 500 })
  }
}
