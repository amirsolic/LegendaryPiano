import painoUrl from './assets/3dmodel/piano.glb'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import hdrUrl from './assets/textuers/brown_photostudio_01_2k.hdr'
import { texture } from 'three/tsl';

// creat scene and camera and renderer

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1);
camera.position.set(0, 7, 8);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('#app').appendChild(renderer.domElement);


//adding light 
const rgbeLoader = new RGBELoader();
rgbeLoader.load(hdrUrl, (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;

  scene.environment = texture;
  console.log('HDRI loaded!');
})


const loader = new GLTFLoader();

loader.load(
  painoUrl,
  (gltf) => {
    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());

    model.position.x += (model.position.x - center.x);
    model.position.y += (model.position.y - center.y);
    model.position.z += (model.position.z - center.z);
    scene.add(model);
  });



function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;

  if (camera.aspect < 1 ){
    camera.fov = 45 / camera.aspect;
  }else{
    camera.fov = 45;
  }
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
