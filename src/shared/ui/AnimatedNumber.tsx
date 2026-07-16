import { useEffect, useRef } from 'react'
import { animate, useInView, useMotionValue } from 'motion/react'

interface AnimatedNumberProps {
  value: number
  format?: (value: number) => string
  className?: string
  duration?: number
}

/** Counts up when it scrolls into view. Respects reduced motion. */
export function AnimatedNumber({ value, format = (v) => String(Math.round(v)), className, duration = 1.1 }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const motionValue = useMotionValue(0)

  useEffect(() => {
    if (!inView) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      if (ref.current) ref.current.textContent = format(value)
      return
    }
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        if (ref.current) ref.current.textContent = format(latest)
      },
    })
    return () => controls.stop()
  }, [inView, value, duration, format, motionValue])

  return (
    <span ref={ref} className={className}>
      {format(0)}
    </span>
  )
}
