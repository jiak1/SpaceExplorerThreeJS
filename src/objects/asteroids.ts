import * as THREE from "three"
import { scene } from "../renderer/renderer"
//----------------------------------------------------------------------------------------------------------------------------------------------------------

// New instance of Asteroid
const vertexShader = `
  uniform float time;
  uniform float displacementScale;

  varying vec2 vUv;

  void main() {
    vUv = uv;

    vec3 displaced = position + vec3(
      0.0,
      sin(position.x * 10.0 + time * 5.0) * 0.1 * displacementScale,
      sin(position.z * 10.0 + time * 5.0) * 0.1 * displacementScale
    );

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform vec3 colorA;
  uniform vec3 colorB;

  varying vec2 vUv;

  float random (in vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float noise (in vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);

      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    float noiseValue = noise(vUv * 10.0 + time * 2.0);
    vec3 color = mix(colorA, colorB, noiseValue);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const geometry = new THREE.SphereGeometry(10, 10, 10);
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    time: { value: 0 },
    displacementScale: { value: 1 },
    colorA: { value: new THREE.Color(0x828282) },
    colorB: { value: new THREE.Color(0x383838) },
  },
});
const asteroid = new THREE.Mesh(geometry, material);

//--------------------------------------------------------------------------
// Create a variable to keep track of the number of hits
let numHits = 0;

// Function to handle the destruction of the asteroid
function destroyAsteroid() {
  // Remove the asteroid from the scene
  scene.remove(asteroid);
}

// Function to handle the asteroid getting hit
function onAsteroidHit() {
  // Increment the number of hits
  numHits++;

  // If the asteroid has been hit 3 times, destroy it
  if (numHits >= 3) {
    destroyAsteroid();
  }
}
// Example of how to trigger the onAsteroidHit() function when the asteroid gets hit
asteroid.addEventListener('collision', onAsteroidHit);
//--------------------------------------------------------------------------

// Define the number of clusters and the number of objects per cluster
const numClusters = 5;
const objectsPerCluster = 10;

// Define the size of the area in which the clusters will be spawned
const clusterAreaSize = 500;

// Create a new group (asteroids) to hold the objects
const asteroids = new THREE.Group();

// Loop through the number of clusters
for (let i = 0; i < numClusters; i++) {
  // Generate a random position for the cluster within the cluster area
  const clusterX = Math.random() * clusterAreaSize - clusterAreaSize / 2;
  const clusterY = Math.random() * clusterAreaSize - clusterAreaSize / 2;
  const clusterZ = Math.random() * clusterAreaSize - clusterAreaSize / 2;

  // Create a new group to hold the objects in this cluster
  const clusterGroup = new THREE.Group();

  // Loop through the number of objects per cluster
  for (let j = 0; j < objectsPerCluster; j++) {
    // Generate a random position for the object within the cluster
    const objectX = Math.random() * 100 - 5;
    const objectY = Math.random() * 100 - 5;
    const objectZ = Math.random() * 100 - 5;

    // Create a new instance of the object
    const instance = asteroid.clone();

    // Set the position of the object relative to the position of the cluster
    instance.position.set(clusterX + objectX, clusterY + objectY, clusterZ + objectZ);
    //Roate the instance.
    instance.rotation.x = (Math.random()-0.5)*10;
    instance.rotation.y = (Math.random()-0.5)*10;
    instance.rotation.z = (Math.random()-0.5)*10;

    // Add the object to the cluster group
    clusterGroup.add(instance);
  }

  // Add the cluster group to the main group
  asteroids.add(clusterGroup);
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------

const setupAsteroids = () => {
  scene.add(asteroids)
}

export { setupAsteroids, asteroids }