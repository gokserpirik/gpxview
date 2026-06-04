export interface TrackPoint {
  lat: number
  lon: number
  ele: number | null
  time: Date | null
}

export interface GpxTrack {
  name: string
  points: TrackPoint[]
  stats: TrackStats
}

export interface GpxRoute {
  name: string
  points: TrackPoint[]
  stats: TrackStats
}

export interface GpxWaypoint {
  name: string
  lat: number
  lon: number
  ele: number | null
  time: Date | null
  comment?: string
  description?: string
}

export interface TrackStats {
  distanceKm: number
  /** null when no elevation data in file */
  elevationGain: number | null
  /** null when no elevation data in file */
  elevationLoss: number | null
  /** null when no elevation data in file */
  maxElevation: number | null
  /** null when no elevation data in file */
  minElevation: number | null
  /** null when no elevation data in file */
  avgElevation: number | null
  movingTime: number // seconds
  avgSpeedKmh: number
  maxSpeedKmh: number
  /** Median segment speed — robust reference for speed coloring */
  medianSpeedKmh: number
}

export interface GpxData {
  name: string
  tracks: GpxTrack[]
  routes: GpxRoute[]
  waypoints: GpxWaypoint[]
  totalStats: TrackStats
}

/** GPS accuracy / pace summary for display */
export type PaceUnit = 'min-per-km' | 'min-per-mi'
