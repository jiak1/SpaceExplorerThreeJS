import { setupPlanets } from "./planet"
import { setupShip } from "./ship"
import { setupAsteroids } from "./asteroids"
import { scene, objectsGroup } from "../renderer/renderer"
import { setupExplosion } from "./explosion"
import { setupSun } from "./sun"

const setupObjects = () => {
  objectsGroup.clear()
  setupPlanets()
  setupShip()
  setupAsteroids()
  setupExplosion()
  setupSun()
  scene.add(objectsGroup)
}

export { setupObjects }
