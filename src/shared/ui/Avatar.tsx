import { cn } from '@/shared/lib/cn'

interface AvatarProps {
  name: string
  hue?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-14 text-lg' }

export function Avatar({ name, hue = 172, size = 'md', className }: AvatarProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
  return (
    <span
      aria-hidden
      className={cn('inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold', sizes[size], className)}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 45% 88%), hsl(${hue} 40% 76%))`,
        color: `hsl(${hue} 55% 24%)`,
      }}
    >
      {initials}
    </span>
  )
}
