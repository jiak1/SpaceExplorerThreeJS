import { setupPlanets } from "./planet"
import { setupShip } from "./ship"
import { setupSkybox } from "./skybox"
import { scene, objectsGroup } from "../renderer/renderer"

const setupObjects = () => {
  objectsGroup.clear()
  setupPlanets()
  setupShip()
  setupSkybox()
  scene.add(objectsGroup)
}

export { setupObjects }
