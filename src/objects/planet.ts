import * as THREE from "three"
import { objectsGroup, scene } from "../renderer/renderer"
import { getRandomFloat, getRandomInt } from "../util/random"

let planets: THREE.Mesh[] = []

const planetShader = {
  uniforms: {
    scale: { type: "f", value: 0.0005 },
    amplitude: { type: "f", value: 1 },
    octaves: { type: "i", value: 5 },
    offset: { type: "v2", value: new THREE.Vector2(0, 0) },
    colors: {
      type: "v3v",
      value: [
        new THREE.Vector3(20, 161, 43),
        new THREE.Vector3(48, 204, 48),
        new THREE.Vector3(28, 97, 232),
        new THREE.Vector3(38, 69, 199),
      ],
    },
  },

  vertexShader: `
    varying vec3 vPosition;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      vPosition = position;
    }
  `,

  fragmentShader: `
    uniform float scale;
		uniform float amplitude;
		uniform int octaves;

    uniform vec2 offset;

    uniform vec3 colors[4];

    varying vec3 vPosition;

    #define PERSISTENCE 0.5
    #define LACUNARITY 2.0

    vec3 hash3D(vec3 p) {
      p = fract(p * 0.3183099 + vec3(0.1, 0.1, 0.1));
      p += dot(p, p + vec3(123.4, 567.8, 987.6));
      return fract(vec3(p.x * p.y, p.y * p.z, p.z * p.x));
    }
    
    float noise3D(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
    
      vec3 u = f * f * (3.0 - 2.0 * f);
    
      float a = dot(hash3D(i + vec3(0.0, 0.0, 0.0)), f - vec3(0.0, 0.0, 0.0));
      float b = dot(hash3D(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0));
      float c = dot(hash3D(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0));
      float d = dot(hash3D(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0));
      float e = dot(hash3D(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0));
      float g = dot(hash3D(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0));
      float h = dot(hash3D(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0));
      float k = dot(hash3D(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0));
    
      return mix(mix(mix(a, b, u.x), mix(c, d, u.x), u.y),
                 mix(mix(e, g, u.x), mix(h, k, u.x), u.y), u.z);
    }    

    float noise(vec3 p) {
      float amp = amplitude;
      float frequency = 1.0;
      float sum = 0.0;
    
      for (int i = 0; i < octaves; i++) {
        sum += amp * noise3D(p * frequency + vec3(offset.x, offset.y, float(i)));
        amp *= PERSISTENCE;
        frequency *= LACUNARITY;
      }
    
      return sum;
    }    

    void main() {
			float n = 0.0;
			vec3 p = vPosition;
		
			// Generate the Perlin noise texture
			for (int i = 0; i < octaves; i++) {
				n += noise(p * scale * pow(2.0, float(i)));
			}
		
			// Remap noise values to mountain and hole heights
			float height = n;
		
			// Map the height to colors
			vec3 color = vec3(0.0);
			if (height > 0.15) {
        color = colors[0]/255.0;
      } else if (height > 0.1) {
        color = colors[1]/255.0;
      } else if (height > -0.2) {
        color = colors[2]/255.0;
      } else {
        color = colors[3]/255.0;
      }      
		
			gl_FragColor = vec4(color, 1.0);
		}
  `,
}

const planetColours = [
  [
    new THREE.Vector3(20, 161, 43),
    new THREE.Vector3(48, 204, 48),
    new THREE.Vector3(28, 97, 232),
    new THREE.Vector3(38, 69, 199),
  ],
  [
    new THREE.Vector3(152, 38, 73),
    new THREE.Vector3(124, 132, 131),
    new THREE.Vector3(113, 162, 182),
    new THREE.Vector3(96, 178, 229),
  ],
  [
    new THREE.Vector3(255, 137, 102),
    new THREE.Vector3(229, 68, 109),
    new THREE.Vector3(248, 244, 227),
    new THREE.Vector3(112, 108, 97),
  ],
  [
    new THREE.Vector3(206, 132, 173),
    new THREE.Vector3(206, 150, 166),
    new THREE.Vector3(212, 203, 179),
    new THREE.Vector3(210, 224, 191),
  ],
  [
    new THREE.Vector3(247, 219, 167),
    new THREE.Vector3(241, 171, 134),
    new THREE.Vector3(197, 123, 87),
    new THREE.Vector3(30, 45, 47),
  ],
  [
    new THREE.Vector3(158, 0, 49),
    new THREE.Vector3(142, 0, 49),
    new THREE.Vector3(119, 0, 88),
    new THREE.Vector3(96, 0, 71),
  ],
]

let planetCount = 15

const updatePlanetCount = (newVal) => (planetCount = newVal)

const getColours = () =>
  planetColours[getRandomInt(0, planetColours.length - 1)]

const createPlanet = () => {
  const size = getRandomInt(60, 300)
  const geometry: THREE.SphereGeometry = new THREE.SphereGeometry(
    size,
    size,
    size
  )

  // Create a new shader material for the face
  const planetMaterial = new THREE.ShaderMaterial({
    uniforms: planetShader.uniforms,
    vertexShader: planetShader.vertexShader,
    fragmentShader: planetShader.fragmentShader,
  })

  planetMaterial.uniforms.colors.value = getColours()

  planetMaterial.uniforms.amplitude.value = getRandomFloat(0.5, 3)

  planetMaterial.uniforms.offset.value = new THREE.Vector2(
    getRandomInt(-1000000, 1000000),
    getRandomInt(-1000000, 1000000)
  )

  // Create a mesh with the box geometry and the array of materials
  return new THREE.Mesh(geometry, planetMaterial.clone())
}

const setupPlanets = () => {
  planets = []

  for (let i = 1; i <= planetCount; i++) {
    const planet = createPlanet()

    objectsGroup.add(planet)
    planets.push(planet)
  }
  console.log(planets.length)
}

export { setupPlanets, planets, updatePlanetCount, planetCount }
