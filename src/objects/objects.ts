import { setupPlanets } from "./planet"
import { setupShip } from "./ship"
import { setupSkybox } from "./skybox"
import { setupAsteroids } from "./asteroids"

const setupObjects = () => {
  setupPlanets()
  setupShip()
  setupSkybox()
  setupAsteroids()
}

export { setupObjects }
