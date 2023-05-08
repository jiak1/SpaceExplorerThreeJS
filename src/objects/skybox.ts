import * as THREE from "three"
import { scene } from "../renderer/renderer"

let skybox: THREE.Mesh

const materialArray = []
const texture_ft = new THREE.TextureLoader().load("textures/corona_ft.png")
const texture_bk = new THREE.TextureLoader().load("textures/corona_bk.png")
const texture_up = new THREE.TextureLoader().load("textures/corona_up.png")
const texture_dn = new THREE.TextureLoader().load("textures/corona_dn.png")
const texture_rt = new THREE.TextureLoader().load("textures/corona_rt.png")
const texture_lf = new THREE.TextureLoader().load("textures/corona_lf.png")

materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }))
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }))
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }))
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }))
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt }))
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf }))

for (let i = 0; i < 6; i++) materialArray[i].side = THREE.BackSide

const setupSkybox = () => {
  const skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000)
  skybox = new THREE.Mesh(skyboxGeo, materialArray)
  scene.add(skybox)
}
export { setupSkybox, skybox }
