import * as THREE from "three"
import { objectsGroup } from "../renderer/renderer"

let sun

const createSun = () => {
  const geometry: THREE.SphereGeometry = new THREE.SphereGeometry(700, 32, 32)

  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load("textures/sun.jpg")

  // Create a new shader material for the face
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  })

  // Create a mesh with the box geometry and the array of materials
  return new THREE.Mesh(geometry, material)
}

const setupSun = () => {
  sun = createSun()
  sun.name = "Planet Sun"
  objectsGroup.add(sun)
}

export { setupSun, sun }
