/* eslint-disable import/prefer-default-export */
import { controls, render } from "../renderer/renderer"
import { stats } from "../gui/gui"

const setupAnimate = () => {
  requestAnimationFrame(setupAnimate)

  controls.update()

  render()

  stats.update()
}

export { setupAnimate }
