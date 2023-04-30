import * as THREE from "three"
import { scene } from "../renderer/renderer"

const planets: THREE.Mesh[] = []

const planetShader = {
  uniforms: {
    time: { type: "f", value: 0.0 },
    scale: { type: "f", value: 0.45 },
    amplitude: { type: "f", value: 1 },
    octaves: { type: "i", value: 6 },
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
		uniform float time;
    uniform float scale;
		uniform float amplitude;
		uniform int octaves;

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
        sum += amp * noise2D(p * frequency);
        amp *= PERSISTENCE;
        frequency *= LACUNARITY;
      }

      return sum;
    }

    void main() {
			float n = 0.0;
		
			vec2 uv = vUv;
			float time = time * 0.25;
		
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
		
			vec2 p = uv;
		
			// Generate the Perlin noise texture
			for (int i = 0; i < octaves; i++) {
				n += noise(p * scale * pow(2.0, float(i)));
			}
		
			// Remap noise values to mountain and hole heights
			float mountainHeight = mix(0.0, 1.0, n);
			float holeHeight = mix(-0.5, 0.0, n);
			float height = mix(mountainHeight, holeHeight, n);
		
			// Map the height to colors
			vec3 color = vec3(0.0);
			if (height > 0.0) {
				color = vec3(0.5, 0.25, 0.0) + height * vec3(0.5, 0.75, 1.0);
			} else {
				color = vec3(0.19, 0.8, 0.19) * vec3(1.0, 1.0, 1.0);
			}
		
			gl_FragColor = vec4(color, 1.0);
		}
  `,
}

const createPlanet = () => {
  const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1)

  const planetMaterial = new THREE.ShaderMaterial({
    uniforms: planetShader.uniforms,
    vertexShader: planetShader.vertexShader,
    fragmentShader: planetShader.fragmentShader,
  })

  return new THREE.Mesh(geometry, planetMaterial)
}

const setupPlanets = () => {
  const planet = createPlanet()
  scene.add(planet)

  planets.push(planet)
}

export { setupPlanets, planets }
