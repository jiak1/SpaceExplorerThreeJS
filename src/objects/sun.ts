import * as THREE from "three"
import { objectsGroup } from "../renderer/renderer"

let sun

const sunShader = {
  uniforms: {
    glowColor: { value: new THREE.Color("#fffdd7") },
    coefficient: { value: 0 },
    power: { value: 20.0 },
  },
  fragmentShader: `
	uniform vec3 glowColor;
	uniform float coefficient;
	uniform float power;
	varying vec3 vNormal;
	varying vec2 vUv;
	uniform sampler2D textureMap;
	
	void main() {
			vec4 textureColor = texture2D(textureMap, vUv);
			float intensity = pow(coefficient - dot(vNormal, vec3(0.0, 0.0, 1.0)), power);
			vec3 haloColor = glowColor * intensity;
			vec3 objectColor = textureColor.rgb; // Use texture color as object color
			gl_FragColor = vec4(mix(objectColor, haloColor, intensity), textureColor.a);
	}
	`,

  vertexShader: `
	varying vec3 vNormal;
	varying vec2 vUv;
	
	void main() {
			vNormal = normalize(normalMatrix * normal);
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`,
}

const createSun = () => {
  const geometry: THREE.SphereGeometry = new THREE.SphereGeometry(700, 32, 32)

  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load("textures/sun.jpg")

  // Create a new shader material for the face
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  })

  // Create a mesh with the box geometry and the array of materials
  return new THREE.Mesh(geometry, material)
}

const setupSun = () => {
  sun = createSun()
  sun.name = "Planet Sun"
  objectsGroup.add(sun)
}

export { setupSun, sun }
