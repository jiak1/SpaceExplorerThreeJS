import * as THREE from "three"
import { scene } from "../renderer/renderer"
import { createPlanet } from "./planet"

const planets: THREE.Mesh[] = []

const setupObjects = () => {
  const planet = createPlanet()
  scene.add(planet)

  planets.push(planet)
}

export { setupObjects, planets }
