import { planets } from "../objects/planet"

export const animatePlanet = () => {
  const planetMat = planets[0].material as THREE.ShaderMaterial
  planetMat.uniforms.time.value += 0.1
}
