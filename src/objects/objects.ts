import { setupPlanets } from "./planet"
import { setupShip } from "./ship"
import { scene, objectsGroup } from "../renderer/renderer"
import { setupExplosion } from "./explosion"

const setupObjects = () => {
  objectsGroup.clear()
  setupPlanets()
  setupShip()
  setupExplosion()
  scene.add(objectsGroup)
}

export { setupObjects }
