import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import styles from './CaseLink.module.scss'

type Size = 'sm' | 'md'
type Tone = 'default' | 'project' | 'outlineWhite'

interface ContentProps {
  children: ReactNode
  size?: Size
  tone?: Tone
  className?: string
}

function CaseActionIcon({ previous = false, outline = false }: { previous?: boolean; outline?: boolean }) {
  return (
    <svg className={styles.icon} width={28} height={28} viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <circle cx="36" cy="36" r={outline ? 34.7 : 36}
        fill={outline ? 'transparent' : 'var(--contact-500)'}
        stroke={outline ? 'var(--case-outline-color, #fff)' : undefined} strokeWidth={outline ? 1 : undefined}
        vectorEffect={outline ? 'non-scaling-stroke' : undefined} />
      <g className={styles.arrow}>
        <path d="M23.5 48.5L48.5 23.5M48.5 46V23.5H26" stroke={outline ? 'var(--case-outline-color, #fff)' : 'var(--content-on-brand)'} strokeWidth="3"
          transform={previous ? 'translate(72 0) scale(-1 1)' : undefined} />
      </g>
    </svg>
  )
}

interface CaseActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  direction: 'previous' | 'next'
}

export function CaseActionButton({ direction, className, ...props }: CaseActionButtonProps) {
  return (
    <button
      type="button"
      className={[styles.actionButton, className].filter(Boolean).join(' ')}
      data-direction={direction}
      {...props}
    >
      <CaseActionIcon previous={direction === 'previous'} />
    </button>
  )
}

export function CaseLinkContent({ children, size = 'sm', tone = 'default', className }: ContentProps) {
  return (
    <span className={[styles.content, styles[size], styles[tone], className].filter(Boolean).join(' ')}>
      <span className={styles.label} data-case-link-label>{children}</span>
      <CaseActionIcon outline={tone === 'outlineWhite'} />
    </span>
  )
}

type Props = Omit<LinkProps, 'children'> & ContentProps

export function CaseLink({ to, children, size = 'sm', tone = 'default', className, ...rest }: Props) {
  return (
    <Link to={to} className={[styles.link, className].filter(Boolean).join(' ')} {...rest}>
      <CaseLinkContent size={size} tone={tone}>{children}</CaseLinkContent>
    </Link>
  )
}
