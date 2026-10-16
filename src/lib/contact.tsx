import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { FullscreenContact } from '@/components/FullscreenContact'

interface ContactContextValue {
  /** Abre o modal de contato. Passe o elemento que disparou para devolver o foco ao fechar. */
  openContact: (trigger?: HTMLElement | null) => void
}

const ContactContext = createContext<ContactContextValue | null>(null)

export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [trigger, setTrigger] = useState<HTMLElement | null>(null)

  const openContact = useCallback((el?: HTMLElement | null) => {
    setTrigger(el ?? (document.activeElement as HTMLElement | null))
    setOpen(true)
  }, [])
  const close = useCallback(() => setOpen(false), [])
  const value = useMemo(() => ({ openContact }), [openContact])

  return (
    <ContactContext.Provider value={value}>
      {children}
      <FullscreenContact open={open} onClose={close} returnFocusTo={trigger} />
    </ContactContext.Provider>
  )
}

export function useContact() {
  const ctx = useContext(ContactContext)
  if (!ctx) throw new Error('useContact must be used inside ContactProvider')
  return ctx
}
