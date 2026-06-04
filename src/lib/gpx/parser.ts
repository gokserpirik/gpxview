import type { TrackPoint, GpxTrack, GpxRoute, GpxWaypoint, GpxData, TrackStats } from './types'
import { calculateStats } from './math'

/**
 * Parse a GPX XML string into structured data using the browser's native DOMParser.
 * Zero dependencies — works in browser and SSR (with shim).
 */
export function parseGpx(xmlString: string): GpxData {
  let parser: DOMParser

  if (typeof DOMParser !== 'undefined') {
    parser = new DOMParser()
  } else {
    // SSR fallback — minimal shim
    throw new Error(
      'DOMParser not available. GPX parsing is only supported in the browser.',
    )
  }

  const xmlDoc = parser.parseFromString(xmlString, 'text/xml')
  const parseError = xmlDoc.querySelector('parsererror')
  if (parseError) {
    throw new Error(`Invalid XML: ${parseError.textContent}`)
  }

  const name = getElementValue(xmlDoc.documentElement, 'name') || 'Unnamed Activity'
  const tracks = parseTracks(xmlDoc)
  const routes = parseRoutes(xmlDoc)
  const waypoints = parseWaypoints(xmlDoc)

  // Compute overall stats across all tracks
  const allPoints = tracks.flatMap((t) => t.points)
  const totalStats = allPoints.length > 0 ? calculateStats(allPoints) : defaultStats()

  return { name, tracks, routes, waypoints, totalStats }
}

function parseTracks(xmlDoc: XMLDocument): GpxTrack[] {
  const trkElements = xmlDoc.getElementsByTagName('trk')
  return Array.from(trkElements).map((trk) => {
    const name = getElementValue(trk, 'name') || 'Unnamed Track'
    const points = parseTrackPoints(trk)
    const stats = calculateStats(points)
    return { name, points, stats }
  })
}

function parseRoutes(xmlDoc: XMLDocument): GpxRoute[] {
  const rteElements = xmlDoc.getElementsByTagName('rte')
  return Array.from(rteElements).map((rte) => {
    const name = getElementValue(rte, 'name') || 'Unnamed Route'
    const points = parseRoutePoints(rte)
    const stats = calculateStats(points)
    return { name, points, stats }
  })
}

function parseWaypoints(xmlDoc: XMLDocument): GpxWaypoint[] {
  const wptElements = xmlDoc.getElementsByTagName('wpt')
  return Array.from(wptElements).map((wpt) => ({
    name: getElementValue(wpt, 'name') || 'Unnamed Waypoint',
    lat: parseFloat(wpt.getAttribute('lat') || '0'),
    lon: parseFloat(wpt.getAttribute('lon') || '0'),
    ele: parseOptionalNumber(wpt, 'ele'),
    time: parseOptionalDate(wpt, 'time'),
    comment: getElementValue(wpt, 'cmt') || undefined,
    description: getElementValue(wpt, 'desc') || undefined,
  }))
}

function parseTrackPoints(trk: Element): TrackPoint[] {
  const trksegElements = trk.getElementsByTagName('trkseg')
  if (trksegElements.length > 0) {
    return Array.from(trksegElements).flatMap((seg) => parsePointsFromContainer(seg))
  }
  // Fallback for tracks without segments
  return parsePointsFromContainer(trk)
}

function parseRoutePoints(rte: Element): TrackPoint[] {
  return parsePointsFromContainer(rte, 'rtept')
}

function parsePointsFromContainer(
  container: Element,
  tagName: string = 'trkpt',
): TrackPoint[] {
  const elements = container.getElementsByTagName(tagName)
  return Array.from(elements).map((el) => ({
    lat: parseFloat(el.getAttribute('lat') || '0'),
    lon: parseFloat(el.getAttribute('lon') || '0'),
    ele: parseOptionalNumber(el, 'ele'),
    time: parseOptionalDate(el, 'time'),
  }))
}

function getElementValue(parent: Element, tagName: string): string | null {
  const el = parent.getElementsByTagName(tagName)[0]
  return el?.textContent ?? null
}

function parseOptionalNumber(parent: Element, tagName: string): number | null {
  const val = getElementValue(parent, tagName)
  return val !== null ? parseFloat(val) : null
}

function parseOptionalDate(parent: Element, tagName: string): Date | null {
  const val = getElementValue(parent, tagName)
  return val !== null ? new Date(val) : null
}

function defaultStats(): TrackStats {
  return {
    distanceKm: 0,
    elevationGain: null,
    elevationLoss: null,
    maxElevation: null,
    minElevation: null,
    avgElevation: null,
    movingTime: 0,
    avgSpeedKmh: 0,
    maxSpeedKmh: 0,
    medianSpeedKmh: 0,
  }
}

export function isGpxFile(file: File): boolean {
  return (
    file.name.toLowerCase().endsWith('.gpx') ||
    file.type === 'application/gpx+xml' ||
    file.type === 'text/xml'
  )
}
