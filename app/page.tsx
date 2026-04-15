import { redirect } from 'next/navigation'

// Middleware handles / → /de or /en. This is a safety fallback.
export default function Home() {
  redirect('/de/calculator')
}
