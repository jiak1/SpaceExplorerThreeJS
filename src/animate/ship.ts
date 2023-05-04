import * as THREE from "three"
import { ship } from "../objects/ship"
import { camera } from "../renderer/renderer"
import { keyboardKeys } from "./util/keyboard"
import { skybox } from "../objects/skybox"

const clock = new THREE.Clock()
let fixedCamera = true

const updateFixedCamera = (newVal) => (fixedCamera = newVal)

const animateShip = () => {
  const seconds = clock.getDelta() // seconds - speed to move .
  const moveDistance = 200 * seconds // Pixels per sec

  const cubeRotator = (Math.PI / 2) * seconds

  // CORE MOVEMENT (FORWARD, BACK, UP and DOWN)
  if (keyboardKeys.w) ship.translateZ(-moveDistance) // Forward
  if (keyboardKeys.s) ship.translateZ(moveDistance) // Back
  if (keyboardKeys.l) ship.translateY(moveDistance) // Up
  if (keyboardKeys.k) ship.translateY(-moveDistance) // Down

  // ROTATION MOVEMENT (ROT LEFT, ROT RIGHT, ROT UP, ROT DOWN, ROT X)
  if (keyboardKeys.a) ship.rotateOnAxis(new THREE.Vector3(0, 1, 0), cubeRotator)
  if (keyboardKeys.d)
    ship.rotateOnAxis(new THREE.Vector3(0, 1, 0), -cubeRotator)
  if (keyboardKeys.r)
    // PITCH
    ship.rotateOnAxis(new THREE.Vector3(1, 0, 0), cubeRotator)
  if (keyboardKeys.f)
    // PITCH
    ship.rotateOnAxis(new THREE.Vector3(1, 0, 0), -cubeRotator)

  if (keyboardKeys.q)
    // ROLL
    ship.rotateOnAxis(new THREE.Vector3(0, 0, 1), cubeRotator)
  if (keyboardKeys.e)
    // ROLL
    ship.rotateOnAxis(new THREE.Vector3(0, 0, 1), -cubeRotator)

  // RESET
  if (keyboardKeys.z) {
    ship.position.set(0, 25, 0) // Y needs to be 25 or cube will sink into ground
    ship.rotation.set(0, 0, 0)
  }

  if (fixedCamera) {
    const camDistance = new THREE.Vector3(0, 75, 250) // Chance value 2 (Y) to modify viewing angle and value 3 (Z) to change camera follow distance
    const camFollowDist = camDistance.applyMatrix4(ship.matrixWorld)
    camera.position.x = camFollowDist.x
    camera.position.y = camFollowDist.y
    camera.position.z = camFollowDist.z
    camera.lookAt(ship.position)
  }

  skybox.position.set(ship.position.x, ship.position.y, ship.position.z)
}

export { fixedCamera, updateFixedCamera, animateShip }
