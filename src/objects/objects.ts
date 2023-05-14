import { setupPlanets } from "./planet"
import { setupShip } from "./ship"
import { scene, objectsGroup } from "../renderer/renderer"

const setupObjects = () => {
  objectsGroup.clear()
  setupPlanets()
  setupShip()
  scene.add(objectsGroup)
}

export { setupObjects }
