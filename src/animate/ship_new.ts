import * as THREE from "three";
import { ship } from "../objects/ship";
import { camera } from "../renderer/renderer";
import { keyboardKeys } from "./util/keyboard";
import { skybox } from "../objects/skybox";

const clock = new THREE.Clock();
let gamepad = null;

window.addEventListener("gamepadconnected", (e: GamepadEvent) => {
  console.log(
    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index,
    e.gamepad.id,
    e.gamepad.buttons.length,
    e.gamepad.axes.length
  );
  gamepad = navigator.getGamepads()[e.gamepad.index];
});

export const animateShip = () => {
  const seconds = clock.getDelta(); // seconds - speed to move.
  const moveDistance = 200 * seconds; // Pixels per sec

  const cubeRotator = (Math.PI / 2) * seconds;

  // CORE MOVEMENT (FORWARD, BACK, UP and DOWN)
  if (keyboardKeys.w || (gamepad && gamepad.axes[1] < -0.2)) ship.translateZ(-moveDistance); // Forward
  if (keyboardKeys.s || (gamepad && gamepad.axes[1] > 0.2)) ship.translateZ(moveDistance); // Back
  if (keyboardKeys.l || (gamepad && gamepad.buttons[2]?.pressed)) ship.translateY(moveDistance); // Up
  if (keyboardKeys.k || (gamepad && gamepad.buttons[3]?.pressed)) ship.translateY(-moveDistance); // Down

  // ROTATION MOVEMENT (ROT LEFT, ROT RIGHT, ROT UP, ROT DOWN, ROT X)
  if (keyboardKeys.a || (gamepad && gamepad.axes[0] < -0.2)) ship.rotateOnAxis(new THREE.Vector3(0, 1, 0), cubeRotator);
  if (keyboardKeys.d || (gamepad && gamepad.axes[0] > 0.2)) ship.rotateOnAxis(new THREE.Vector3(0, 1, 0), -cubeRotator);
  if (keyboardKeys.r || (gamepad && gamepad.axes[3] < -0.2)) ship.rotateOnAxis(new THREE.Vector3(1, 0, 0), cubeRotator); // PITCH
  if (keyboardKeys.f || (gamepad && gamepad.axes[3] > 0.2)) ship.rotateOnAxis(new THREE.Vector3(1, 0, 0), -cubeRotator); // PITCH
  if (keyboardKeys.q || (gamepad && gamepad.buttons[4]?.pressed)) ship.rotateOnAxis(new THREE.Vector3(0, 0, 1), cubeRotator); // ROLL
  if (keyboardKeys.e || (gamepad && gamepad.buttons[5]?.pressed)) ship.rotateOnAxis(new THREE.Vector3(0, 0, 1), -cubeRotator); // ROLL

  // RESET
  if (keyboardKeys.z || (gamepad && gamepad.buttons[1]?.pressed)) {
    ship.position.set(0, 25, 0); // Y needs to be 25 or the ship will sink into the ground
    ship.rotation.set(0, 0, 0);
  }

  const camDistanceVector = new THREE.Vector3(0, 15, 40); // Adjust the values (Y and Z) to modify the viewing angle and camera distance
  const camDistance = camDistanceVector.clone
  // Adjust the values (Y and Z) to modify the viewing angle and camera distance
  const camDistance = camDistanceVector.clone()
  camDistance.applyMatrix4(ship.matrixWorld)
  camera.position.copy(camDistance)
  camera.lookAt(ship.position)

  skybox.position.set(ship.position.x, ship.position.y, ship.position.z);
}
