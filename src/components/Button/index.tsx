import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { ArrowUpRight } from '../Icons'
import styles from './Button.module.scss'

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse'

interface CommonProps {
  variant?: Variant
  size?: 'md' | 'lg'
  /** Exibe a seta ↗ ao final (padrão dos CTAs do layout). */
  arrow?: boolean
  children: ReactNode
  className?: string
}

function classes({ variant = 'primary', size = 'md', className }: CommonProps) {
  return [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ')
}

function Content({ children, arrow }: Pick<CommonProps, 'children' | 'arrow'>) {
  return (
    <>
      <span className={styles.label}>{children}</span>
      {arrow && (
        <span className={styles.icon}>
          <ArrowUpRight size={18} />
        </span>
      )}
    </>
  )
}

export function Button({
  variant,
  size,
  arrow,
  children,
  className,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes({ variant, size, className, children })} {...rest}>
      <Content arrow={arrow}>{children}</Content>
    </button>
  )
}

export function ButtonLink({
  variant,
  size,
  arrow,
  children,
  className,
  ...rest
}: CommonProps & LinkProps) {
  return (
    <Link className={classes({ variant, size, className, children })} {...rest}>
      <Content arrow={arrow}>{children}</Content>
    </Link>
  )
}
