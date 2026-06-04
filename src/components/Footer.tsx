export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-border px-6 py-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <p className="text-xs font-mono text-muted-foreground">
          &copy; {year} GPX Fitness Viewer
        </p>
        <p className="text-xs font-mono text-muted-foreground/50">
          F1 Broadcast Theme
        </p>
      </div>
    </footer>
  )
}
