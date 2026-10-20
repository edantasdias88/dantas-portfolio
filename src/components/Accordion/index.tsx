import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { AccordionControl } from '@/components/AccordionControl'
import { Collapse } from '@/components/Collapse'
import styles from './Accordion.module.scss'

export interface AccordionItem {
  id: string
  title: string
  description?: string
  content: ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  initialOpenId?: string | null
}

export function Accordion({ items, initialOpenId = null }: AccordionProps) {
  const uid = useId()
  const [openId, setOpenId] = useState<string | null>(initialOpenId)

  return (
    <ul className={styles.list}>
      {items.map((item, index) => {
        const isOpen = openId === item.id
        const buttonId = `${uid}-${item.id}-button`
        const panelId = `${uid}-${item.id}-panel`

        return (
          <li key={item.id} className={styles.item} data-open={isOpen}>
            <h3 className={styles.heading}>
              <button
                id={buttonId}
                type="button"
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.dash} aria-hidden="true" />
                <span className={styles.title}>{item.title}</span>
                {item.description !== undefined && (
                  <span className={styles.description}>{item.description}</span>
                )}
                <AccordionControl open={isOpen} className={styles.control} />
              </button>
            </h3>
            <Collapse open={isOpen} id={panelId} labelledBy={buttonId}>
              {item.content}
            </Collapse>
          </li>
        )
      })}
    </ul>
  )
}
