import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface CollapseProps {
  open: boolean
  id?: string
  labelledBy?: string
  className?: string
  children: ReactNode
}

/** Painel de accordion com animação de altura. O conteúdo fechado sai do DOM (não é lido nem focável). */
export function Collapse({ open, id, labelledBy, className, children }: CollapseProps) {
  const reduce = useReducedMotion()
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={id}
          role="region"
          aria-labelledby={labelledBy}
          className={className}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
