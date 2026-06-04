import type { TrackStats } from '#/lib/gpx'
import { formatDuration, computeSectors, SPEED_COLORS } from '#/lib/gpx'
import type { GpxTrack } from '#/lib/gpx'

interface StatsDisplayProps {
  stats: TrackStats
  tracks?: GpxTrack[]
}

function fmt(val: number | null, suffix: string): string {
  if (val === null) return '--'
  return `${val} ${suffix}`
}

function fmtSpeed(val: number): string {
  if (val <= 0) return '--'
  return `${val.toFixed(1)}`
}

/** Single timing-tower panel: gray label on top, big white mono value below */
function TimingPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t-2 border-[var(--f1-red)] bg-[var(--f1-panel)] p-3 rounded-sm">
      <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="text-2xl font-mono font-bold text-foreground truncate leading-tight mt-0.5">
        {value}
      </p>
    </div>
  )
}

export default function StatsDisplay({ stats, tracks }: StatsDisplayProps) {
  const allPoints = tracks?.flatMap((t) => t.points) ?? []
  const sectors = tracks && allPoints.length > 0
    ? computeSectors(allPoints, 3)
    : []

  const mainStats = [
    { label: 'Distance', value: `${stats.distanceKm.toFixed(2)} km` },
    { label: 'Time', value: formatDuration(stats.movingTime) },
    { label: 'Avg Speed', value: `${fmtSpeed(stats.avgSpeedKmh)} km/h` },
    { label: 'Max Speed', value: `${fmtSpeed(stats.maxSpeedKmh)} km/h` },
    { label: 'Elev Gain', value: fmt(stats.elevationGain, 'm') },
    { label: 'Elev Loss', value: fmt(stats.elevationLoss, 'm') },
    { label: 'Max Elev', value: fmt(stats.maxElevation, 'm') },
    { label: 'Min Elev', value: fmt(stats.minElevation, 'm') },
    { label: 'Avg Elev', value: fmt(stats.avgElevation, 'm') },
    { label: 'Avg Pace', value: formatPace(stats.avgSpeedKmh) },
  ]

  return (
    <div className="space-y-4">
      {/* Main timing tower grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-border">
        {mainStats.map((s) => (
          <TimingPanel key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      {/* Sector timing strip — info row */}
      {sectors.length > 0 && (
        <div className="bg-[var(--f1-panel)] rounded-sm border border-border overflow-hidden">
          <div className="flex divide-x divide-[var(--f1-red)]/40">
            {sectors.map((s, i) => (
              <div key={i} className="flex-1 px-3 py-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  SECTOR {i + 1}
                </p>
                <p className="text-sm font-mono text-foreground mt-0.5">
                  {s.distanceKm.toFixed(2)} km
                  <span className="mx-1.5 text-muted-foreground">·</span>
                  {s.avgSpeedKmh > 0 ? `${s.avgSpeedKmh.toFixed(1)} km/h` : '--'}
                </p>
              </div>
            ))}
          </div>

          {/* Sector color bars — full width, colored by sector pace */}
          <div className="flex h-2 w-full">
            {sectors.map((s, i) => (
              <div
                key={i}
                className="flex-1"
                style={{ backgroundColor: s.color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* F1 color legend */}
      <div className="flex items-center gap-4 justify-center">
        <div className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm" style={{ backgroundColor: SPEED_COLORS.yellow }} />
          <span className="text-[10px] font-mono text-muted-foreground">Slow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm" style={{ backgroundColor: SPEED_COLORS.green }} />
          <span className="text-[10px] font-mono text-muted-foreground">Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm" style={{ backgroundColor: SPEED_COLORS.purple }} />
          <span className="text-[10px] font-mono text-muted-foreground">Fast</span>
        </div>
      </div>
    </div>
  )
}

function formatPace(speedKmh: number): string {
  if (speedKmh <= 0) return '--'
  const minPerKm = 60 / speedKmh
  const min = Math.floor(minPerKm)
  const sec = Math.round((minPerKm - min) * 60)
  return `${min}:${String(sec).padStart(2, '0')} /km`
}
