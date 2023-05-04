import { GUI } from "dat.gui"
import Stats from "three/examples/jsm/libs/stats.module"
import { fixedCamera, updateFixedCamera } from "../animate/ship"
import { camera } from "../renderer/renderer"
import { planets } from "../objects/planet"

let stats: Stats
let gui: GUI

const config = {
  FixedCamera: fixedCamera,
  Amplitude: 1,
  Octaves: 4,
}

const setupGUI = () => {
  stats = Stats()
  document.body.appendChild(stats.dom)

  gui = new GUI()
  const cubeFolder = gui.addFolder("Ship")

  cubeFolder
    .add(config, "FixedCamera")
    .name("Fixed Camera")
    .listen()
    .onChange((newVal) => {
      updateFixedCamera(newVal)
    })

  cubeFolder.open()

  const planetFolder = gui.addFolder("Planet")
  /* planetFolder
    .add(config, "Amplitude", 0, 1, 0.01)
    .listen()
    .onChange((newVal) => {
      const planetMats = planets[0].material as THREE.ShaderMaterial[]
      for (let i = 0; i < planetMats.length; i++) {
        planetMats[i].uniforms.amplitude.value = newVal
      }
    })

  planetFolder
    .add(config, "Octaves", 4, 20, 1)
    .listen()
    .onChange((newVal) => {
      const planetMats = planets[0].material as THREE.ShaderMaterial[]
      for (let i = 0; i < planetMats.length; i++) {
        planetMats[i].uniforms.octaves.value = newVal
      }
    }) */
  planetFolder.open()

  const cameraFolder = gui.addFolder("Camera")
  cameraFolder.add(camera.position, "z", 0, 10, 0.01)
  cameraFolder.open()
}

export { setupGUI, stats, gui }
