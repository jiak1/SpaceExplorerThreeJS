/* eslint-disable import/no-cycle */
import * as THREE from "three"

import { triggerExplosion, triggerExhaust } from "../objects/explosion"
import { ship } from "../objects/ship"
import { camera, controls, objectsGroup, scene } from "../renderer/renderer"
import { keyboardKeys } from "./util/keyboard"

const { throttle } = require("throttle-debounce")

let animateRaycasts = true
const toggleAnimateRaycasts = () => (animateRaycasts = !animateRaycasts)

const raycaster = new THREE.Raycaster()

let bullets: { mesh: THREE.Mesh; time: number; direction: THREE.Vector3 }[] = []
const clock = new THREE.Clock()
let seconds = 0

let isDying = false
let fixedCamera = true
let camX = 0
let camY = 20
let camZ = 100
const updateCamX = (newVal) => (camX = newVal)
const updateCamY = (newVal) => (camY = newVal)
const updateCamZ = (newVal) => (camZ = newVal)

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
  shoot: false,
  boost: false,
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
  17: "shoot", // Touch Button
  8: "boost", // Share Button
}

let isBoosting = false
let boostTimer = 0
let boostSpeed = 600
const updateBoostSpeed = (newVal) => (boostSpeed = newVal)
let baseSpeed = 200
const updateBaseSpeed = (newVal) => (baseSpeed = newVal)

const animateMove = () => {
  if (!isDying) {
    const moveDistance = (isBoosting ? boostSpeed : baseSpeed) * seconds // Pixels per sec, doubled during boost

    const cubeRotator = (Math.PI / 2) * seconds

    // Update gamepad input state
    const gamepad = navigator.getGamepads()[0]
    if (gamepad) {
      for (let i = 0; i < gamepad.buttons.length; i++) {
        const button = gamepad.buttons[i]
        const mapping = buttonMappings[i]
        if (mapping) {
          gamepadState[mapping] = button.pressed
        }
      }
    }

    // Check if the boost key (B) is pressed
    if ((gamepadState.boost || keyboardKeys.b) && !isBoosting) {
      isBoosting = true
      camZ = 150
      boostTimer = 5 // Set the boost timer to 5 seconds
    }

    // Reduce the boost timer by the elapsed time
    if (boostTimer > 0) {
      boostTimer -= seconds
      if (boostTimer <= 0) {
        isBoosting = false
        camZ = 100
      }
    }

    // CORE MOVEMENT (FORWARD, BACK, UP and DOWN)
    if (gamepadState.forward || keyboardKeys.w) {
      ship.translateZ(-moveDistance)
      const exhaustOffsetRight = new THREE.Vector3(4.5, 0, 0) // offset for the right
      const exhaustOffsetLeft = new THREE.Vector3(-4.5, 0, 0) // offset for the left
      const exhaustPositionRight = exhaustOffsetRight
        .clone()
        .applyMatrix4(ship.matrixWorld)
      const exhaustPositionLeft = exhaustOffsetLeft
        .clone()
        .applyMatrix4(ship.matrixWorld)
      triggerExhaust(exhaustPositionRight)
      triggerExhaust(exhaustPositionLeft)
    }
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
      ship.position.set(0, 0, 1000) // Y needs to be 25 or cube will sink into ground
      ship.rotation.set(0, 0, 0)
      camX = 0
      camY = 20
      camZ = 100
    }
  }

  if (fixedCamera) {
    const camDistance = new THREE.Vector3(camX, camY, camZ) // Chance value 2 (Y) to modify viewing angle and value 3 (Z) to change camera follow distance
    const camFollowDist = camDistance.applyMatrix4(ship.matrixWorld)
    camera.position.lerp(camFollowDist, 0.35)
    camera.lookAt(ship.position)
  } else {
    controls.update()
  }
}

const bulletSpeed = 90
const bulletLiveTime = 0.5

const animateBullets = () => {
  const moveDistance = seconds * bulletSpeed
  for (let i = 0; i < bullets.length; i++) {
    const bulletMesh = bullets[i].mesh

    const bulletDirection = bullets[i].direction

    bulletMesh.position.add(bulletDirection.multiplyScalar(moveDistance))
    bullets[i].time -= seconds

    if (bullets[i].time < 0) {
      scene.remove(bullets[i].mesh)
      bullets[i].mesh.remove()
      bullets.splice(i, 1)
    }
  }
}

const animateDeath = () => {
  if (ship && !isDying) {
    const shipDirection = new THREE.Vector3()
    shipDirection.set(0, 0, -1) // Initial direction pointing towards negative Z-axis
    shipDirection.applyEuler(ship.rotation)
    shipDirection.normalize() // Normalize the vector

    raycaster.set(ship.position, shipDirection)

    const intersects = raycaster
      .intersectObjects(
        objectsGroup.children,
        true // Enable recursive checking for child objects
      )
      .filter((intersect) => {
        const { object } = intersect
        return (
          (object instanceof THREE.Group || object instanceof THREE.Mesh) &&
          (object.name.includes("Planet") || object.name.includes("Asteroid"))
        )
      })

    if (intersects.length > 0) {
      const intersection = intersects[0]
      if (intersection.distance < 100) {
        isDying = true
        triggerExplosion(intersection.point)
        ship.children[0].visible = false
        setTimeout(() => {
          isDying = false
          ship.position.set(0, 0, 1000)
          ship.rotation.set(0, 0, 0)
          ship.children[0].visible = true
        }, 2000)
      }
    }
  }
}

const destroyObject = (hitObject) => {
  scene.remove(hitObject.mesh)
}

const tryShoot = () => {
  if (ship && (keyboardKeys[" "] || gamepadState.shoot)) {
    const geometry = new THREE.BoxGeometry(3, 3, 20)
    const material = new THREE.MeshStandardMaterial({ color: "#FFA500" })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = ship.position.x
    mesh.position.y = ship.position.y
    mesh.position.z = ship.position.z
    mesh.rotation.set(ship.rotation.x, ship.rotation.y, ship.rotation.z)

    const bulletDirection = new THREE.Vector3()
    bulletDirection.set(0, 0, -1) // Initial direction pointing towards negative Z-axis
    bulletDirection.applyEuler(ship.rotation)
    bulletDirection.normalize() // Normalize the vector

    raycaster.set(ship.position, bulletDirection)

    const intersects = raycaster
      .intersectObjects(
        objectsGroup.children,
        true // Enable recursive checking for child objects
      )
      .filter((intersect) => {
        const { object } = intersect
        return (
          (object instanceof THREE.Group || object instanceof THREE.Mesh) &&
          (object.name.includes("Planet") || object.name.includes("Asteroid"))
        )
      })

    if (intersects.length > 0) {
      const intersection = intersects[0]
      if (intersection.distance < 3000) {
        setTimeout(() => {
          triggerExplosion(intersection.point)
        }, intersection.distance / bulletSpeed)
        console.log(intersection.object.name)
        if (intersection.object.name.includes("Asteroid")) {
          intersection.object.visible = false
          intersection.object.name = "Destroyed"
          console.log("ASTEROID HIT")
        }
      }
    }

    mesh.position.add(bulletDirection.multiplyScalar(5))

    bullets.push({
      mesh,
      time: bulletLiveTime,
      direction: bulletDirection,
    })
    scene.add(mesh)
  }
}

const runTryShoot = throttle(200, tryShoot)
const runAnimateDeath = throttle(500, animateDeath)

const animateShip = () => {
  seconds = clock.getDelta() // seconds - speed to move .
  if (!ship) return

  animateMove()
  if (animateRaycasts) {
    animateBullets()
    runTryShoot()
    runAnimateDeath()
  }
}

const setupShipAnimation = () => {
  // If there are bullets we should delete them
  for (let i = 0; i < bullets.length; i++) {
    scene.remove(bullets[i].mesh)
    bullets[i].mesh.remove()
    bullets.splice(i, 1)
  }
  bullets = []
}

export {
  fixedCamera,
  updateFixedCamera,
  animateShip,
  setupShipAnimation,
  boostSpeed,
  baseSpeed,
  updateBoostSpeed,
  updateBaseSpeed,
  toggleAnimateRaycasts,
  animateRaycasts,
  camX,
  camY,
  camZ,
  updateCamX,
  updateCamY,
  updateCamZ,
}
