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
} from "../animate/ship"
import { outlinePass, toggleOrbitControls } from "../renderer/renderer"
import {
  planetCount,
  seed,
  updatePlanetCount,
  updatePlanetSeed,
} from "../objects/planet"
import { rotateSpeed, updateRotateSpeed } from "../animate/planet"
import { exP, updateExP } from "../objects/explosion"

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
  "Glow Strength": outlinePass?.edgeStrength || 1.3,
  "Glow Amount": outlinePass?.edgeGlow || 8.5,
  "Glow Thickness": outlinePass?.edgeThickness || 3,
  "Glow Colour": outlinePass?.visibleEdgeColor || "#fccb59",
  Seed: seed,
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
    .add(config, "FixedCamera")
    .name("Fixed Camera")
    .listen()
    .onChange((newVal) => {
      updateFixedCamera(newVal)
      toggleOrbitControls(newVal)
    })
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
  sunFolder.open()
}

export { setupGUI, stats, gui }
