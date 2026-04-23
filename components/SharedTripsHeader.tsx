'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type SharedTripsHeaderProps = {
  homeHref?: string
  actionHref: string
  actionLabel: string
  mode?: 'home' | 'content'
  visible?: boolean
  compactOnScroll?: boolean
}

const navigationLinks = [
  { href: '/trips', label: 'Trips' },
  { href: '/about', label: 'About' },
]

export default function SharedTripsHeader({
  homeHref = '/',
  actionHref,
  actionLabel,
  mode = 'content',
  visible = true,
  compactOnScroll = true,
}: SharedTripsHeaderProps) {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const [isCompact, setIsCompact] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (!compactOnScroll) return

    const threshold = window.matchMedia('(max-width: 760px)').matches ? 72 : 120
    const nextCompact = latest > threshold

    setIsCompact((current) => (current === nextCompact ? current : nextCompact))
  })

  return (
    <div className="site-nav-shell">
      <motion.nav
        aria-label="Primary navigation"
        className={cn('site-nav', isCompact && 'site-nav-compact', mode === 'home' && 'site-nav-home')}
        style={{ pointerEvents: visible ? 'auto' : 'none' }}
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={
          shouldReduceMotion
            ? { opacity: visible ? 1 : 0, y: 0 }
            : { opacity: visible ? 1 : 0, y: visible ? 0 : -8 }
        }
        transition={{ duration: shouldReduceMotion ? 0.12 : 0.24, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href={homeHref}
          aria-label="Trek and Stay home"
          className="site-nav-brand"
        >
          <span className="site-nav-mark">TS</span>
          <span className="site-nav-brand-lockup">
            <span className="site-nav-brand-name">Trek &amp; Stay</span>
            <span className="site-nav-brand-tag">Founder-led routes</span>
          </span>
        </Link>

        <div className="site-nav-links" role="list">
          {navigationLinks.map((link) => {
            const isActive = link.href === '/trips' ? pathname.startsWith('/trips') : pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn('site-nav-link', isActive && 'site-nav-link-active')}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <Link href={actionHref} className="site-nav-action">
          {actionLabel}
        </Link>
      </motion.nav>
    </div>
  )
}
