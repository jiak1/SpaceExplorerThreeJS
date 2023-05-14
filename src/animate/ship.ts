import * as THREE from "three"
import { ship } from "../objects/ship"
import { camera } from "../renderer/renderer"
import { keyboardKeys } from "./util/keyboard"

const clock = new THREE.Clock()
let fixedCamera = false

const updateFixedCamera = (newVal) => (fixedCamera = newVal)

// Gamepad input state
const gamepadState = {
  forward: false,
  backward: false,
  up: false,
  down: false,
  rotLeft: false,
  rotRight: false,
  rotUp: false,
  rotDown: false,
  rollLeft: false,
  rollRight: false,
  pause: false,
}

// Gamepad button mappings (adjust as needed)
const buttonMappings = {
  7: "forward", // R2
  6: "backward", // L2
  0: "up", // X button
  1: "down", // O button
  14: "rotLeft", // Left bumper
  15: "rotRight", // Right bumper
  13: "rotUp", // Left trigger
  12: "rotDown", // Right trigger
  4: "rollLeft", // Back button
  5: "rollRight", // Start button
  9: "pause", // Options Button
}

const animateShip = () => {
  if (!ship) return

  const seconds = clock.getDelta() // seconds - speed to move .
  const moveDistance = 200 * seconds // Pixels per sec

  const cubeRotator = (Math.PI / 2) * seconds

  // Update gamepad input state
  const gamepad = navigator.getGamepads()[0] // Assuming only one gamepad is connected
  if (gamepad) {
    for (let i = 0; i < gamepad.buttons.length; i++) {
      const button = gamepad.buttons[i]
      const mapping = buttonMappings[i]
      if (mapping) {
        gamepadState[mapping] = button.pressed
      }
    }
  }

  // CORE MOVEMENT (FORWARD, BACK, UP and DOWN)
  if (gamepadState.forward || keyboardKeys.w) ship.translateZ(-moveDistance) // Forward
  if (gamepadState.backward || keyboardKeys.s) ship.translateZ(moveDistance) // Back
  if (gamepadState.up || keyboardKeys.l) ship.translateY(moveDistance) // Up
  if (gamepadState.down || keyboardKeys.k) ship.translateY(-moveDistance) // Down

  // ROTATION MOVEMENT (ROT LEFT, ROT RIGHT, ROT UP, ROT DOWN, ROT X)
  if (gamepadState.rotLeft || keyboardKeys.a)
    ship.rotateOnAxis(new THREE.Vector3(0, 1, 0), cubeRotator)
  if (gamepadState.rotRight || keyboardKeys.d)
    ship.rotateOnAxis(new THREE.Vector3(0, 1, 0), -cubeRotator)
  if (gamepadState.rotUp || keyboardKeys.r)
    ship.rotateOnAxis(new THREE.Vector3(1, 0, 0), cubeRotator) // PITCH
  if (gamepadState.rotDown || keyboardKeys.f)
    ship.rotateOnAxis(new THREE.Vector3(1, 0, 0), -cubeRotator) // PITCH
  if (gamepadState.rollLeft || keyboardKeys.q)
    ship.rotateOnAxis(new THREE.Vector3(0, 0, 1), cubeRotator) // ROLL
  if (gamepadState.rollRight || keyboardKeys.e)
    ship.rotateOnAxis(new THREE.Vector3(0, 0, 1), -cubeRotator) // ROLL

  // RESET
  if (keyboardKeys.z || gamepadState.pause) {
    ship.position.set(0, 25, 0) // Y needs to be 25 or cube will sink into ground
    ship.rotation.set(0, 0, 0)
  }

  if (fixedCamera) {
    const camDistance = new THREE.Vector3(0, 45, 150) // Chance value 2 (Y) to modify viewing angle and value 3 (Z) to change camera follow distance
    const camFollowDist = camDistance.applyMatrix4(ship.matrixWorld)
    camera.position.x = camFollowDist.x
    camera.position.y = camFollowDist.y
    camera.position.z = camFollowDist.z
    camera.lookAt(ship.position)
  }
}

export { fixedCamera, updateFixedCamera, animateShip }
