import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[var(--f1-carbon)]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Logo area */}
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-mono font-bold uppercase tracking-wider text-foreground no-underline"
        >
          <span className="inline-block h-2 w-2 bg-[var(--f1-red)]" />
          GPX Fitness
        </Link>

        {/* Right side — minimal */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground transition hover:text-foreground no-underline"
          >
            Home
          </Link>
          <span className="text-xs text-muted-foreground/40 font-mono">v0.1</span>
        </div>
      </nav>
    </header>
  )
}
