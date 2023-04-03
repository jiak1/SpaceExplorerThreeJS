import * as THREE from "three"
import { scene } from "../renderer/renderer"

let cube: THREE.Mesh

const setupObjects = () => {
  const geometry: THREE.BoxGeometry = new THREE.BoxGeometry()
  const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  })

  cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
}

export { setupObjects, cube }
