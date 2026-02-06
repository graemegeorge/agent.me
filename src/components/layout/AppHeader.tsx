import Link from 'next/link'

interface AppHeaderProps {
  nav?: React.ReactNode
}

export function AppHeader({ nav }: AppHeaderProps) {
  return (
    <header className="hidden sm:block rule-strong">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.28em]">
          agent-me.app
        </Link>
        {nav ? (
          <nav className="flex items-center gap-4 text-xs uppercase tracking-[0.2em]">{nav}</nav>
        ) : null}
      </div>
    </header>
  )
}
