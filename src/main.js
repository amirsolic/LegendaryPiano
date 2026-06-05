import painoUrl from './assets/3dmodel/piano.glb'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// creat scene and camera and renderer

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('#app').appendChild(renderer.domElement);


//adding light 
const light = new THREE.AmbientLight(0xffffff, 1)
scene.add(light);


const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const loader = new GLTFLoader();

loader.load(
  painoUrl,
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    console.log("piano loaded", model)
  },
  undefined,
  (error) => {
    console.error('An error happened While loading the model', error);
  },
);



function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
console.log(painoUrl);

