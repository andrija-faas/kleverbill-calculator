import { redirect } from 'next/navigation'

// Middleware redirects /calculator → /de/calculator (or /en/calculator).
// This fallback handles any edge case where middleware doesn't fire.
export default function CalculatorFallback() {
  redirect('/de/calculator')
}
