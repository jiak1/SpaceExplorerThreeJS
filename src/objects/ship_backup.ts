import * as THREE from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { scene } from "../renderer/renderer"

const textureLoader = new THREE.TextureLoader()
// const texture = textureLoader.load("textures/uv_map.png")
const model = "textures/ship.obj"
/*
const material = new THREE.MeshBasicMaterial({
  map: texture,
})
*/
let ship: THREE.Group

const loader = new OBJLoader()
loader.load(
  model,
  (ShipObject) => {
    ShipObject.position.set(0, 25, 0)
    ship = ShipObject
    scene.add(ShipObject)
    // console.log(ship)
    const shipMesh = ship.children[0] as THREE.Mesh
    // shipMesh.material = material
    // eslint-disable-next-line no-new
    new THREE.MeshBasicMaterial({ color: "#ADD8E6" })
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
const setupShip = () => { }

export { setupShip, ship }
