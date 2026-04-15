'use client'

import { useCalculatorStore } from '@/lib/store'
import { CalculatorForm } from '@/components/calculator/CalculatorForm'
import { ResultsPage } from '@/components/results/ResultsPage'
import { AnimatePresence, motion } from 'framer-motion'

// Single-route approach: form and results are both rendered here,
// toggled by the `view` state in the store. This avoids URL serialisation
// of form state while keeping everything in one URL.

export default function CalculatorPage() {
  const view = useCalculatorStore((s) => s.view)

  return (
    <AnimatePresence mode="wait">
      {view === 'form' ? (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <CalculatorForm />
        </motion.div>
      ) : (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <ResultsPage />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
