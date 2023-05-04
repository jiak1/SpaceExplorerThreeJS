import * as THREE from "three"
import { planets } from "../objects/planet"

const clock = new THREE.Clock()
let totalTime = 0

export const animatePlanet = () => {
  totalTime += clock.getDelta() * 0.1

  if (planets) {
    const dist_apart = 100
    const angle = (2 * Math.PI + totalTime) / planets.length
    for (let i = 1; i <= planets.length; i++) {
      const planet = planets[i - 1]

      const x = i * dist_apart * Math.cos(i * angle)
      const y = i * dist_apart * Math.sin(i * angle)

      planet.position.x = x
      planet.position.z = y
    }
  }
}
