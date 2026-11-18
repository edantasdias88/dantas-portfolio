import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { CarouselNavigation } from './CarouselNavigation'
import { iPhoneFrame as IPhoneFrame } from '@/components/iPhoneFrame'
import { Reveal } from '@/components/Reveal'
import { caaAppAssets } from '@/data/caaAppAssets'
import styles from './CaaAppSequence.module.scss'

type Screen = keyof typeof caaAppAssets.screens

interface ExperienceCarouselProps {
  slides: readonly Screen[]
  title: string
  description: string
  id: string
  reversed?: boolean
}

interface StageLayout {
  width: number
  left: number
  top: number
  x: number
  y: number
  scale: number
  exitX: number
  enterX: number
}

function PhoneSlide({ name, index, current, progress, layout }: {
  name: Screen
  index: number
  current: number
  progress: MotionValue<number>
  layout: StageLayout
}) {
  const { t } = useTranslation()
  const offset = useTransform(progress, (position) => index - position)
  const x = useTransform(offset, [-1, 0, 1, 2], [layout.exitX, 0, layout.x, layout.enterX])
  const y = useTransform(offset, [0, 1], [0, layout.y])
  const scale = useTransform(offset, [0, 1], [1, layout.scale])
  const opacity = useTransform(offset, [-1, 0, 1, 1.9, 2], [0, 1, 1, 0, 0])

  return (
    <motion.figure
      className={styles.discoveryPhone}
      style={{ width: layout.width, left: layout.left, top: layout.top, x, y, scale, opacity }}
      aria-hidden={index < current || index > current + 1}
    >
      <IPhoneFrame {...caaAppAssets.screens[name]} alt={t(`case.caaPresentation.screens.${name}`)} />
    </motion.figure>
  )
}

export function ExperienceCarousel({ slides, title, description, id, reversed = false }: ExperienceCarouselProps) {
  const reduced = useReducedMotion()
  const progress = useMotionValue(0)
  const stage = useRef<HTMLDivElement>(null)
  const primary = useRef<HTMLDivElement>(null)
  const secondary = useRef<HTMLDivElement>(null)
  const animation = useRef<ReturnType<typeof animate> | null>(null)
  const drag = useRef<{ pointer: number; x: number; y: number; horizontal: boolean } | null>(null)
  const [layout, setLayout] = useState<StageLayout | null>(null)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(0)
  const [busy, setBusy] = useState(false)
  const last = slides.length - 1
  const forward = reversed ? 1 : -1

  useLayoutEffect(() => {
    const viewport = stage.current
    const first = primary.current
    const next = secondary.current
    if (!viewport || !first || !next) return

    const measure = () => {
      const width = first.offsetWidth
      if (!width) return
      const left = first.offsetLeft
      const secondaryWidth = next.offsetWidth
      const rightEdge = viewport.clientWidth - left
      setLayout({
        width,
        left,
        top: first.offsetTop,
        x: next.offsetLeft - first.offsetLeft,
        y: next.offsetTop - first.offsetTop,
        scale: secondaryWidth / width,
        exitX: reversed ? rightEdge : -left - width,
        enterX: reversed ? -left - secondaryWidth : rightEdge,
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(first)
    observer.observe(next)
    return () => observer.disconnect()
  }, [reversed])

  useEffect(() => () => animation.current?.stop(), [])

  function navigate(target: number) {
    if (animation.current || drag.current) return
    const next = Math.max(0, Math.min(last, target))
    setSelected(next)
    if (progress.get() === next || reduced) {
      progress.set(next)
      setCurrent(next)
      return
    }

    setBusy(true)
    animation.current = animate(progress, next, {
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1],
      onComplete: () => {
        animation.current = null
        setCurrent(next)
        setBusy(false)
      },
      onStop: () => {
        animation.current = null
        const settled = Math.max(0, Math.min(last, Math.round(progress.get())))
        progress.set(settled)
        setCurrent(settled)
        setSelected(settled)
        setBusy(false)
      },
    })
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    navigate(current + (event.key === 'ArrowRight' ? 1 : -1))
  }

  function startSwipe(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'touch' || !event.isPrimary || animation.current || !layout) return
    drag.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY, horizontal: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moveSwipe(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current
    if (!start || start.pointer !== event.pointerId || !layout) return
    const distance = event.clientX - start.x
    if (!start.horizontal) {
      if (Math.abs(distance) < 8 || Math.abs(distance) < Math.abs(event.clientY - start.y)) return
      start.horizontal = true
    }

    if (!reduced) {
      const shift = Math.max(-1, Math.min(1, forward * distance / layout.width))
      progress.set(Math.max(0, Math.min(last, current + shift)))
    }
  }

  function endSwipe(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current
    if (!start || start.pointer !== event.pointerId) return
    drag.current = null

    const distance = event.clientX - start.x
    const advance = event.type === 'pointerup' && start.horizontal && Math.abs(distance) >= 36
    navigate(advance ? current + forward * Math.sign(distance) : current)
  }

  const Heading = reversed ? 'h3' : 'h2'

  return (
    <Reveal className={reversed ? `${styles.duet} ${styles.duetReversed}` : styles.duet}>
      <div className={styles.discovery}>
        <Heading id={id}>{title}</Heading>
        <div className={styles.discoveryCopy}>
          <p>{description}</p>
          <div onKeyDown={onKeyDown}>
            <CarouselNavigation count={slides.length} active={selected} transitioning={busy} onNavigate={navigate} />
          </div>
        </div>
      </div>

      <div
        ref={stage}
        className={styles.discoveryStage}
        onPointerDown={startSwipe}
        onPointerMove={moveSwipe}
        onPointerUp={endSwipe}
        onPointerCancel={endSwipe}
        onLostPointerCapture={endSwipe}
      >
        <div ref={primary} className={styles.discoverySlot} aria-hidden="true" />
        <div ref={secondary} className={styles.discoverySlot} aria-hidden="true" />
        {layout && slides.map((name, index) => (
          <PhoneSlide key={name} name={name} index={index} current={current} progress={progress} layout={layout} />
        ))}
      </div>
    </Reveal>
  )
}
