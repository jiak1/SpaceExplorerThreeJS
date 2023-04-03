import { planets } from "../objects/objects"
import { controls, render } from "../renderer/renderer"
import { stats } from "../gui/gui"

const setupAnimate = () => {
  requestAnimationFrame(setupAnimate)

  controls.update()

  const planetMat = planets[0].material as THREE.ShaderMaterial
  planetMat.uniforms.time.value += 0.1

  render()

  stats.update()
}

export { setupAnimate }
