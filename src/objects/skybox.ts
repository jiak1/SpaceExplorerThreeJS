import * as THREE from "three"
import { scene } from "../renderer/renderer"

let skybox: THREE.Mesh

function createMaterialArray() {
  const materialArray = [...Array(6)].map(() => {
    const texture = new THREE.TextureLoader().load("textures/space.jpg")

    return new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      wireframe: true,
    })
  })
  return materialArray
}

const setupSkybox = () => {
  const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000)
  skybox = new THREE.Mesh(skyboxGeo, createMaterialArray())

  scene.add(skybox)
}

export { setupSkybox, skybox }
