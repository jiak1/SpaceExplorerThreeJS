import * as THREE from "three"
import { getRandomFloat } from "../util/random"
import { planets } from "../objects/planet"

const clock = new THREE.Clock()
let totalTime = 0
let rotateSpeed = 0.1

let offsets = []

const setupPlanetAnimation = () => {
  offsets = []
  for (let i = 0; i <= planets.length; i++) {
    offsets.push(getRandomFloat(0.0, 100.0))
  }
}

const animatePlanet = () => {
  totalTime += clock.getDelta() * rotateSpeed

  if (planets) {
    const dist_apart = 350
    const min_dist = 2

    for (let i = 1; i <= planets.length; i++) {
      const angle = (2 * Math.PI + totalTime + offsets[i - 1]) / planets.length
      const planet = planets[i - 1]

      const x = (i + min_dist) * dist_apart * Math.cos(i * angle)
      const y = (i + min_dist) * dist_apart * Math.sin(i * angle)

      planet.position.x = x
      planet.position.z = y
    }
  }
}

const updateRotateSpeed = (newSpeed) => (rotateSpeed = newSpeed)

export { animatePlanet, rotateSpeed, updateRotateSpeed, setupPlanetAnimation }
