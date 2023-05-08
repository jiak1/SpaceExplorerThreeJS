import * as THREE from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { scene } from "../renderer/renderer"

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load("textures/uv_map.png")
const model = "textures/ship.obj"

const material = new THREE.MeshBasicMaterial({
  map: texture,
})

let ship: THREE.Group

const loader = new OBJLoader() // Loader for model with error logging
loader.load(
  model,
  (ShipObject) => {
    ShipObject.position.set(0, 25, 0)
    ship = ShipObject
    scene.add(ShipObject)
    console.log(ship)
    const shipMesh = ship.children[0] as THREE.Mesh
    shipMesh.material = material
    // new THREE.MeshBasicMaterial({ color: "#345" })
    // shipMesh.rotateX(Math.PI)
    shipMesh.rotateX(1.6)
  },
  (xhr) => {
    console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`)
  },
  (error) => {
    console.log("An error happened")
  }
)
// const uvTexture = new THREE.TextureLoader().load("textures/ship2.png")
const setupShip = () => {
  /* const shipGeo = new THREE.BoxGeometry(10, 10, 10, 1, 1, 1)
  const shipMat = new THREE.MeshBasicMaterial({
    map: uvTexture,
  })

  ship = new THREE.Mesh(shipGeo, shipMat)
  ship.position.set(0, 25.1, 0)

  scene.add(ship) */
}

export { setupShip, ship }
