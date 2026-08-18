/**
 * Shared pricing rules. Safe to import from client components — this module
 * reads no env vars and holds no secrets (unlike `lib/square.ts` / `lib/sms.ts`).
 */

/**
 * Smallest estimated total the bakery accepts, in CAD. Enforced twice: the
 * order wizard blocks the add-ons step and the submit button below it, and
 * `POST /api/book` rejects any payload under it.
 */
export const MINIMUM_ORDER_TOTAL = 130
