import { Heading } from '@astryxdesign/core/Heading'
import { HStack } from '@astryxdesign/core/HStack'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import type { GpxTrack, TrackStats } from '#/lib/gpx'
import { computeSectors, formatDuration, SPEED_COLORS } from '#/lib/gpx'

interface StatsDisplayProps {
  stats: TrackStats
}

const formatMeters = (value: number | null) => value === null ? '—' : `${value} m`
const formatSpeed = (value: number) => value > 0 ? `${value.toFixed(1)} km/h` : '—'

function formatPace(speedKmh: number): string {
  if (speedKmh <= 0) return '—'
  const totalSeconds = Math.round(3600 / speedKmh)
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')} /km`
}

export default function StatsDisplay({ stats }: StatsDisplayProps) {
  const rows = [
    { label: 'Distance', value: `${stats.distanceKm.toFixed(2)} km`, lead: true },
    { label: 'Moving time', value: stats.movingTime > 0 ? formatDuration(stats.movingTime) : '—' },
    { label: 'Average speed', value: formatSpeed(stats.avgSpeedKmh) },
    { label: 'Peak speed*', value: formatSpeed(stats.maxSpeedKmh) },
    { label: 'Average pace', value: formatPace(stats.avgSpeedKmh) },
    { label: 'Elevation gain', value: formatMeters(stats.elevationGain) },
    { label: 'Elevation loss', value: formatMeters(stats.elevationLoss) },
    { label: 'Highest point', value: formatMeters(stats.maxElevation) },
    { label: 'Lowest point', value: formatMeters(stats.minElevation) },
    { label: 'Average elevation', value: formatMeters(stats.avgElevation) },
  ]

  return (
    <VStack as="aside" gap={4} className="pit-tower" aria-label="Activity statistics">
      <HStack gap={2} vAlign="center" className="pit-panel-heading">
        <Heading level={2}>Timing tower</Heading>
        <Text type="supporting">ACTIVITY DATA</Text>
      </HStack>
      <VStack as="dl" gap={0} className="pit-tower-list">
        {rows.map((row) => (
          <HStack as="div" key={row.label} gap={3} vAlign="center" hAlign="between" className={`pit-tower-row ${row.lead ? 'pit-tower-lead' : ''}`}>
            <dt><Text type="supporting">{row.label}</Text></dt>
            <dd><Text type={row.lead ? 'large' : 'body'} weight="semibold" hasTabularNumbers className="pit-value">{row.value}</Text></dd>
          </HStack>
        ))}
      </VStack>
      <Text type="supporting" display="block" className="pit-note">
        *Peak speed is the median of the fastest 5% of valid intervals. Long gaps and implausible GPS jumps are excluded from speed and moving-time calculations.
      </Text>
    </VStack>
  )
}

export function SectorStrip({ tracks }: { tracks: GpxTrack[] }) {
  const segments = tracks.flatMap((track) => track.segments).filter((segment) => segment.length > 1)
  const sectors = segments.length === 1 ? computeSectors(segments[0], 3) : []

  return (
    <VStack as="section" gap={3} aria-label="Sector breakdown">
      <HStack gap={3} vAlign="center" hAlign="between" wrap="wrap">
        <Heading level={2}>Sector analysis</Heading>
        <Text type="supporting">EQUAL-DISTANCE SPLITS</Text>
      </HStack>
      {sectors.length > 0 ? (
        <VStack as="ol" gap={0} className="pit-sectors">
          {sectors.map((sector, index) => (
            <VStack as="li" gap={0} key={index} className={`pit-sector pit-sector-${sector.color === SPEED_COLORS.yellow ? 'slow' : sector.color === SPEED_COLORS.green ? 'medium' : 'fast'}`}>
              <VStack gap={1}>
                <Text type="label" color="secondary">SECTOR {index + 1}</Text>
                <Text type="large" weight="semibold" hasTabularNumbers display="block">
                  {sector.avgSpeedKmh > 0 ? `${sector.avgSpeedKmh.toFixed(1)} km/h` : '—'}
                </Text>
                <Text type="supporting" hasTabularNumbers>{sector.distanceKm.toFixed(2)} km</Text>
              </VStack>
            </VStack>
          ))}
        </VStack>
      ) : (
        <Text type="supporting" display="block" className="pit-unavailable">
          Sector splits are available when the file contains one continuous track segment.
        </Text>
      )}
    </VStack>
  )
}
