'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

const CALENDLY_URL = 'https://calendly.com/kleverbill/kleverbill-analyse-rechner'

interface CalendlyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CalendlyModal({ isOpen, onClose }: CalendlyModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl h-[80vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/10 hover:bg-black/20 transition-colors"
          aria-label="Close"
        >
          <X size={16} className="text-gray-700" />
        </button>
        <iframe
          src={CALENDLY_URL}
          className="w-full flex-1 border-0"
          title="Book a meeting"
        />
      </div>
    </div>
  )
}
