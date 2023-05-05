import * as THREE from "three"
import { scene } from "../renderer/renderer"
//----------------------------------------------------------------------------------------------------------------------------------------------------------

// Create a new instance of the object you want to spawn
const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({ color: 0x808080 });
const object = new THREE.Mesh(geometry, material);

// Define the number of clusters and the number of objects per cluster
const numClusters = 5;
const objectsPerCluster = 10;

// Define the size of the area in which the clusters will be spawned
const clusterAreaSize = 500;

// Create a new group to hold the objects
const group = new THREE.Group();

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
    const instance = object.clone();

    // Set the position of the object relative to the position of the cluster
    instance.position.set(clusterX + objectX, clusterY + objectY, clusterZ + objectZ);

    // Add the object to the cluster group
    clusterGroup.add(instance);
  }

  // Add the cluster group to the main group
  group.add(clusterGroup);
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------

const setupAsteroids = () => {
  scene.add(group)
}

export { setupAsteroids, group }