import * as THREE from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { scene } from "../renderer/renderer"

let ship: THREE.Mesh
/*
const loader = new OBJLoader()
loader.load(
  "models/ship.obj",
  (ShipObject) => {
    scene.add(ShipObject)
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log("An error happened")
  }
)
*/
const loader = new OBJLoader()
loader.load(
  "dist/ship.obj",
	function ( object ) {

		scene.add( object )

	},
  function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
  },

  function ( error ) {
    console.log( 'An error happened' )
}
)

const setupShip = () => {
  const shipMat = new THREE.MeshBasicMaterial()
  const shipGeo = new THREE.BoxGeometry(10, 10, 10, 1, 1, 1)

  ship = new THREE.Mesh(shipGeo, shipMat)
  ship.position.set(0, 25.1, 0)

  scene.add(ship)
}

export { setupShip, ship }
