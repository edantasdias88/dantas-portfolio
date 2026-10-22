import type { ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import contactAction from '@/assets/figma/footer/contact-action.svg'
import styles from './CaseLink.module.scss'

type Size = 'sm' | 'md'
type Tone = 'default' | 'project'

interface ContentProps {
  children: ReactNode
  size?: Size
  tone?: Tone
  className?: string
}

export function CaseLinkContent({ children, size = 'sm', tone = 'default', className }: ContentProps) {
  return (
    <span className={[styles.content, styles[size], styles[tone], className].filter(Boolean).join(' ')}>
      <span className={styles.label} data-case-link-label>{children}</span>
      <img className={styles.icon} src={contactAction} alt="" width={32} height={32} aria-hidden="true" />
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
