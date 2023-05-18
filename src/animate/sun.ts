import * as THREE from "three"
import { sun } from "../objects/sun"
import { rotateSpeed } from "./planet"
import { outlinePass } from "../renderer/renderer"

const clock = new THREE.Clock()
export const animateSun = () => {
  if (sun) {
    sun.rotation.y -= (clock.getDelta() * rotateSpeed) / 10
  }
}

export const setupSun = () => {
  outlinePass.selectedObjects = [sun]
}
