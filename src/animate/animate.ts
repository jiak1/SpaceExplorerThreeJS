import { controls, render } from "../renderer/renderer"
import { stats } from "../gui/gui"
import { animatePlanet } from "./planet"
import { animateShip } from "./ship"
import { setupKeyboardTracking } from "./util/keyboard"

const animate = () => {
  requestAnimationFrame(animate)
  controls.update()

  animateShip()
  animatePlanet()

  render()

  stats.update()
}

const setupAnimate = () => {
  setupKeyboardTracking()
  animate()
}

export { setupAnimate }