/* eslint-disable import/no-cycle */
import { GUI } from "dat.gui"
import Stats from "three/examples/jsm/libs/stats.module"
import { debounce } from "../util/debounce"
import { setupAnimate } from "../animate/animate"
import { setupObjects } from "../objects/objects"
import {
  fixedCamera,
  updateFixedCamera,
  boostSpeed,
  baseSpeed,
  updateBoostSpeed,
  updateBaseSpeed,
  camX,
  camY,
  camZ,
  updateCamX,
  updateCamY,
  updateCamZ,
  toggleAnimateRaycasts,
  animateRaycasts,
} from "../animate/ship"
import {
  enablePostProcessing,
  outlinePass,
  toggleOrbitControls,
  togglePostProcessing,
  toggleSkybox,
} from "../renderer/renderer"
import {
  planetCount,
  seed,
  updatePlanetCount,
  updatePlanetSeed,
} from "../objects/planet"
import { rotateSpeed, updateRotateSpeed } from "../animate/planet"
import { exP, updateExP } from "../objects/explosion"
import { showAsteroids, toggleAsteroids } from "../objects/asteroids"

let stats: Stats
let gui: GUI

const config = {
  FixedCamera: fixedCamera,
  Amplitude: 1,
  Octaves: 4,
  "Boost Speed": boostSpeed,
  "Base Speed": baseSpeed,
  "Spin Speed": rotateSpeed,
  "Planet Count": planetCount,
  "Exhaust Count": exP,
  "Camera X": camX,
  "Camera Y": camY,
  "Camera Z": camZ,
  "Glow Strength": outlinePass?.edgeStrength || 1.3,
  "Glow Amount": outlinePass?.edgeGlow || 8.5,
  "Glow Thickness": outlinePass?.edgeThickness || 3,
  "Glow Colour": outlinePass?.visibleEdgeColor || "#fccb59",
  Seed: seed,
  "Toggle Skybox": () => toggleSkybox(),
  "Enable Glow": enablePostProcessing,
  "Show Asteroids": showAsteroids,
  "Enable Shooting": animateRaycasts,
}

const resetObjects = () => {
  setupObjects()
  setupAnimate()
}

const planetCountChanged = debounce((newVal) => {
  updatePlanetCount(newVal)
  resetObjects()
})

const planetSeedChanged = debounce((newVal) => {
  updatePlanetSeed(newVal)
  resetObjects()
})

const setupGUI = () => {
  stats = Stats()
  document.body.appendChild(stats.dom)

  gui = new GUI()
  const cubeFolder = gui.addFolder("Ship")

  cubeFolder
    .add(config, "Boost Speed", 0, 1000, 1)
    .listen()
    .onChange((newVal) => {
      updateBoostSpeed(newVal)
    })

  cubeFolder
    .add(config, "Base Speed", 0, 500, 1)
    .listen()
    .onChange((newVal) => {
      updateBaseSpeed(newVal)
    })

  cubeFolder
    .add(config, "Exhaust Count", 0, 5, 1) // Setting too high can have peformance issues
    .listen()
    .onChange((newVal) => {
      updateExP(newVal)
    })

  cubeFolder
    .add(config, "Enable Shooting")
    .listen()
    .onChange((newVal) => {
      toggleAnimateRaycasts()
    })

  cubeFolder.add(config, "Toggle Skybox")

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
  planetFolder
    .add(config, "Seed", 0, 10000, 1)
    .listen()
    .onChange((newVal) => {
      planetSeedChanged(newVal)
    })
  planetFolder
    .add(config, "Show Asteroids")
    .listen()
    .onChange((newVal) => {
      toggleAsteroids()
      resetObjects()
    })
  planetFolder.open()

  const sunFolder = gui.addFolder("Sun")
  sunFolder
    .add(config, "Glow Strength", 0, 50, 0.1)
    .listen()
    .onChange((newVal) => {
      outlinePass.edgeStrength = newVal
    })
  sunFolder
    .add(config, "Glow Amount", 0, 50, 0.1)
    .listen()
    .onChange((newVal) => {
      outlinePass.edgeGlow = newVal
    })
  sunFolder
    .add(config, "Glow Thickness", 0, 50, 0.1)
    .listen()
    .onChange((newVal) => {
      outlinePass.edgeThickness = newVal
    })
  sunFolder
    .addColor(config, "Glow Colour")
    .listen()
    .onChange((newVal) => {
      outlinePass.visibleEdgeColor.set(newVal)
    })
  sunFolder
    .add(config, "Enable Glow")
    .listen()
    .onChange((newVal) => {
      togglePostProcessing()
    })
  sunFolder.open()

  const camFolder = gui.addFolder("Camera")
  camFolder
    .add(config, "FixedCamera")
    .name("Fixed Camera")
    .listen()
    .onChange((newVal) => {
      updateFixedCamera(newVal)
      toggleOrbitControls(newVal)
    })
  camFolder
    .add(config, "Camera X", -100, 100, 1)
    .listen()
    .onChange((newVal) => {
      updateCamX(newVal)
    })
  camFolder
    .add(config, "Camera Y", -200, 200, 1)
    .listen()
    .onChange((newVal) => {
      updateCamY(newVal)
    })
  camFolder
    .add(config, "Camera Z", -300, 300, 1)
    .listen()
    .onChange((newVal) => {
      updateCamZ(newVal)
    })
  camFolder.open()
}

export { setupGUI, stats, gui }
