import { useEffect, useState, type RefObject } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])
  return matches
}

let lockCount = 0
/** Bloqueia o scroll do body enquanto `active` for verdadeiro (suporta camadas sobrepostas). */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    lockCount += 1
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.classList.add('is-locked')
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    return () => {
      lockCount -= 1
      if (lockCount === 0) {
        document.body.classList.remove('is-locked')
        document.body.style.paddingRight = ''
      }
    }
  }, [active])
}

let inertCount = 0
const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

/**
 * Prende o foco dentro do container, fecha com Escape e devolve o foco ao elemento
 * que estava ativo antes de abrir. O restante da página fica `inert`.
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onClose: () => void,
  returnFocusTo?: HTMLElement | null,
) {
  useEffect(() => {
    if (!active) return
    const container = ref.current
    if (!container) return
    const previous = returnFocusTo ?? (document.activeElement as HTMLElement | null)

    const root = document.getElementById('root')
    inertCount += 1
    root?.setAttribute('inert', '')

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      )

    const initial = container.querySelector<HTMLElement>('[data-autofocus]:not(:disabled)') ?? focusables()[0]
    requestAnimationFrame(() => initial?.focus({ preventScroll: true }))

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      inertCount -= 1
      if (inertCount === 0) root?.removeAttribute('inert')
      // Só devolve o foco se ele ainda estiver nesta camada (outra camada pode ter assumido).
      const active = document.activeElement
      if (!active || active === document.body || container.contains(active)) {
        previous?.focus({ preventScroll: true })
      }
    }
  }, [active, ref, onClose, returnFocusTo])
}

/** Revela uma única vez quando o elemento entra na viewport. */
export function useInView<T extends Element>(ref: RefObject<T | null>, rootMargin = '0px 0px -15% 0px') {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, rootMargin, inView])
  return inView
}
