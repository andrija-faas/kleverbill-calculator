'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface ProgressiveStepProps {
  visible: boolean
  children: ReactNode
}

export function ProgressiveStep({ visible, children }: ProgressiveStepProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: 10, height: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{ overflow: 'hidden' }}
        >
          <div className="mb-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
