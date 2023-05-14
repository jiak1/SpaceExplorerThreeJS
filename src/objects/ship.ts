import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { scene, objectsGroup } from "../renderer/renderer"

const model = "textures/spaceship.glb"
let ship: THREE.Group

const setupShip = () => {
  const loader = new GLTFLoader()
  loader.load(
    model,
    (gltf) => {
      gltf.scene.position.set(0, 25, 0)
      ship = gltf.scene
      objectsGroup.add(ship)
      const shipMesh = ship.children[0] as THREE.Mesh
      shipMesh.material = new THREE.MeshBasicMaterial({ color: "#ADD8E6" })
      shipMesh.rotateZ(Math.PI)
      console.log(ship)
    },
    (xhr) => {
      // console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`)
    },
    (error) => {
      console.log("An error happened")
    }
  )
}

export { setupShip, ship }
