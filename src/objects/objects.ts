import { setupPlanets } from "./planet"
import { setupShip } from "./ship"
import { setupSkybox } from "./skybox"

const setupObjects = () => {
  setupPlanets()
  setupShip()
  setupSkybox()
}

export { setupObjects }
