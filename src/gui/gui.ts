import { GUI } from "dat.gui"
import Stats from "three/examples/jsm/libs/stats.module"
import { camera } from "../renderer/renderer"
import { cube } from "../objects/objects"

let stats
let gui

const setupGUI = () => {
  stats = Stats()
  document.body.appendChild(stats.dom)

  gui = new GUI()
  const cubeFolder = gui.addFolder("Cube")
  cubeFolder.add(cube.rotation, "x", 0, Math.PI * 2, 0.01)
  cubeFolder.add(cube.rotation, "y", 0, Math.PI * 2, 0.01)
  cubeFolder.add(cube.rotation, "z", 0, Math.PI * 2, 0.01)
  cubeFolder.open()
  const cameraFolder = gui.addFolder("Camera")
  cameraFolder.add(camera.position, "z", 0, 10, 0.01)
  cameraFolder.open()
}

export { setupGUI, stats, gui }
