import { setupPlanets } from "./planet"
import { setupShip } from "./ship"
import { setupSkybox } from "./skybox"
import { setupAsteroids } from "./asteroids"
import { scene, objectsGroup } from "../renderer/renderer"
import { setupExplosion } from "./explosion"

const setupObjects = () => {
  objectsGroup.clear()
  setupPlanets()
  setupShip()
  setupSkybox()
  setupAsteroids()
  setupExplosion()
  scene.add(objectsGroup)
}

export { setupObjects }
