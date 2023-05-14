import * as THREE from "three"
import { scene } from "../renderer/renderer"
import { getRandomFloat, getRandomInt } from "../util/random"

const planets: THREE.Mesh[] = []

const planetShader = {
  uniforms: {
    scale: { type: "f", value: 0.45 },
    amplitude: { type: "f", value: 1 },
    octaves: { type: "i", value: 4 },
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
    varying vec2 vUv;

    void main() {
      vUv = uv;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  fragmentShader: `
    uniform float scale;
		uniform float amplitude;
		uniform int octaves;

    uniform vec2 offset;

    uniform vec3 colors[4];

    varying vec2 vUv;

    #define PERSISTENCE 0.5
    #define LACUNARITY 2.0

    vec2 hash2D(vec2 p) {
      const vec2 k = vec2(0.3183099, 0.3678794);
      p = fract(p * k + vec2(0.1, 0.1));
      p += dot(p, p + vec2(123.4, 567.8));
      return fract(vec2(p.x * p.y, p.x + p.y));
    }

    float noise2D(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);

      vec2 u = f * f * (3.0 - 2.0 * f);

      float a = dot(hash2D(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0));
      float b = dot(hash2D(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
      float c = dot(hash2D(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
      float d = dot(hash2D(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));

      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    float noise(vec2 p) {
      float amp = amplitude;
      float frequency = 1.0;
      float sum = 0.0;
    
      for (int i = 0; i < octaves; i++) {
        sum += amp * noise2D(p * frequency + offset);
        amp *= PERSISTENCE;
        frequency *= LACUNARITY;
      }
    
      return sum;
    }    

    void main() {
			float n = 0.0;
		
			vec2 uv = vUv + offset;
		
			// Adjust the UV coordinates for each face to overlap with the adjacent faces
			if (uv.x == 0.0) {
				uv.x = 1.0;
			} else if (uv.x == 1.0) {
				uv.x = 0.0;
			} else if (uv.y == 0.0) {
				uv.y = 1.0;
			} else if (uv.y == 1.0) {
				uv.y = 0.0;
			}
		
			vec2 p = vUv;
		
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

const getColours = () =>
  planetColours[getRandomInt(0, planetColours.length - 1)]

const createPlanet = () => {
  const geometry: THREE.SphereGeometry = new THREE.SphereGeometry(100, 100, 100)

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
  for (let i = 1; i <= 15; i++) {
    const planet = createPlanet()

    scene.add(planet)
    planets.push(planet)
  }
}

export { setupPlanets, planets }
