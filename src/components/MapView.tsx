import { useEffect, useRef, useState } from 'react'
import type { GpxTrack } from '#/lib/gpx'
import { computeSectors } from '#/lib/gpx'

interface MapViewProps {
  tracks: GpxTrack[]
  className?: string
}

export default function MapView({ tracks, className = '' }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const LRef = useRef<any>(null)
  const [isReady, setIsReady] = useState(false)

  // Mount Leaflet once (client-side only)
  useEffect(() => {
    let cancelled = false

    async function setup() {
      try {
        await import('leaflet/dist/leaflet.css')
      } catch {
        // ignore
      }

      const L = await import('leaflet')

      if (cancelled || !mapContainerRef.current) return

      LRef.current = L

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true,
        center: [0, 0],
        zoom: 2,
      })

      // CartoDB Dark Matter tiles
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
          maxZoom: 19,
        },
      ).addTo(map)

      mapInstanceRef.current = map
      setIsReady(true)
    }

    setup()

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Draw/redraw sector-colored polylines when tracks change
  useEffect(() => {
    const L = LRef.current
    const map = mapInstanceRef.current
    if (!L || !map || tracks.length === 0) return

    map.invalidateSize()

    // Clear old GPX layers
    const toRemove: any[] = []
    map.eachLayer((layer: any) => {
      if (layer._isGpxOverlay) {
        toRemove.push(layer)
      }
    })
    toRemove.forEach((layer) => map.removeLayer(layer))

    const allBounds: [number, number][] = []

    tracks.forEach((track) => {
      if (track.points.length < 2) return

      const pts = track.points

      // Compute sectors — each gets a color based on its avg speed vs max
      const sectors = computeSectors(pts, 3)
      if (sectors.length === 0) return

      for (const sector of sectors) {
        const segmentPts: [number, number][] = []
        for (let i = sector.startIdx; i <= sector.endIdx; i++) {
          segmentPts.push([pts[i].lat, pts[i].lon])
          allBounds.push([pts[i].lat, pts[i].lon])
        }

        if (segmentPts.length < 2) continue

        L.polyline(segmentPts, {
          color: sector.color,
          weight: 3,
          opacity: 0.85,
          _isGpxOverlay: true,
        }).addTo(map)
      }
    })

    if (allBounds.length > 0) {
      map.fitBounds(allBounds, { padding: [50, 50] })
    }
  }, [tracks, isReady])

  return (
    <div className={`relative ${className}`} style={{ minHeight: '400px' }}>
      {!isReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--f1-carbon)]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="size-5 animate-spin rounded-full border-2 border-[var(--f1-red)] border-t-transparent" />
            <span className="font-mono text-sm">Loading map...</span>
          </div>
        </div>
      )}
      <div
        ref={mapContainerRef}
        className="h-96 w-full"
        style={{ minHeight: '400px' }}
      />
    </div>
  )
}
