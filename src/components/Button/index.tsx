import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { ArrowRight, ArrowUpRight } from '../Icons'
import styles from './Button.module.scss'

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse'

interface CommonProps {
  variant?: Variant
  size?: 'md' | 'lg'
  /** Exibe uma seta ao final; CTAs usam → e navegação pode optar por ↗. */
  arrow?: boolean
  arrowDirection?: 'right' | 'up-right'
  children: ReactNode
  className?: string
}

function classes({ variant = 'primary', size = 'md', className }: CommonProps) {
  return [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ')
}

function Content({ children, arrow, arrowDirection = 'right' }: Pick<CommonProps, 'children' | 'arrow' | 'arrowDirection'>) {
  return (
    <>
      <span className={styles.label}>{children}</span>
      {arrow && (
        <span className={styles.icon}>
          {arrowDirection === 'up-right' ? <ArrowUpRight size={18} /> : <ArrowRight size={18} />}
        </span>
      )}
    </>
  )
}

export function Button({
  variant,
  size,
  arrow,
  arrowDirection,
  children,
  className,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes({ variant, size, className, children })} {...rest}>
      <Content arrow={arrow} arrowDirection={arrowDirection}>{children}</Content>
    </button>
  )
}

export function ButtonLink({
  variant,
  size,
  arrow,
  arrowDirection,
  children,
  className,
  ...rest
}: CommonProps & LinkProps) {
  return (
    <Link className={classes({ variant, size, className, children })} {...rest}>
      <Content arrow={arrow} arrowDirection={arrowDirection}>{children}</Content>
    </Link>
  )
}
