import { useId, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { iPhoneFrame as IPhoneFrame } from '@/components/iPhoneFrame'
import { Reveal } from '@/components/Reveal'
import { caaAppAssets } from '@/data/caaAppAssets'
import styles from './CaaAppSequence.module.scss'

const areas = ['feed', 'properties', 'services', 'iago'] as const

function slidePosition(track: HTMLUListElement, index: number) {
  const first = track.children[0] as HTMLElement
  const slide = track.children[index] as HTMLElement
  return slide.offsetLeft - first.offsetLeft
}

function nearestSlide(track: HTMLUListElement) {
  return areas.reduce((nearest, _, index) =>
    Math.abs(slidePosition(track, index) - track.scrollLeft) <
    Math.abs(slidePosition(track, nearest) - track.scrollLeft)
      ? index
      : nearest, 0)
}

export function SolutionDevices() {
  const { t } = useTranslation()
  const id = useId()
  const track = useRef<HTMLUListElement>(null)
  const drag = useRef<{ pointer: number; x: number; y: number; left: number } | null>(null)
  const [active, setActive] = useState(0)

  function goTo(index: number) {
    const list = track.current
    if (!list) return

    const target = Math.min(areas.length - 1, Math.max(0, index))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    list.scrollTo({ left: slidePosition(list, target), behavior: reducedMotion ? 'instant' : 'smooth' })
  }

  function onKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const list = event.currentTarget
    if (list.scrollWidth <= list.clientWidth) return

    const current = nearestSlide(list)
    const targets = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: areas.length - 1 }
    const key = event.key as keyof typeof targets
    if (!Object.hasOwn(targets, key)) return

    event.preventDefault()
    goTo(targets[key])
  }

  function startDrag(event: PointerEvent<HTMLUListElement>) {
    const list = event.currentTarget
    if (event.pointerType !== 'mouse' || event.button !== 0 || list.scrollWidth <= list.clientWidth) return

    drag.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY, left: list.scrollLeft }
    list.setPointerCapture(event.pointerId)
  }

  function moveDrag(event: PointerEvent<HTMLUListElement>) {
    const start = drag.current
    if (!start || start.pointer !== event.pointerId) return

    const list = event.currentTarget
    const distance = event.clientX - start.x
    if (!list.dataset.dragging && Math.abs(distance) < Math.max(5, Math.abs(event.clientY - start.y))) return

    list.dataset.dragging = 'true'
    list.scrollLeft = start.left - distance
  }

  function endDrag(event: PointerEvent<HTMLUListElement>) {
    if (drag.current?.pointer !== event.pointerId) return

    drag.current = null
    const list = event.currentTarget
    if (!list.dataset.dragging) return

    const target = nearestSlide(list)
    delete list.dataset.dragging
    goTo(target)
  }

  return (
    <Reveal className={styles.solutionDevices} y={12}>
      <ul
        ref={track}
        id={id}
        className={styles.deviceTrack}
        aria-label={t('case.caaPresentation.solution.devicesLabel')}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onScroll={(event) => setActive(nearestSlide(event.currentTarget))}
        onDragStart={(event) => event.preventDefault()}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
      >
        {areas.map((area) => (
          <li key={area}>
            <figure>
              <IPhoneFrame {...caaAppAssets.screens[area]} alt={t(`case.caaPresentation.screens.${area}`)} />
              <figcaption className={styles.deviceCaption}>
                <strong>{t(`case.caaPresentation.architecture.${area}`)}</strong>
                <span>{t(`case.caaPresentation.solution.features.${area}`)}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <div className={styles.deviceIndicators} role="group" aria-label={t('case.caaPresentation.solution.navigationLabel')}>
        {areas.map((area, index) => (
          <button
            key={area}
            type="button"
            aria-label={t(`case.caaPresentation.architecture.${area}`)}
            aria-controls={id}
            aria-current={index === active ? 'true' : undefined}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </Reveal>
  )
}
