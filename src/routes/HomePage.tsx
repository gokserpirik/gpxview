import { useState } from 'react'
import { Bike } from 'lucide-react'

import FileDropZone from '#/components/FileDropZone'
import StatsDisplay from '#/components/StatsDisplay'
import MapView from '#/components/MapView'
import { parseGpx, isGpxFile } from '#/lib/gpx'
import type { GpxData } from '#/lib/gpx'

export default function HomePage() {
  const [gpxData, setGpxData] = useState<GpxData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleFile(file: File) {
    setError(null)
    setGpxData(null)

    if (!isGpxFile(file)) {
      setError('Please select a valid .gpx file.')
      return
    }

    setLoading(true)
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const parsed = parseGpx(text)
        setGpxData(parsed)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse GPX file.')
      } finally {
        setLoading(false)
      }
    }

    reader.onerror = () => {
      setError('Failed to read file.')
      setLoading(false)
    }

    reader.readAsText(file)
  }

  function handleReset() {
    setGpxData(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-[var(--f1-carbon)]">
      {/* Hero — full screen when empty, compact badge when data loaded */}
      {!gpxData ? (
        <section className="relative px-6 pt-24 pb-16">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-sm bg-[var(--f1-red)] px-3 py-1.5 text-sm font-mono font-bold uppercase tracking-wider text-white">
              <Bike className="size-4" />
              <span>GPX Viewer</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl md:text-6xl font-sans">
              Visualize Your{' '}
              <span className="text-[var(--f1-red)]">Activities</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground font-mono">
              Upload a GPX file to see your route on the map, analyze performance stats.
            </p>
          </div>
        </section>
      ) : (
        <section className="px-6 pt-8 pb-4">
          <div className="mx-auto max-w-6xl">
            <div className="inline-flex items-center gap-1.5 rounded-sm bg-[var(--f1-red)] px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white">
              <Bike className="size-3" />
              <span>GPX Viewer</span>
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-6xl px-6 pb-20">
        {!gpxData ? (
          <div className="mx-auto max-w-2xl">
            <FileDropZone onFile={handleFile} disabled={loading} />

            {loading && (
              <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
                <div className="size-5 animate-spin rounded-full border-2 border-[var(--f1-red)] border-t-transparent" />
                <span className="font-mono text-sm">Parsing GPX file...</span>
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-sm border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive font-mono">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Activity header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground font-sans">
                  {gpxData.name || 'Untitled Activity'}
                </h2>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">
                  {gpxData.tracks.length > 0 && `${gpxData.tracks[0].points.length.toLocaleString()} points`}
                  {gpxData.routes.length > 0 &&
                    ` · ${gpxData.routes.length} route${gpxData.routes.length !== 1 ? 's' : ''}`}
                  {gpxData.waypoints.length > 0 &&
                    ` · ${gpxData.waypoints.length} waypoint${gpxData.waypoints.length !== 1 ? 's' : ''}`}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="rounded-sm border border-border bg-[var(--f1-panel)] px-3 py-1.5 text-xs font-mono font-semibold text-muted-foreground transition hover:border-[var(--f1-red)] hover:text-foreground"
              >
                Upload Another
              </button>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-sm border border-border">
              <MapView tracks={gpxData.tracks} />
            </div>

            {/* Stats */}
            <StatsDisplay stats={gpxData.totalStats} tracks={gpxData.tracks} />

            {/* Per-track cards */}
            {gpxData.tracks.length > 1 && (
              <div className="space-y-3">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Tracks
                </h3>
                <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
                  {gpxData.tracks.map((track, idx) => (
                    <div
                      key={idx}
                      className="bg-[var(--f1-panel)] p-3 border-t-2 border-[var(--f1-red)]/40"
                    >
                      <p className="text-sm font-mono font-bold text-foreground">
                        {track.name || `Track ${idx + 1}`}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">
                        {track.points.length.toLocaleString()} pts ·{' '}
                        {track.stats.distanceKm.toFixed(2)} km
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Waypoints */}
            {gpxData.waypoints.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Waypoints ({gpxData.waypoints.length})
                </h3>
                <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                  {gpxData.waypoints.map((wpt, idx) => (
                    <div
                      key={idx}
                      className="bg-[var(--f1-panel)] p-3 border-t-2 border-[var(--f1-red)]/40 flex items-center gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-mono font-bold text-foreground truncate">
                          {wpt.name}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground">
                          {wpt.lat.toFixed(5)}, {wpt.lon.toFixed(5)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
