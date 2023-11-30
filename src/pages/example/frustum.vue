<script setup lang="ts">
import * as THREE from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls";

import { ConvexCameraHelper } from "../../api/ConvexCameraHelper";
onMounted(() => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('frustum')?.appendChild(renderer.domElement);

  const matrixWorld = camera.matrixWorld.clone();
  const projectionMatrixInverse = camera.projectionMatrixInverse.clone();

  let convexCameraHelper = new ConvexCameraHelper(
    matrixWorld,
    projectionMatrixInverse
  );
  scene.add(convexCameraHelper);


  let gridHelper = new THREE.GridHelper(100, 100, 0x888888, 0x888888);
  scene.add(gridHelper);

  let controls = new MapControls(camera, renderer.domElement);
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;

  controls.minDistance = 10;
  controls.maxDistance = 500;

  controls.maxPolarAngle = Math.PI / 2;

  camera.position.z = 5;
  camera.position.y = 5;
  // camera.lookAt(cube)

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
});
</script>

<template>
  <div wfull hfull id="frustum">
  </div>
</template>
<route lang="yaml">
  meta:
    layout: home
</route>