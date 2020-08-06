import { request } from './OSMcommand'
import decode from './decodePolygon'
import { draw, findGround, naturalBlock, setWall, printBlocks } from './drawLines'

importPackage(Packages.com.sk89q.worldedit)
importPackage(Packages.com.sk89q.worldedit.math)
importPackage(Packages.com.sk89q.worldedit.blocks)

export function hedges (options) {
  request(options.radius, options.center, (s, n) => {
    return `(way[landuse~"farmland"](${s.join(',')},${n.join(',')});>;);out;`
  }, callback)

  function callback (data) {
    const lines = decode(data)
    const findGround_ = findGround(options)
    const naturalBlock_ = naturalBlock(options)
    const setWall_ = setWall(options)
    draw(lines, (pos) => {
      if (naturalBlock_(pos)) {
        pos = findGround_(pos)
        setWall_(pos)
      }
    })
    printBlocks()
  }
}
