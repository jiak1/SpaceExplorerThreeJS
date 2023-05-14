import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let objectsGroup: THREE.Group
let controls: OrbitControls

function render() {
  renderer.render(scene, camera)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

const setupSkybox = () => {
  const textureLoader = new THREE.CubeTextureLoader()

  const textures = [
    "textures/corona_ft.png",
    "textures/corona_bk.png",
    "textures/corona_up.png",
    "textures/corona_dn.png",
    "textures/corona_rt.png",
    "textures/corona_lf.png",
  ]

  const textureCube = textureLoader.load(textures)
  scene.background = textureCube
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

  setupSkybox()
}

const toggleOrbitControls = (enabled) => (controls.enabled = !enabled)

export {
  setupRenderer,
  camera,
  renderer,
  scene,
  controls,
  render,
  objectsGroup,
  toggleOrbitControls,
}
