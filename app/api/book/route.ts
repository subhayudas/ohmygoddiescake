import { NextRequest, NextResponse } from 'next/server'
import {
  buildBookingNote,
  createBooking,
  OrderPayload,
  upsertCustomer,
} from '@/lib/square'
import { buildSmsText, notifyBakery } from '@/lib/sms'
import { MINIMUM_ORDER_TOTAL } from '@/lib/pricing'

export async function POST(req: NextRequest) {
  let order: OrderPayload

  try {
    order = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!order.name || !order.email || !order.pickupDate) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (
    typeof order.estimatedTotal !== 'number' ||
    !Number.isFinite(order.estimatedTotal) ||
    order.estimatedTotal < MINIMUM_ORDER_TOTAL
  ) {
    return NextResponse.json(
      { error: `Minimum order total is $${MINIMUM_ORDER_TOTAL}` },
      { status: 400 },
    )
  }

  try {
    const customerId = await upsertCustomer(order)
    const note = buildBookingNote(order)
    const bookingId = await createBooking(customerId, order, note)

    try {
      const smsText = buildSmsText(order)
      await notifyBakery(smsText)
    } catch (smsErr) {
      console.error('SMS failed (order still created):', smsErr)
    }

    return NextResponse.json({ success: true, bookingId }, { status: 200 })
  } catch (err: unknown) {
    console.error('Square booking error:', err)
    const message = err instanceof Error ? err.message : 'Booking failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
