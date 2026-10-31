// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { parseGpx } from './parser'

const wrap = (content: string) => `<gpx xmlns="http://www.topografix.com/GPX/1/1">${content}</gpx>`
const point = (lat: number, lon: number, elevation: number) =>
  `<trkpt lat="${lat}" lon="${lon}"><ele>${elevation}</ele></trkpt>`

describe('GPX parsing and segment statistics', () => {
  it('does not join separate segments or tracks for distance and elevation', () => {
    const data = parseGpx(wrap(`
      <trk><trkseg>${point(0, 0, 10)}${point(0, 0.001, 20)}</trkseg>
      <trkseg>${point(50, 50, 1000)}${point(50, 50.001, 1005)}</trkseg></trk>
      <trk><trkseg>${point(-40, -40, 2000)}${point(-40, -39.999, 2003)}</trkseg></trk>
    `))
    expect(data.tracks[0].segments).toHaveLength(2)
    expect(data.totalStats.distanceKm).toBeGreaterThan(0.2)
    expect(data.totalStats.distanceKm).toBeLessThan(0.4)
    expect(data.totalStats.elevationGain).toBe(18)
    expect(data.totalStats.elevationLoss).toBe(0)
    expect(data.tracks[0].stats.elevationGain).toBe(15)
  })

  it('supports missing optional elevation and time', () => {
    const data = parseGpx(wrap('<trk><trkseg><trkpt lat="1" lon="2"/><trkpt lat="1" lon="2.01"/></trkseg></trk>'))
    expect(data.totalStats.elevationGain).toBeNull()
    expect(data.totalStats.movingTime).toBe(0)
  })

  it('does not bridge missing elevations within a segment', () => {
    const data = parseGpx(wrap(`<trk><trkseg>${point(0, 0, 10)}<trkpt lat="0" lon="0.001"/>${point(0, 0.002, 100)}</trkseg></trk>`))
    expect(data.totalStats.elevationGain).toBe(0)
  })

  it.each([
    ['<not-gpx/>', /gpx root/],
    ['<gpx>', /Invalid XML/],
    [wrap('<trk><trkseg><trkpt lon="1"/></trkseg></trk>'), /lat coordinate/],
    [wrap('<wpt lat="91" lon="0"/>'), /lat coordinate/],
    [wrap('<rte><rtept lat="0" lon="181"/></rte>'), /lon coordinate/],
    [wrap('<wpt lat="0" lon="0"><ele>abc</ele></wpt>'), /ele value/],
    [wrap('<wpt lat="0" lon="0"><time>invalid</time></wpt>'), /time value/],
  ])('rejects invalid input', (xml, error) => {
    expect(() => parseGpx(xml)).toThrow(error)
  })
})
