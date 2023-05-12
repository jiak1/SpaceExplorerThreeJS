import * as THREE from "three"
import { ship } from "../objects/ship"
import { camera } from "../renderer/renderer"
import { keyboardKeys } from "./util/keyboard"
import { skybox } from "../objects/skybox"

const clock = new THREE.Clock()

// Create the smoke particle material
const particleMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 })
const smokeParticles = []

// Create a smoke particle emitter
for (let i = 0; i < 100; i++) {
  const particle = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    particleMaterial
  )
  particle.position
    .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
    .normalize()
  particle.position.multiplyScalar(Math.random() * 10)
  particle.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2)
  smokeParticles.push(particle)
}

// Update the smoke particles
function animate() {
  requestAnimationFrame(animate)

  for (let i = 0; i < smokeParticles.length; i++) {
    smokeParticles[i].rotation.x += 0.01
    smokeParticles[i].rotation.y += 0.01
    smokeParticles[i].rotation.z += 0.01
  }
}

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
}

// Gamepad button mappings (example mappings, adjust as needed)
const buttonMappings = {
  0: "forward", // A button
  1: "backward", // B button
  2: "up", // X button
  3: "down", // Y button
  4: "rotLeft", // Left bumper
  5: "rotRight", // Right bumper
  6: "rotUp", // Left trigger
  7: "rotDown", // Right trigger
  8: "rollLeft", // Back button
  9: "rollRight", // Start button
}

export const animateShip = () => {
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
  if (keyboardKeys.z) {
    ship.position.set(0, 25, 0) // Y needs to be 25 or cube will sink into ground
    ship.rotation.set(0, 0, 0)
  }

  const camDistance = new THREE.Vector3(0, 15, 40) // Change value 2 (Y) to modify viewing angle and value 3 (Z) to change camera follow distance
  const camFollowDist = camDistance.applyMatrix4(ship.matrixWorld)
  camera.position.x = camFollowDist.x
  camera.position.y = camFollowDist.y
  camera.position.z = camFollowDist.z
  camera.lookAt(ship.position)

  skybox.position.set(ship.position.x, ship.position.y, ship.position.z)
}
