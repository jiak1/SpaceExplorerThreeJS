import * as THREE from "three"
import { objectsGroup } from "../renderer/renderer"

let ship: THREE.Mesh

const setupShip = () => {
  const shipMat = new THREE.MeshBasicMaterial()
  const shipGeo = new THREE.BoxGeometry(10, 10, 10, 1, 1, 1)

  ship = new THREE.Mesh(shipGeo, shipMat)
  ship.position.set(0, 25.1, 0)

  objectsGroup.add(ship)
}

export { setupShip, ship }
