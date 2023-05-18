import * as THREE from "three"
import {
  asteroids,
  radiuses,
  angles,
  asteroidsX,
  asteroidsY,
  asteroidsZ,
} from "../objects/asteroids"
import { rotateSpeed } from "./planet"

const clock = new THREE.Clock()
let totalTime = 0

const animateAsteroids = () => {
  totalTime += clock.getDelta() * rotateSpeed
  let i = 0
  // Loop through the clusters
  asteroids.children.forEach((clusterGroup) => {
    // Loop through the objects in the cluster
    clusterGroup.children.forEach((object) => {
      const asteroid = object
      const x = Math.cos(angles[i] + totalTime) * radiuses[i]
      const y = 0
      const z = Math.sin(angles[i] + totalTime) * radiuses[i]
      asteroid.position.x = x + asteroidsX[i]
      asteroid.position.y = y + asteroidsY[i]
      asteroid.position.z = z + asteroidsZ[i]
      i += 1
    })
  })
  i = 0
}

export { animateAsteroids }
