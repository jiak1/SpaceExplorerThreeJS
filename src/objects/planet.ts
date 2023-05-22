/* eslint-disable prefer-destructuring */
import * as THREE from "three"
import { objectsGroup } from "../renderer/renderer"
import { getRandomInt } from "../util/random"

const NoiseJS = require("noisejs")

const Chance = require("chance")

let planets: THREE.Group[] = []

const planetColours = [
  [
    new THREE.Color(20, 161, 43),
    new THREE.Color(48, 204, 48),
    new THREE.Color(28, 97, 232),
    new THREE.Color(38, 69, 199),
  ],
  [
    new THREE.Color(152, 38, 73),
    new THREE.Color(124, 132, 131),
    new THREE.Color(113, 162, 182),
    new THREE.Color(96, 178, 229),
  ],
  [
    new THREE.Color(255, 137, 102),
    new THREE.Color(229, 68, 109),
    new THREE.Color(248, 244, 227),
    new THREE.Color(112, 108, 97),
  ],
  [
    new THREE.Color(206, 132, 173),
    new THREE.Color(206, 150, 166),
    new THREE.Color(212, 203, 179),
    new THREE.Color(210, 224, 191),
  ],
  [
    new THREE.Color(247, 219, 167),
    new THREE.Color(241, 171, 134),
    new THREE.Color(197, 123, 87),
    new THREE.Color(30, 45, 47),
  ],
  [
    new THREE.Color(158, 0, 49),
    new THREE.Color(142, 0, 49),
    new THREE.Color(119, 0, 88),
    new THREE.Color(96, 0, 71),
  ],
]

let planetCount = 2
let seed = getRandomInt(0, 10000)
let chance = new Chance(seed)
let noiseGenerator = new NoiseJS.Noise(seed)

// Source (https://observablehq.com/@toja/procedural-texturing-w-perlin-noise)
// This function helps map a 2d texture to a 3d sphere
function getSphereCoordinates(u, v) {
  const lon = ((u * 360 - 180) * Math.PI) / 180
  const lat = ((v * 180 - 90) * Math.PI) / 180

  return [
    (Math.cos(lat) * Math.cos(lon) + 1) / 2,
    (Math.sin(lat) + 1) / 2,
    (Math.cos(lat) * Math.sin(lon) + 1) / 2,
  ]
}

function generatePlanetMaps(
  width: number,
  height: number,
  scale: number,
  xOffset: number,
  yOffset: number,
  colors: THREE.Color[]
): THREE.DataTexture[] {
  const size = width * height
  const textureMap = new Uint8Array(4 * size)
  const bumpMap = new Uint8Array(4 * size)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const coords = getSphereCoordinates(
        (x + xOffset) / (width - 1),
        (y + yOffset) / (height - 1)
      )
      const value = noiseGenerator.simplex3(
        coords[0] / scale,
        coords[1] / scale,
        coords[2] / scale
      )
      const index = (y * width + x) * 4

      const boundedPerlin = (value + 1) / 2

      let col = new THREE.Color("#FFFFFF").lerp(
        new THREE.Color("#000000"),
        boundedPerlin
      )

      bumpMap[index] = col.r * 255
      bumpMap[index + 1] = col.g * 255
      bumpMap[index + 2] = col.b * 255
      bumpMap[index + 3] = 255

      col = new THREE.Color("#ffffff")
      if (value > 0.15) {
        col = colors[0]
      } else if (value > 0.1) {
        col = colors[1]
      } else if (value > -0.2) {
        col = colors[2]
      } else {
        col = colors[3]
      }

      textureMap[index] = col.r
      textureMap[index + 1] = col.g
      textureMap[index + 2] = col.b
      textureMap[index + 3] = 255
    }
  }

  const colorTexture = new THREE.DataTexture(textureMap, width, height)
  colorTexture.needsUpdate = true

  const bumpTexture = new THREE.DataTexture(bumpMap, width, height)
  bumpTexture.needsUpdate = true

  return [colorTexture, bumpTexture]
}

const updatePlanetCount = (newVal) => (planetCount = newVal)

const updatePlanetSeed = (newVal) => (seed = newVal)

const getColours = () =>
  planetColours[chance.integer({ min: 0, max: planetColours.length - 1 })]

const createPlanet = () => {
  const size = chance.integer({ min: 60, max: 300 })
  const geometry: THREE.SphereGeometry = new THREE.SphereGeometry(
    size,
    size * 2,
    size * 2
  )

  const width = 500 // Width of the bump map
  const height = 250 // Height of the bump map

  const planetGroup = new THREE.Group()

  const chosenColors = getColours()
  const textures = generatePlanetMaps(
    width,
    height,
    0.5,
    chance.integer({ min: -1000000, max: 1000000 }),
    chance.integer({ min: -1000000, max: 1000000 }),
    chosenColors
  )

  const planetMaterial = new THREE.MeshPhongMaterial({
    map: textures[0],
    bumpScale: 30,
    bumpMap: textures[1],
    flatShading: true,
  })

  const planetMesh = new THREE.Mesh(geometry, planetMaterial.clone())
  planetMesh.name = "Planet Mesh"
  planetGroup.add(planetMesh)

  const spawnRing = chance.integer({ min: 0, max: 100 })
  if (spawnRing < 20) {
    const ringColor =
      chosenColors[chance.integer({ min: 0, max: chosenColors.length - 1 })]

    const ringMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color(
        ringColor.r / 255,
        ringColor.g / 255,
        ringColor.b / 255
      ),
    })

    const ringGeometry = new THREE.TorusGeometry(
      size * 1.2,
      size * 0.1,
      size,
      size
    )
    const planetRing = new THREE.Mesh(ringGeometry, ringMaterial.clone())
    planetRing.rotation.x = Math.PI / 2
    planetRing.name = "Planet Ring"
    planetGroup.add(planetRing)
  }

  return planetGroup
}

const setupPlanets = () => {
  planets = []
  chance = new Chance(seed)
  noiseGenerator = new NoiseJS.Noise(seed)

  for (let i = 1; i <= planetCount; i++) {
    const planetGroup = createPlanet()
    planetGroup.name = `Planet Group  ${i}`

    const y = getRandomInt(-50, 50)
    planetGroup.position.y = y

    objectsGroup.add(planetGroup)
    planets.push(planetGroup)
  }
}

export {
  setupPlanets,
  planets,
  updatePlanetCount,
  updatePlanetSeed,
  planetCount,
  seed,
}
