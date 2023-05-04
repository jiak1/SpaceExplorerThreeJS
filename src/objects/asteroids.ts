import * as THREE from "three"
import { scene } from "../renderer/renderer"

//VERY INCOMPLETE. JUST A COPY OF PLANETS//

const asteroids: THREE.Mesh[] = []

const asteroidShader = {
  uniforms: {
    time: { type: "f", value: 0.0 },
    scale: { type: "f", value: 0.45 },
    amplitude: { type: "f", value: 1 },
    octaves: { type: "i", value: 6 },
  },
}

const createAsteroid = () => {
  const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(10, 10, 10)

  const asteroidMaterial = new THREE.ShaderMaterial({
    uniforms: asteroidShader.uniforms,
    vertexShader: asteroidShader.vertexShader,
    fragmentShader: asteroidShader.fragmentShader,
  })

  return new THREE.Mesh(geometry, asteroidMaterial)
}

const setupAsteroids = () => {
  const asteroid = createAsteroid()
  scene.add(asteroid)

  asteroids.push(asteroid)
}

export { setupAsteroids, asteroids }
