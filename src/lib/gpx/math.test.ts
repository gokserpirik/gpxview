import { describe, expect, it } from 'vitest'
import { calculateSegmentStats, calculateStats } from './math'
import type { TrackPoint } from './types'

function point(lon: number, seconds: number | null): TrackPoint {
  return { lat: 0, lon, ele: null, time: seconds === null ? null : new Date(seconds * 1000) }
}

describe('speed and moving time', () => {
  it('includes cycling speeds above 40 km/h and weights average speed by time', () => {
    // Approximately 50 km/h for 10 seconds, then 10 km/h for 30 seconds.
    const stats = calculateStats([point(0, 0), point(0.001249, 10), point(0.001998, 40)])
    expect(stats.movingTime).toBe(40)
    expect(stats.avgSpeedKmh).toBeCloseTo(20, 0)
    expect(stats.maxSpeedKmh).toBeGreaterThan(40)
  })

  it('excludes stationary intervals from moving speed and time', () => {
    const stats = calculateStats([point(0, 0), point(0.001, 10), point(0.001, 30)])
    expect(stats.movingTime).toBe(10)
    expect(stats.avgSpeedKmh).toBeCloseTo(40.03, 1)
  })

  it('excludes implausible jumps and long gaps from speed metrics', () => {
    const stats = calculateStats([point(0, 0), point(1, 1), point(1.01, 121)])
    expect(stats.movingTime).toBe(0)
    expect(stats.avgSpeedKmh).toBe(0)
    expect(stats.maxSpeedKmh).toBe(0)
  })

  it('does not infer speed from missing timestamps or across segment boundaries', () => {
    const stats = calculateSegmentStats([
      [point(0, 0), point(0.001, null)],
      [point(1, 20), point(1.001, null)],
    ])
    expect(stats.movingTime).toBe(0)
    expect(stats.avgSpeedKmh).toBe(0)
  })
})
