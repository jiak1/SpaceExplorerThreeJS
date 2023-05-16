/* eslint-disable import/no-cycle */
import { controls, render } from "../renderer/renderer"
import { stats } from "../gui/gui"
import { animatePlanet, setupPlanetAnimation } from "./planet"
import { animateShip, setupShipAnimation } from "./ship"
import { setupKeyboardTracking } from "./util/keyboard"
import { animateExplosion } from "./explosion"

let animating = false

const animate = () => {
  requestAnimationFrame(animate)

  animatePlanet()
  animateExplosion()
  animateShip()

  render()

  stats.update()
}

const setupAnimate = () => {
  if (!animating) {
    setupKeyboardTracking()
    animate()
    animating = true
  }
  setupShipAnimation()
  setupPlanetAnimation()
}

export { setupAnimate }
