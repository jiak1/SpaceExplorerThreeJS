/* eslint-disable no-param-reassign */
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"

let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let objectsGroup: THREE.Group
let controls: OrbitControls
let composer: EffectComposer
let outlinePass: OutlinePass
let enablePostProcessing = true
const togglePostProcessing = () =>
  (enablePostProcessing = !enablePostProcessing)

// Variable to store the pause state
let isPaused = false

const clock = new THREE.Clock()

const pauseMenu = document.createElement("div")
const buttonList = document.createElement("ul")
const resumeButton = document.createElement("li")
const restartButton = document.createElement("li")
const buttons = buttonList.getElementsByTagName("li")

pauseMenu.id = "pause-menu"
document.body.appendChild(pauseMenu)

// Unordered list for the buttons
pauseMenu.appendChild(buttonList)

// Buttons as list items
resumeButton.innerHTML = "Resume"
buttonList.appendChild(resumeButton)

restartButton.innerHTML = "Restart"
buttonList.appendChild(restartButton)

// ...

const keyBindingsBox = document.createElement("div")
keyBindingsBox.id = "key-bindings-box"
keyBindingsBox.innerHTML =
  "W/S = Move Forward or Back<br> A/D = Face Left or Right<br>Q/E = Rotate Ship Left/Right<br>R/F = Rotate Ship Up/Down<br>K/L = Move Ship Up/Down<br>B = Boost<br> Z = Reset Position<br> Space = Shoot<br> P = Pause"
document.body.appendChild(keyBindingsBox)

// Style the key bindings box using CSS
keyBindingsBox.style.position = "absolute"
keyBindingsBox.style.top = "50px"
keyBindingsBox.style.left = "0px"
keyBindingsBox.style.padding = "10px"
keyBindingsBox.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
keyBindingsBox.style.color = "#fff"
keyBindingsBox.style.fontFamily = "Arial, sans-serif"
keyBindingsBox.style.display = "none"

window.addEventListener("keydown", (event) => {
  if (event.key === "p" || event.key === "Escape") {
    keyBindingsBox.style.display =
      keyBindingsBox.style.display === "none" ? "block" : "none"
  }
})

// Style the pause menu using CSS
pauseMenu.style.position = "fixed"
pauseMenu.style.top = "50%"
pauseMenu.style.left = "50%"
pauseMenu.style.transform = "translate(-50%, -50%)"
pauseMenu.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
pauseMenu.style.padding = "20px"
pauseMenu.style.display = "none"

// Style the button list
buttonList.style.listStyle = "none"
buttonList.style.margin = "0"
buttonList.style.padding = "0"

// Style the buttons
for (let i = 0; i < buttons.length; i++) {
  const button = buttons[i]
  button.style.marginBottom = "10px"
  button.style.backgroundColor = "#DC143C"
  button.style.color = "#fff"
  button.style.padding = "10px 20px"
  button.style.border = "none"
  button.addEventListener("mouseover", () => {
    button.style.backgroundColor = "#FF0000"
  })
  button.addEventListener("mouseout", () => {
    button.style.backgroundColor = "#DC143C"
  })
}

// Show/hide the pause menu
function togglePauseMenu() {
  if (pauseMenu.style.display === "none") {
    pauseMenu.style.display = "block"
  } else {
    pauseMenu.style.display = "none"
  }
}

function pause() {
  isPaused = !isPaused
}

resumeButton.addEventListener("click", () => {
  // Perform resume action
  togglePauseMenu()
  pause()
})

restartButton.addEventListener("click", () => {
  // Perform restart action
  togglePauseMenu()
  // eslint-disable-next-line no-restricted-globals
  location.reload()
})

// Toggle the pause state. Can use both "p" or "Escape" keys
window.addEventListener("keydown", (event) => {
  if (event.key === "p" || event.key === "Escape") {
    pause()
    togglePauseMenu()
  }
})

function render() {
  if (!isPaused) {
    if (enablePostProcessing) {
      composer.render()
    } else {
      renderer.render(scene, camera)
    }
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

let currentSkybox = 0

const toggleSkybox = () => {
  const textureLoader = new THREE.CubeTextureLoader()
  let textures = []
  if (currentSkybox === 0) {
    textures = [
      "textures/corona_ft.png",
      "textures/corona_bk.png",
      "textures/corona_up.png",
      "textures/corona_dn.png",
      "textures/corona_rt.png",
      "textures/corona_lf.png",
    ]
    currentSkybox = 1
  } else {
    textures = [
      "textures/redeclipse_ft.png",
      "textures/redeclipse_bk.png",
      "textures/redeclipse_up.png",
      "textures/redeclipse_dn.png",
      "textures/redeclipse_rt.png",
      "textures/redeclipse_lf.png",
    ]
    currentSkybox = 0
  }

  const textureCube = textureLoader.load(textures)
  scene.background = textureCube
}

const setupPostProcessing = () => {
  composer = new EffectComposer(renderer)

  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
  )

  outlinePass.edgeStrength = 1.3
  outlinePass.edgeGlow = 8.5
  outlinePass.edgeThickness = 3
  outlinePass.pulsePeriod = 0
  outlinePass.visibleEdgeColor.set("#fccb59")

  composer.addPass(outlinePass)
}

const setupRenderer = () => {
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100000
  )

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enabled = false

  camera.position.x = 15
  camera.position.y = 10

  objectsGroup = new THREE.Group()

  window.addEventListener("resize", onWindowResize, false)

  const light = new THREE.AmbientLight(0xffc0cb, 0.5) // soft white light
  scene.add(light)

  const pointLight = new THREE.PointLight(0xffffff, 1)
  scene.add(pointLight)

  setupPostProcessing()

  toggleSkybox()
}

const toggleOrbitControls = (enabled) => (controls.enabled = !enabled)
// const toggleSkyboxChange = (enabled) => (controls.enabled = !enabled) -- Need assistance

export {
  setupRenderer,
  camera,
  toggleSkybox,
  renderer,
  scene,
  controls,
  render,
  objectsGroup,
  outlinePass,
  togglePostProcessing,
  enablePostProcessing,
  toggleOrbitControls,
  composer,
  pause,
}
