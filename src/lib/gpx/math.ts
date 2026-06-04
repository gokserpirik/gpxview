import type { TrackPoint, TrackStats } from './types'

/** F1 speed colors */
export const SPEED_COLORS = {
  yellow: '#ffd500',
  green: '#00e030',
  purple: '#a200ff',
} as const

export type SpeedColor = keyof typeof SPEED_COLORS

/**
 * Haversine distance between two lat/lon points in meters.
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6_371_000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Calculate track statistics from a list of points.
 *
 * Handles missing elevation (reports null instead of 0).
 * Filters GPS noise spikes for max speed.
 */
export function calculateStats(points: TrackPoint[]): TrackStats {
  const hasElevation = points.some((p) => p.ele !== null)

  let elevationGain: number | null = null
  let elevationLoss: number | null = null
  let maxElevation: number | null = null
  let minElevation: number | null = null
  let avgElevation: number | null = null

  if (hasElevation) {
    const validElev = points.filter((p): p is TrackPoint & { ele: number } => p.ele !== null)
    const eleValues = validElev.map((p) => p.ele)
    maxElevation = Math.max(...eleValues)
    minElevation = Math.min(...eleValues)

    const sum = eleValues.reduce((a, b) => a + b, 0)
    avgElevation = Math.round(sum / eleValues.length)

    // Gain/loss from consecutive elevation deltas
    let gain = 0
    let loss = 0
    for (let i = 1; i < validElev.length; i++) {
      const diff = validElev[i].ele - validElev[i - 1].ele
      if (diff > 0) gain += diff
      else loss += Math.abs(diff)
    }
    elevationGain = Math.round(gain)
    elevationLoss = Math.round(loss)

    maxElevation = Math.round(maxElevation)
    minElevation = Math.round(minElevation)
  }

  // Distance and speed from consecutive points
  let totalDistance = 0
  const segments: { dist: number; timeSec: number }[] = []

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const dist = haversineDistance(prev.lat, prev.lon, curr.lat, curr.lon)
    totalDistance += dist

    if (curr.time && prev.time) {
      const timeSec = (curr.time.getTime() - prev.time.getTime()) / 1000
      if (timeSec > 0 && timeSec < 120) {
        const speedKmh = (dist / 1000) / (timeSec / 3600)
        // Filter impossible speeds: > 40 km/h is GPS noise
        if (speedKmh <= 40) {
          segments.push({ dist, timeSec })
        }
      }
    }
  }

  const distanceKm = totalDistance / 1000

  // Moving time: sum of segments where movement > 0.5 km/h
  let movingTime = 0
  for (const s of segments) {
    if (s.dist / s.timeSec > 0.14) {
      movingTime += s.timeSec
    }
  }
  // Fallback: total elapsed time
  if (movingTime === 0 && points.length > 1 && points[0].time && points[points.length - 1].time) {
    movingTime = Math.max(
      (points[points.length - 1].time!.getTime() - points[0].time!.getTime()) / 1000,
      0,
    )
  }

  // Speed stats — use median of top 5% for max speed to filter GPS noise
  let avgSpeedKmh = 0
  let maxSpeedKmh = 0
  let medianSpeedKmh = 0

  if (segments.length > 0) {
    const speedsKmh = segments.map(
      (s) => (s.dist / 1000) / (s.timeSec / 3600),
    )
    avgSpeedKmh =
      Math.round(
        (speedsKmh.reduce((a, b) => a + b, 0) / speedsKmh.length) * 100,
      ) / 100

    // Sort descending, take top 5%, return median of that slice
    const sorted = [...speedsKmh].sort((a, b) => b - a)
    const topN = Math.max(1, Math.floor(sorted.length * 0.05))
    const topSlice = sorted.slice(0, topN)
    const mid = Math.floor(topSlice.length / 2)
    maxSpeedKmh =
      Math.round(
        (topSlice.length % 2 === 0
          ? (topSlice[mid - 1] + topSlice[mid]) / 2
          : topSlice[mid]) * 100,
      ) / 100

    // Median of all valid speeds (robust reference for coloring)
    const sortedAsc = [...speedsKmh].sort((a, b) => a - b)
    const allMid = Math.floor(sortedAsc.length / 2)
    medianSpeedKmh =
      Math.round(
        (sortedAsc.length % 2 === 0
          ? (sortedAsc[allMid - 1] + sortedAsc[allMid]) / 2
          : sortedAsc[allMid]) * 100,
      ) / 100
  }

  return {
    distanceKm: Math.round(distanceKm * 100) / 100,
    elevationGain,
    elevationLoss,
    maxElevation,
    minElevation,
    avgElevation,
    movingTime,
    avgSpeedKmh,
    maxSpeedKmh,
    medianSpeedKmh,
  }
}

/**
 * Format seconds into HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Split a track into N sectors of **equal distance** (matching F1 convention).
 * Accumulates distance along points and splits at ~totalDistance / sectorCount.
 * Returns sector boundaries with distance, average speed, and sector color.
 */
export function computeSectors(
  points: TrackPoint[],
  sectorCount: number = 3,
): { startIdx: number; endIdx: number; distanceKm: number; avgSpeedKmh: number; color: string }[] {
  if (points.length < 2) return []

  // Pre-compute cumulative distance array
  const cumDist = [0]
  for (let i = 1; i < points.length; i++) {
    cumDist.push(
      cumDist[i - 1] + haversineDistance(points[i - 1].lat, points[i - 1].lon, points[i].lat, points[i].lon),
    )
  }
  const totalDist = cumDist[cumDist.length - 1]
  if (totalDist <= 0) return []

  const targetDist = totalDist / sectorCount
  const sectors: { startIdx: number; endIdx: number; distanceKm: number; avgSpeedKmh: number }[] = []

  let prevIdx = 0
  for (let s = 0; s < sectorCount; s++) {
    const target = targetDist * (s + 1)
    // Find the point index that first reaches this cumulative distance
    let nextIdx = prevIdx
    while (nextIdx < cumDist.length - 1 && cumDist[nextIdx] < target) {
      nextIdx++
    }
    // Ensure we advance at least 1 point and don't exceed bounds
    if (nextIdx <= prevIdx) nextIdx = prevIdx + 1
    if (nextIdx >= points.length) nextIdx = points.length - 1

    const sectorDist = cumDist[nextIdx] - cumDist[prevIdx]
    let sectorTime = 0
    for (let i = prevIdx + 1; i <= nextIdx; i++) {
      if (points[i].time && points[i - 1].time) {
        sectorTime += (points[i].time!.getTime() - points[i - 1].time!.getTime()) / 1000
      }
    }

    const distKm = Math.round((sectorDist / 1000) * 100) / 100
    const avgSpeed = sectorTime > 0
      ? Math.round(((sectorDist / 1000) / (sectorTime / 3600)) * 100) / 100
      : 0

    sectors.push({ startIdx: prevIdx, endIdx: nextIdx, distanceKm: distKm, avgSpeedKmh: avgSpeed })
    prevIdx = nextIdx
  }

  // Assign colors — compare each sector's avg speed to the max across all sectors
  const maxSectorSpeed = Math.max(...sectors.map((s) => s.avgSpeedKmh), 0)
  return sectors.map((s) => ({
    ...s,
    color: speedSegmentColor(s.avgSpeedKmh, maxSectorSpeed),
  }))
}

/**
 * Compute color for a speed segment relative to the track's max speed.
 * Gives better visual spread than median for steady-pace activities.
 *
 * F1 convention:
 *   🟪 Purple — fast (≥66% of max)
 *   🟩 Green  — medium (33–66% of max)
 *   🟨 Yellow — slow (<33% of max)
 */
export function speedSegmentColor(
  speedKmh: number,
  maxSpeedKmh: number,
): string {
  if (maxSpeedKmh <= 0) return SPEED_COLORS.green // default green
  const ratio = speedKmh / maxSpeedKmh
  if (ratio < 0.33) return SPEED_COLORS.yellow  // yellow — slow
  if (ratio < 0.66) return SPEED_COLORS.green // green — medium
  return SPEED_COLORS.purple                   // purple — fast
}
