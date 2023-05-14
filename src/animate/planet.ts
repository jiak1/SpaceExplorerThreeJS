import * as THREE from "three"
import { getRandomFloat } from "../util/random"
import { planets } from "../objects/planet"

const clock = new THREE.Clock()
let totalTime = 0

const offsets = []

for (let i = 0; i < 15; i++) {
  offsets.push(getRandomFloat(0.0, 100.0))
}

export const animatePlanet = () => {
  totalTime += clock.getDelta() * 1

  if (planets) {
    const dist_apart = 200
    const min_dist = 2

    for (let i = 1; i <= planets.length; i++) {
      const angle = (2 * Math.PI + totalTime + offsets[i]) / planets.length
      const planet = planets[i - 1]

      const x = (i + min_dist) * dist_apart * Math.cos(i * angle)
      const y = (i + min_dist) * dist_apart * Math.sin(i * angle)

      planet.position.x = x
      planet.position.z = y
    }
  }
}
