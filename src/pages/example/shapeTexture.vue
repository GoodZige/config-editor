<script setup lang="ts">
import * as THREE from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import JiGuangLeiDaCheZai from './JiGuangLeiDaCheZai'
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
  document.getElementById('shapeTexture')?.appendChild(renderer.domElement);

  let gridHelper = new THREE.GridHelper(100, 100, 0x888888, 0x888888);
  scene.add(gridHelper);

  let light1 = new THREE.AmbientLight()
  scene.add(light1);
  let light2 = new THREE.SpotLight()
  scene.add(light2);

  let points = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ]
  let pointsV2 = points.map(e => new THREE.Vector2(e[0], e[1]))
  let shape = new THREE.Shape(pointsV2)
  let shapeGeom = new THREE.ShapeGeometry(shape)
  
  console.log(shapeGeom.attributes.position);
  console.log(shapeGeom.attributes.uv);
  // let newUv = [
  //   // [1,1],
  //   // [0,1],
  //   // [0,0],
  //   // [0,0],
  //   // [1,0],
  //   // [1,1]
  //   [0,1],
  //   [1,1],
  //   [1,0],
  //   [0,0],
  // ]
  // let newUvFloat32 = new THREE.Float32BufferAttribute(newUv.flat(),2)
  // shapeGeom.setAttribute('uv',newUvFloat32)
  // let material = new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
  // let mesh = new THREE.Mesh(shapeGeom, material);
  let pic = new URL('../../assets/image/pwa-512x512.png', import.meta.url).href
  var loader = new THREE.TextureLoader();
  var texture = loader.load(pic);
  // 使用纹理进行材质创建
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  var textureMaterial = new THREE.MeshBasicMaterial({ map: texture })
  var mesh = new THREE.Mesh(shapeGeom, textureMaterial);
  scene.add(mesh)

  let a = new JiGuangLeiDaCheZai(10,5)
  scene.add(a.group)
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
  <div wfull hfull id="shapeTexture">
  </div>
</template>
<route lang="yaml">
  meta:
    layout: home
</route>