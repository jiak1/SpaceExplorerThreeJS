import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
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

const setupRenderer = () => {
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)

  camera.position.x = 15
  camera.position.y = 10

  window.addEventListener("resize", onWindowResize, false)

  const light = new THREE.AmbientLight(0xffc0cb, 1) // soft white light
  scene.add(light)
}

export { setupRenderer, camera, renderer, scene, controls, render }
