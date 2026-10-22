import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Button, ButtonLink } from '@/components/Button'
import { markInitialContentReady } from '@/lib/initialLoad'
import styles from './EndlessRunner.module.scss'

type GamePhase = 'ready' | 'running' | 'paused' | 'over'
type Obstacle = { x: number; width: number; height: number; variant: number }
type World = {
  width: number
  height: number
  jump: number
  jumpVelocity: number
  obstacles: Obstacle[]
  speed: number
  elapsed: number
  distance: number
  spawnIn: number
  laneOffset: number
  score: number
}
type Palette = { ink: string; muted: string; line: string; accent: string; accentStrong: string }

const RECORD_KEY = 'ed-runner-record'
const PLAYER_WIDTH = 54
const PLAYER_HEIGHT = 62

function createWorld(): World {
  return {
    width: 0,
    height: 0,
    jump: 0,
    jumpVelocity: 0,
    obstacles: [],
    speed: 260,
    elapsed: 0,
    distance: 0,
    spawnIn: 1.35,
    laneOffset: 0,
    score: 0,
  }
}

function readPalette(): Palette {
  const computed = getComputedStyle(document.documentElement)
  return {
    ink: computed.getPropertyValue('--content-primary').trim(),
    muted: computed.getPropertyValue('--content-secondary').trim(),
    line: computed.getPropertyValue('--border-default').trim(),
    accent: computed.getPropertyValue('--accent-primary').trim(),
    accentStrong: computed.getPropertyValue('--accent-content').trim(),
  }
}

function drawCharacter(
  ctx: CanvasRenderingContext2D,
  x: number,
  floor: number,
  jump: number,
  time: number,
  running: boolean,
  palette: Palette,
) {
  const y = floor - PLAYER_HEIGHT - jump
  const legSwing = running ? Math.sin(time * 15) * 5 : 0

  ctx.save()
  ctx.globalAlpha = Math.max(0.26, 0.48 - jump / 360)
  ctx.fillStyle = '#07162b'
  ctx.beginPath()
  ctx.ellipse(x + PLAYER_WIDTH / 2 + 2, floor + 3, 25 - jump * 0.04, 5, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.lineCap = 'round'
  ctx.lineWidth = 5
  ctx.strokeStyle = palette.accentStrong
  ctx.beginPath()
  ctx.moveTo(x + 16, y + PLAYER_HEIGHT - 3)
  ctx.lineTo(x + 15 - legSwing, floor - 1)
  ctx.moveTo(x + 39, y + PLAYER_HEIGHT - 3)
  ctx.lineTo(x + 40 + legSwing, floor - 1)
  ctx.stroke()

  ctx.fillStyle = '#075ac4'
  ctx.beginPath()
  ctx.moveTo(x + PLAYER_WIDTH - 17, y + 8)
  ctx.lineTo(x + PLAYER_WIDTH + 2, y + 2)
  ctx.lineTo(x + PLAYER_WIDTH + 2, y + PLAYER_HEIGHT - 12)
  ctx.lineTo(x + PLAYER_WIDTH - 16, y + PLAYER_HEIGHT - 3)
  ctx.closePath()
  ctx.fill()

  const face = ctx.createLinearGradient(x, y, x + PLAYER_WIDTH, y + PLAYER_HEIGHT)
  face.addColorStop(0, '#65b7ff')
  face.addColorStop(0.42, palette.accent)
  face.addColorStop(1, '#0870e8')
  ctx.fillStyle = face
  ctx.strokeStyle = 'rgba(255,255,255,.42)'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.roundRect(x, y + 3, PLAYER_WIDTH - 9, PLAYER_HEIGHT - 5, 14)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = 'rgba(255,255,255,.23)'
  ctx.beginPath()
  ctx.moveTo(x + 12, y + 7)
  ctx.lineTo(x + 37, y + 7)
  ctx.lineTo(x + 30, y + 12)
  ctx.lineTo(x + 10, y + 13)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#f4f9ff'
  ctx.beginPath()
  ctx.arc(x + 18, y + 29, 3, 0, Math.PI * 2)
  ctx.arc(x + 34, y + 29, 3, 0, Math.PI * 2)
  ctx.fill()
}

function drawWorld(
  ctx: CanvasRenderingContext2D,
  world: World,
  palette: Palette,
  phase: GamePhase,
  reducedMotion: boolean,
) {
  const { width, height } = world
  if (!width || !height) return

  ctx.clearRect(0, 0, width, height)
  const floor = height - 35
  const playerX = Math.max(36, Math.min(70, width * 0.12))

  ctx.fillStyle = palette.muted
  ctx.globalAlpha = 0.11
  ctx.beginPath()
  ctx.moveTo(0, floor - 64)
  ctx.lineTo(width * 0.12, floor - 111)
  ctx.lineTo(width * 0.24, floor - 64)
  ctx.lineTo(width * 0.38, floor - 134)
  ctx.lineTo(width * 0.51, floor - 64)
  ctx.lineTo(width * 0.72, floor - 99)
  ctx.lineTo(width * 0.86, floor - 64)
  ctx.lineTo(width, floor - 91)
  ctx.lineTo(width, floor)
  ctx.lineTo(0, floor)
  ctx.closePath()
  ctx.fill()
  ctx.globalAlpha = 1

  ctx.strokeStyle = palette.line
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, floor + 0.5)
  ctx.lineTo(width, floor + 0.5)
  ctx.stroke()

  if (!reducedMotion && phase === 'running') {
    ctx.strokeStyle = palette.line
    ctx.globalAlpha = 0.7
    for (let i = 0; i < 8; i += 1) {
      const x = ((i * 103 - world.laneOffset) % (width + 50) + width + 50) % (width + 50)
      ctx.beginPath()
      ctx.moveTo(x, floor + 14)
      ctx.lineTo(x + 24, floor + 14)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  for (const obstacle of world.obstacles) {
    const y = floor - obstacle.height
    const side = Math.min(9, obstacle.width * 0.24)
    ctx.fillStyle = 'rgba(11, 21, 32, .10)'
    ctx.beginPath()
    ctx.ellipse(obstacle.x + obstacle.width / 2 + 4, floor + 3, obstacle.width * 0.72, 4, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = palette.muted
    ctx.globalAlpha = 0.72
    ctx.beginPath()
    ctx.moveTo(obstacle.x + obstacle.width - side, y + 3)
    ctx.lineTo(obstacle.x + obstacle.width + 2, y - 3)
    ctx.lineTo(obstacle.x + obstacle.width + 2, floor - 7)
    ctx.lineTo(obstacle.x + obstacle.width - side, floor)
    ctx.closePath()
    ctx.fill()
    ctx.globalAlpha = 1

    const block = ctx.createLinearGradient(obstacle.x, y, obstacle.x + obstacle.width, floor)
    block.addColorStop(0, palette.line)
    block.addColorStop(1, palette.muted)
    ctx.fillStyle = block
    ctx.beginPath()
    ctx.roundRect(obstacle.x, y, obstacle.width - side, obstacle.height, 5)
    ctx.fill()
    ctx.fillStyle = palette.accent
    ctx.globalAlpha = obstacle.variant === 0 ? 0.8 : 0.45
    ctx.fillRect(obstacle.x + 6, y + 7, 3, Math.min(13, obstacle.height - 11))
    ctx.globalAlpha = 1
  }

  drawCharacter(ctx, playerX, floor, world.jump, world.elapsed, phase === 'running', palette)
}

function savedRecord() {
  try {
    const value = Number(localStorage.getItem(RECORD_KEY))
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0
  } catch {
    return 0
  }
}

interface EndlessRunnerProps {
  children: ReactNode
}

export function EndlessRunner({ children }: EndlessRunnerProps) {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion() === true
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const worldRef = useRef<World>(createWorld())
  const paletteRef = useRef<Palette | null>(null)
  const contentReadyRef = useRef(false)
  const phaseRef = useRef<GamePhase>('ready')
  const recordRef = useRef(savedRecord())
  const displayedScoreRef = useRef(0)
  const [phase, setPhase] = useState<GamePhase>('ready')
  const [score, setScore] = useState(0)
  const [record, setRecord] = useState(recordRef.current)

  const changePhase = useCallback((next: GamePhase) => {
    phaseRef.current = next
    setPhase(next)
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const palette = paletteRef.current
    if (!canvas || !palette) return
    const context = canvas.getContext('2d')
    if (!context) return
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    drawWorld(context, worldRef.current, palette, phaseRef.current, reduceMotion)
    if (!contentReadyRef.current && worldRef.current.width > 0 && worldRef.current.height > 0) {
      contentReadyRef.current = true
      markInitialContentReady()
    }
  }, [reduceMotion])

  const updateRecord = useCallback((newScore: number) => {
    setScore(newScore)
    if (newScore <= recordRef.current) return
    recordRef.current = newScore
    setRecord(newScore)
    try {
      localStorage.setItem(RECORD_KEY, String(newScore))
    } catch {
      // Recorde fica apenas em memória quando o armazenamento estiver indisponível.
    }
  }, [])

  const startGame = useCallback(() => {
    if (phaseRef.current === 'paused') {
      changePhase('running')
      requestAnimationFrame(() => canvasRef.current?.focus({ preventScroll: true }))
      return
    }
    worldRef.current = createWorld()
    displayedScoreRef.current = 0
    setScore(0)
    changePhase('running')
    requestAnimationFrame(() => canvasRef.current?.focus({ preventScroll: true }))
  }, [changePhase])

  const jump = useCallback(() => {
    const world = worldRef.current
    if (phaseRef.current !== 'running' || world.jump > 0 || world.jumpVelocity > 0) return
    world.jumpVelocity = reduceMotion ? 590 : 675
  }, [reduceMotion])

  const handleMainAction = useCallback(() => {
    if (phaseRef.current === 'running') {
      changePhase('paused')
    } else {
      startGame()
    }
  }, [changePhase, startGame])

  useEffect(() => {
    paletteRef.current = readPalette()
    const themeObserver = new MutationObserver(() => {
      paletteRef.current = readPalette()
      draw()
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => themeObserver.disconnect()
  }, [draw])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.round(rect.width * ratio)
      const height = Math.round(rect.height * ratio)
      if (canvas.width !== width) canvas.width = width
      if (canvas.height !== height) canvas.height = height
      worldRef.current.width = rect.width
      worldRef.current.height = rect.height
      draw()
    }
    let resizeFrame = 0
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(resize)
    })
    observer.observe(canvas)
    resize()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(resizeFrame)
    }
  }, [draw])

  useEffect(() => {
    if (phase !== 'running') {
      draw()
      return
    }

    let frame = 0
    let previous = 0
    let scoreTimer = 0
    const world = worldRef.current
    const gravity = reduceMotion ? 1500 : 1800
    const baseSpeed = reduceMotion ? 205 : 260
    const maxSpeed = reduceMotion ? 330 : 445

    const onVisibilityChange = () => {
      if (document.hidden) changePhase('paused')
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    const tick = (now: number) => {
      if (document.hidden) {
        changePhase('paused')
        return
      }
      const dt = previous ? Math.min((now - previous) / 1000, 0.032) : 0
      previous = now
      world.elapsed += dt
      world.speed = Math.min(maxSpeed, baseSpeed + world.elapsed * (reduceMotion ? 2.2 : 3.5))
      world.distance += world.speed * dt
      world.score = Math.floor(world.distance / 12)
      world.laneOffset = (world.laneOffset + world.speed * dt) % 153

      if (world.jump > 0 || world.jumpVelocity > 0) {
        world.jump += world.jumpVelocity * dt
        world.jumpVelocity -= gravity * dt
        if (world.jump <= 0) {
          world.jump = 0
          world.jumpVelocity = 0
        }
      }

      world.spawnIn -= dt
      if (world.spawnIn <= 0) {
        world.obstacles.push({
          x: world.width + 18,
          width: 26 + Math.random() * 15,
          height: 34 + Math.random() * 26,
          variant: Math.floor(Math.random() * 3),
        })
        world.spawnIn = 1.28 + Math.random() * 0.6
      }

      for (const obstacle of world.obstacles) obstacle.x -= world.speed * dt
      world.obstacles = world.obstacles.filter((obstacle) => obstacle.x + obstacle.width > -4)

      const floor = world.height - 35
      const playerX = Math.max(36, Math.min(70, world.width * 0.12))
      const playerTop = floor - PLAYER_HEIGHT - world.jump + 8
      const playerBottom = floor - world.jump - 3
      const collision = world.obstacles.some((obstacle) => {
        const verticalOverlap = playerBottom > floor - obstacle.height + 4 && playerTop < floor
        const horizontalOverlap = playerX + PLAYER_WIDTH - 5 > obstacle.x && playerX + 5 < obstacle.x + obstacle.width - 2
        return verticalOverlap && horizontalOverlap
      })

      scoreTimer += dt
      if (scoreTimer >= 0.12 || collision) {
        scoreTimer = 0
        if (displayedScoreRef.current !== world.score) {
          displayedScoreRef.current = world.score
          setScore(world.score)
        }
      }

      if (collision) {
        updateRecord(world.score)
        changePhase('over')
        draw()
        return
      }

      draw()
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [changePhase, draw, phase, reduceMotion, updateRecord])

  useEffect(() => {
    if (phase !== 'over') return
    draw()
  }, [draw, phase])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && (phaseRef.current === 'running' || phaseRef.current === 'paused')) {
        event.preventDefault()
        changePhase(phaseRef.current === 'running' ? 'paused' : 'running')
        return
      }
      if ((event.code !== 'Space' && event.key !== 'ArrowUp') || event.repeat || event.isComposing) return
      const target = event.target
      if (target instanceof HTMLElement && target.closest('button, a, input, textarea, select, [contenteditable="true"]')) return
      event.preventDefault()
      if (phaseRef.current === 'ready' || phaseRef.current === 'over') startGame()
      else if (phaseRef.current === 'running') jump()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [changePhase, jump, startGame])

  const phaseMessage = phase === 'ready'
    ? t('notFound.readyStatus')
    : phase === 'running'
      ? t('notFound.runningStatus')
      : phase === 'paused'
        ? t('notFound.pausedStatus')
        : t('notFound.gameOverStatus', { score })

  const actionLabel = phase === 'ready'
    ? t('notFound.startGame')
    : phase === 'running'
      ? t('notFound.pauseGame')
      : phase === 'paused'
        ? t('notFound.resumeGame')
        : t('notFound.playAgain')

  return (
    <section className={styles.game} aria-label={t('notFound.gameRegion')}>
      <div className={styles.presentation}>
        <div className={styles.intro}>{children}</div>
        <div className={styles.actions}>
          <Button
            className={styles.action}
            variant="primary"
            size="lg"
            onClick={handleMainAction}
            aria-label={actionLabel}
          >
            {actionLabel}
          </Button>
          <ButtonLink className={styles.backLink} to="/" variant="ghost">
            {t('notFound.backToPortfolio')}
          </ButtonLink>
        </div>
      </div>

      <div className={styles.playfield}>
        <div className={styles.hud}>
          <span className={styles.gameLabel}>{t('notFound.gameLabel')}</span>
          <div className={styles.stats}>
            <p><span>{t('notFound.score')}</span><strong>{String(score).padStart(5, '0')}</strong></p>
            <p><span>{t('notFound.record')}</span><strong>{String(record).padStart(5, '0')}</strong></p>
          </div>
        </div>

        <div className={styles.stage} data-phase={phase}>
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            width="960"
            height="360"
            tabIndex={0}
            aria-label={t('notFound.canvasLabel')}
            onPointerDown={(event) => {
              event.preventDefault()
              event.currentTarget.focus({ preventScroll: true })
              if (phaseRef.current === 'running') jump()
              else if (phaseRef.current === 'ready' || phaseRef.current === 'over') startGame()
              else if (phaseRef.current === 'paused') changePhase('running')
            }}
          />
          {phase === 'paused' && <div className={styles.overlay}>{t('notFound.pausedOverlay')}</div>}
          {phase === 'over' && <div className={styles.overlay}>{t('notFound.gameOverOverlay')}</div>}
        </div>

        <div className={styles.gameFooter}>
          <div className={styles.instructions}>
            <p>{t('notFound.desktopControls')}</p>
            <p>{t('notFound.mobileControls')}</p>
          </div>
        </div>
      </div>
      <p className={styles.liveStatus} role="status" aria-live="polite">{phaseMessage}</p>
    </section>
  )
}
