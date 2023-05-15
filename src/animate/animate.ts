/* eslint-disable import/no-cycle */
import { controls, render } from "../renderer/renderer"
import { stats } from "../gui/gui"
import { animatePlanet, setupPlanetAnimation } from "./planet"
import { animateShip, setupShipAnimation } from "./ship"
import { setupKeyboardTracking } from "./util/keyboard"
import { animateExplosion } from "./explosion"

const animate = () => {
  requestAnimationFrame(animate)
  controls.update()

  animateShip()
  animatePlanet()
  animateExplosion()

  render()

  stats.update()
}

const setupAnimate = () => {
  setupKeyboardTracking()
  setupPlanetAnimation()
  setupShipAnimation()
  animate()
}

export { setupAnimate }
