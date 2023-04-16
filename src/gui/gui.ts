import { GUI } from "dat.gui"
import Stats from "three/examples/jsm/libs/stats.module"
import { camera } from "../renderer/renderer"
import { planets } from "../objects/planet"

let stats: Stats
let gui: GUI

const setupGUI = () => {
  stats = Stats()
  document.body.appendChild(stats.dom)

  gui = new GUI()
  const cubeFolder = gui.addFolder("Cube")
  cubeFolder.add(planets[0].rotation, "x", 0, Math.PI * 2, 0.01)
  cubeFolder.add(planets[0].rotation, "y", 0, Math.PI * 2, 0.01)
  cubeFolder.add(planets[0].rotation, "z", 0, Math.PI * 2, 0.01)
  cubeFolder.open()

  const planetFolder = gui.addFolder("Planet")
  planetFolder.add(
    (planets[0].material as THREE.ShaderMaterial).uniforms.amplitude,
    "value",
    0,
    1,
    0.01
  )
  planetFolder.add(
    (planets[0].material as THREE.ShaderMaterial).uniforms.octaves,
    "value",
    4,
    20,
    1
  )
  planetFolder.open()

  const cameraFolder = gui.addFolder("Camera")
  cameraFolder.add(camera.position, "z", 0, 10, 0.01)
  cameraFolder.open()
}

export { setupGUI, stats, gui }
