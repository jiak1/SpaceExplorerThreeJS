import * as THREE from "three"
import {
  triggerExplosion,
  updateParticles,
  triggerExhaust,
} from "../objects/explosion"

const clock = new THREE.Clock()
const animateExplosion = () => {
  // Calculate the time difference since the last frame
  const deltaTime = clock.getDelta()

  // Update the particles
  updateParticles(deltaTime)
}

const animateExhaust = () => {
  // Calculate the time difference since the last frame
  const deltaTime = clock.getDelta()

  // Update the particles
  updateParticles(deltaTime)
}

export { animateExplosion, animateExhaust }
