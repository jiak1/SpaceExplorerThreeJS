/* eslint-disable import/no-cycle */
import { GUI } from "dat.gui"
import Stats from "three/examples/jsm/libs/stats.module"
import { debounce } from "../util/debounce"
import { setupAnimate } from "../animate/animate"
import { setupObjects } from "../objects/objects"
import { fixedCamera, updateFixedCamera } from "../animate/ship"
import { camera, toggleOrbitControls } from "../renderer/renderer"
import { planetCount, updatePlanetCount } from "../objects/planet"
import { rotateSpeed, updateRotateSpeed } from "../animate/planet"

let stats: Stats
let gui: GUI

const config = {
  FixedCamera: fixedCamera,
  Amplitude: 1,
  Octaves: 4,
  "Spin Speed": rotateSpeed,
  "Planet Count": planetCount,
}

const resetObjects = () => {
  setupObjects()
  setupAnimate()
}

const planetCountChanged = debounce((newVal) => {
  updatePlanetCount(newVal)
  resetObjects()
})

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
      toggleOrbitControls(newVal)
    })

  cubeFolder.open()

  const planetFolder = gui.addFolder("Galaxy")
  planetFolder
    .add(config, "Spin Speed", 0, 5, 0.01)
    .listen()
    .onChange((newVal) => {
      updateRotateSpeed(newVal)
    })
  planetFolder
    .add(config, "Planet Count", 0, 100, 1)
    .listen()
    .onChange((newVal) => {
      planetCountChanged(newVal)
    })
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
