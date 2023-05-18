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

//  ---------------------PAUSE-------------------------------------------------
// create a clock to keep track of elapsed time
const clock = new THREE.Clock()

// create a variable to store the pause state
let isPaused = false

// add a key listener to toggle the pause state
window.addEventListener("keydown", (event) => {
  if (event.key === "p") {
    isPaused = !isPaused
  }
})
//  ---------------------PAUSE-------------------------------------------------

function render() {
  if (!isPaused) {
    const elapsedTime = clock.getElapsedTime()
    renderer.render(scene, camera)
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
      "textures/bkg1_front.png",
      "textures/bkg1_back.png",
      "textures/bkg1_top.png",
      "textures/bkg1_bottom.png",
      "textures/bkg1_right.png",
      "textures/bkg1_left.png",
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

  const light = new THREE.AmbientLight(0xffc0cb, 1) // soft white light
  scene.add(light)

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
  toggleOrbitControls,
  composer,
}
