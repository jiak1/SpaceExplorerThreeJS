import * as THREE from "three"
import { scene } from "../renderer/renderer"

let skybox: THREE.Mesh

const setupSkybox = () => {
  const textureLoader = new THREE.TextureLoader()

  const textures = [
    textureLoader.load("textures/corona_ft.png"),
    textureLoader.load("textures/corona_bk.png"),
    textureLoader.load("textures/corona_up.png"),
    textureLoader.load("textures/corona_dn.png"),
    textureLoader.load("textures/corona_rt.png"),
    textureLoader.load("textures/corona_lf.png"),
  ]

  const materials = textures.map(
    (texture) =>
      new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide })
  )

  const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000)
  skybox = new THREE.Mesh(skyboxGeo, materials)

  scene.add(skybox)
}

export { setupSkybox, skybox }
