import * as THREE from "three"
import { scene } from "../renderer/renderer"
// Particle system variables
const particles = []
let particleGeometry

const setupExplosion = () => {
  particleGeometry = new THREE.BufferGeometry()
  const particleMaterial = new THREE.PointsMaterial({
    color: "#FFA500",
    size: 1,
  })

  const positions = new Float32Array(particles.length * 3)
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  )

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
  particleSystem.frustumCulled = false
  scene.add(particleSystem)
}

function createParticle(position, velocity, lifespan) {
  const particle = {
    position: position.clone(),
    velocity: velocity.clone(),
    lifespan,
  }
  particles.push(particle)
}

function updateParticles(deltaTime) {
  const positions = []

  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i]

    particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime))

    particle.lifespan -= deltaTime
    if (particle.lifespan <= 0) {
      particles.splice(i, 1)
    } else {
      positions.push(
        particle.position.x,
        particle.position.y,
        particle.position.z
      )
    }
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  )
  particleGeometry.attributes.position.needsUpdate = true
}

function triggerExplosion(explosionPosition) {
  const numParticles = 1000
  for (let i = 0; i < numParticles; i++) {
    const velocity = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).multiplyScalar(50)

    const lifespan = Math.random()

    createParticle(explosionPosition, velocity, lifespan)
  }
}

export { setupExplosion, updateParticles, triggerExplosion }
