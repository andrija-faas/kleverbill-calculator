import { z } from 'zod'

// ─── Translation messages interface ──────────────────────────────────────────
// Used by factory functions so Zod error messages can be localised.
// Components build this object from useTranslations('validation') and pass it in.

export interface ValidationMessages {
  monthlyRevenue: { required: string; positive: string }
  invoiceCount: { required: string; positive: string }
  avgInvoiceValue: { required: string; positive: string }
  chasingHours: { required: string; nonNegative: string }
  chasingHoursPerInvoice: { required: string; nonNegative: string }
  invoiceCountMode: { required: string }
}

// ─── Step 1 schema factories ─────────────────────────────────────────────────

export function createMrSchema(m: ValidationMessages) {
  return z.object({
    monthlyRevenue: z
      .number({ required_error: m.monthlyRevenue.required })
      .positive(m.monthlyRevenue.positive),
  })
}

export function createInvoiceSchema(m: ValidationMessages) {
  return z.object({
    invoiceCount: z
      .number({ required_error: m.invoiceCount.required })
      .int()
      .positive(m.invoiceCount.positive),
    avgInvoiceValue: z
      .number({ required_error: m.avgInvoiceValue.required })
      .positive(m.avgInvoiceValue.positive),
  })
}

// ─── Step 2 schema factories ─────────────────────────────────────────────────

export function createHscTotalSchema(m: ValidationMessages) {
  return z.object({
    chasingHours: z
      .number({ required_error: m.chasingHours.required })
      .min(0, m.chasingHours.nonNegative),
  })
}

export function createHscPerInvoiceSchema(m: ValidationMessages) {
  return z.object({
    chasingHoursPerInvoice: z
      .number({ required_error: m.chasingHoursPerInvoice.required })
      .min(0, m.chasingHoursPerInvoice.nonNegative),
    invoiceCount: z
      .number({ required_error: m.invoiceCountMode.required })
      .int()
      .positive(),
  })
}

// ─── Step 3 schema (no user-facing errors) ───────────────────────────────────

export const overridesSchema = z.object({
  latePaymentRate: z.number().min(0).max(100).default(20),
  unpaidRate: z.number().min(0).max(100).default(5),
  hourlyInternalCost: z.number().positive().default(35),
})
