import type { ButtonHTMLAttributes, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
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

/** Track the light directly on the element, without rendering on pointer movement. */
function trackRadialLight(event: ReactPointerEvent<HTMLElement>) {
  const element = event.currentTarget
  if (event.pointerType !== 'mouse' || element.matches(':disabled, [aria-disabled="true"]')) return
  const bounds = element.getBoundingClientRect()
  element.style.setProperty('--mouse-x', `${event.clientX - bounds.left}px`)
  element.style.setProperty('--mouse-y', `${event.clientY - bounds.top}px`)
  element.dataset.radialHover = 'true'
}

function clearRadialLight(event: ReactPointerEvent<HTMLElement>) {
  delete event.currentTarget.dataset.radialHover
}

export function Button({
  variant,
  size,
  arrow,
  arrowDirection,
  children,
  className,
  type = 'button',
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  onPointerCancel,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={classes({ variant, size, className, children })}
      {...rest}
      onPointerEnter={(event) => {
        if (!variant || variant === 'primary') trackRadialLight(event)
        onPointerEnter?.(event)
      }}
      onPointerMove={(event) => {
        if (!variant || variant === 'primary') trackRadialLight(event)
        onPointerMove?.(event)
      }}
      onPointerLeave={(event) => {
        clearRadialLight(event)
        onPointerLeave?.(event)
      }}
      onPointerCancel={(event) => {
        clearRadialLight(event)
        onPointerCancel?.(event)
      }}
    >
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
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  onPointerCancel,
  ...rest
}: CommonProps & LinkProps) {
  return (
    <Link
      className={classes({ variant, size, className, children })}
      {...rest}
      onPointerEnter={(event) => {
        if (!variant || variant === 'primary') trackRadialLight(event)
        onPointerEnter?.(event)
      }}
      onPointerMove={(event) => {
        if (!variant || variant === 'primary') trackRadialLight(event)
        onPointerMove?.(event)
      }}
      onPointerLeave={(event) => {
        clearRadialLight(event)
        onPointerLeave?.(event)
      }}
      onPointerCancel={(event) => {
        clearRadialLight(event)
        onPointerCancel?.(event)
      }}
    >
      <Content arrow={arrow} arrowDirection={arrowDirection}>{children}</Content>
    </Link>
  )
}
