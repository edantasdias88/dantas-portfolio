import styles from './AccordionControl.module.scss'

/** Botão circular de vidro do Figma ("Abrir serviço" + / "Fechar serviço" ×, 46×46, Site/Control/Shadow). */
export function AccordionControl({ open, className }: { open: boolean; className?: string }) {
  return (
    <span className={[styles.control, className].filter(Boolean).join(' ')} data-open={open} aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 0V14M0 7H14" />
      </svg>
    </span>
  )
}
