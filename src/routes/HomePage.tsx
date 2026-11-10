import { useState } from 'react'
import { ArrowRight, MapPinned, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@astryxdesign/core/Button'
import { Heading } from '@astryxdesign/core/Heading'
import { HStack } from '@astryxdesign/core/HStack'
import { Icon } from '@astryxdesign/core/Icon'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'
import FileDropZone from '#/components/FileDropZone'
import StatsDisplay, { SectorStrip } from '#/components/StatsDisplay'
import MapView from '#/components/MapView'
import { parseGpx, isGpxFile } from '#/lib/gpx'
import type { GpxData } from '#/lib/gpx'

function RoutePreview() {
  return (
    <VStack as="section" gap={4} className="pit-preview" aria-label="Preview of route analysis">
      <HStack gap={2} hAlign="between" vAlign="center">
        <Text type="label">ROUTE VIEW</Text>
        <Text type="supporting">ILLUSTRATION · NO FILE LOADED</Text>
      </HStack>
      <svg className="pit-preview-map" viewBox="0 0 640 450" role="img" aria-label="Illustrative route with three speed-colored sections">
        <defs>
          <pattern id="pit-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" className="pit-grid-line" fill="none" />
          </pattern>
        </defs>
        <rect width="640" height="450" fill="url(#pit-grid)" />
        <path d="M 84 340 C 135 370 175 330 204 280 S 270 213 325 222" className="pit-route-slow" />
        <path d="M 325 222 C 382 235 365 155 423 133 S 535 165 546 101" className="pit-route-medium" />
        <path d="M 546 101 C 531 61 476 72 448 94 C 407 122 401 209 333 265 S 211 325 204 280" className="pit-route-fast" />
        <circle cx="84" cy="340" r="8" className="pit-route-start" />
        <circle cx="84" cy="340" r="16" className="pit-route-start-ring" />
        <circle cx="204" cy="280" r="5" className="pit-route-node" />
        <circle cx="325" cy="222" r="5" className="pit-route-node" />
        <circle cx="546" cy="101" r="5" className="pit-route-node" />
      </svg>
      <HStack gap={5} wrap="wrap" className="pit-legend">
        <Text type="supporting">SLOW</Text>
        <Text type="supporting">MEDIUM</Text>
        <Text type="supporting">FAST</Text>
      </HStack>
    </VStack>
  )
}

export default function HomePage() {
  const [gpxData, setGpxData] = useState<GpxData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleFile(file: File) {
    setError(null)
    if (!isGpxFile(file)) {
      setError('Choose a .gpx file to continue. If you need one, see the export guide.')
      return
    }

    setLoading(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = parseGpx(event.target?.result as string)
        setGpxData(parsed)
      } catch (cause) {
        setError(`${cause instanceof Error ? cause.message : 'This GPX file could not be parsed.'} Try exporting it again or choose another file.`)
      } finally {
        setLoading(false)
      }
    }
    reader.onerror = () => {
      setError('This file could not be read. Try choosing it again.')
      setLoading(false)
    }
    reader.readAsText(file)
  }

  return (
    <VStack as="main" gap={0} className="pit-page">
      <VStack gap={6} className="pit-container">
        <HStack gap={4} hAlign="between" vAlign="center" wrap="wrap" className="pit-page-heading">
          <VStack gap={1}>
            <Heading level={1}>{gpxData ? (gpxData.name || 'Untitled activity') : 'Your activity, in focus.'}</Heading>
            <Text type="supporting" display="block">
              {gpxData
                ? `${gpxData.tracks.reduce((sum, track) => sum + track.points.length, 0).toLocaleString()} track points · ${gpxData.tracks.length} ${gpxData.tracks.length === 1 ? 'track' : 'tracks'} · ${gpxData.waypoints.length} ${gpxData.waypoints.length === 1 ? 'waypoint' : 'waypoints'}`
                : 'Open a GPX file to see the route and the numbers behind it.'}
            </Text>
          </VStack>
          {gpxData && <Button label="Upload another" variant="secondary" size="sm" icon={<Icon icon={RotateCcw} size="sm" />} onClick={() => { setGpxData(null); setError(null) }} />}
        </HStack>

        {!gpxData ? (
          <section className="pit-empty-grid" aria-label="Start a route analysis">
            <FileDropZone onFile={handleFile} disabled={loading} />
            <RoutePreview />
          </section>
        ) : (
          <VStack gap={8}>
            <section className="pit-workspace" aria-label="Route and activity statistics">
              <VStack as="section" gap={0} className="pit-map-panel" aria-label="Route map">
                <HStack gap={3} hAlign="between" vAlign="center" wrap="wrap" className="pit-map-toolbar">
                  <HStack gap={2} vAlign="center"><Icon icon={MapPinned} size="sm" /><Heading level={2}>Route map</Heading></HStack>
                  <Text type="supporting">SPEED-COLORED TRACK</Text>
                </HStack>
                <MapView tracks={gpxData.tracks} className="pit-map" />
                <HStack gap={5} wrap="wrap" className="pit-map-legend">
                  <Text type="supporting">SLOW</Text><Text type="supporting">MEDIUM</Text><Text type="supporting">FAST</Text>
                </HStack>
              </VStack>
              <StatsDisplay stats={gpxData.totalStats} />
            </section>
            <SectorStrip tracks={gpxData.tracks} />

            {(gpxData.tracks.length > 1 || gpxData.routes.length > 0 || gpxData.waypoints.length > 0) && (
              <section className="pit-file-details" aria-label="File details">
                {gpxData.tracks.length > 1 && (
                  <VStack gap={3}>
                    <Heading level={2}>Tracks</Heading>
                    <VStack as="ul" gap={0} className="pit-detail-list">
                      {gpxData.tracks.map((track, index) => <HStack as="li" gap={4} key={index}><Text>{track.name || `Track ${index + 1}`}</Text><Text type="supporting" hasTabularNumbers>{track.points.length.toLocaleString()} pts · {track.stats.distanceKm.toFixed(2)} km</Text></HStack>)}
                    </VStack>
                  </VStack>
                )}
                {gpxData.routes.length > 0 && (
                  <VStack gap={3}>
                    <Heading level={2}>Routes</Heading>
                    <VStack as="ul" gap={0} className="pit-detail-list">
                      {gpxData.routes.map((route, index) => <HStack as="li" gap={4} key={index}><Text>{route.name || `Route ${index + 1}`}</Text><Text type="supporting" hasTabularNumbers>{route.points.length.toLocaleString()} pts · {route.stats.distanceKm.toFixed(2)} km</Text></HStack>)}
                    </VStack>
                  </VStack>
                )}
                {gpxData.waypoints.length > 0 && (
                  <VStack gap={3}>
                    <Heading level={2}>Waypoints</Heading>
                    <VStack as="ul" gap={0} className="pit-detail-list">
                      {gpxData.waypoints.map((waypoint, index) => <HStack as="li" gap={4} key={index}><Text>{waypoint.name || `Waypoint ${index + 1}`}</Text><Text type="supporting" hasTabularNumbers>{waypoint.lat.toFixed(5)}, {waypoint.lon.toFixed(5)}</Text></HStack>)}
                    </VStack>
                  </VStack>
                )}
              </section>
            )}
          </VStack>
        )}

        <section aria-live="polite" aria-atomic="true">
          {loading && <Text type="supporting" display="block">Reading your GPX file…</Text>}
          {error && <Text type="body" display="block" className="pit-error" role="alert">{error}</Text>}
        </section>

        {!gpxData && <Link to="/how-to" className="pit-guide-link">Need a GPX file? See the export guide <Icon icon={ArrowRight} size="sm" /></Link>}
      </VStack>
    </VStack>
  )
}
