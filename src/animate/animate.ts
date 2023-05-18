/* eslint-disable import/no-cycle */
import { composer, controls, render, renderer } from "../renderer/renderer"
import { stats } from "../gui/gui"
import { animatePlanet, setupPlanetAnimation } from "./planet"
import { animateShip, setupShipAnimation } from "./ship"
import { setupKeyboardTracking } from "./util/keyboard"
import { animateExplosion } from "./explosion"
import { animateSun, setupSun } from "./sun"

let animating = false

const animate = () => {
  requestAnimationFrame(animate)

  animatePlanet()
  animateExplosion()
  animateShip()
  animateSun()

  render()

  stats.update()
}

const setupAnimate = () => {
  if (!animating) {
    setupKeyboardTracking()
    animate()
    animating = true
  }
  setupSun()
  setupShipAnimation()
  setupPlanetAnimation()
}

export { setupAnimate }
