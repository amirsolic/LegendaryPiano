import painoUrl from './assets/3dmodel/piano.glb'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import hdrUrl from './assets/textuers/brown_photostudio_01_2k.hdr'
import { objectGroup, texture } from 'three/tsl';
const soundFiles = import.meta.glob('./assets/sfx/*.mp3', {eager: true});


const soundMap = {};
if (Object.keys(soundFiles).length === 0){
  console.error("vit natonest hich fily  to masir peyda koone")
}
for (const path in soundFiles) {
const fileNmae = path.split('/').pop().replace('.mp3', '');
const noteName = fileNmae.replace('s', '#')
soundMap[noteName] = soundFiles[path].default;
}

console.log("soud maps is specifice: " , Object.keys(soundMap));


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


let pianoKeys = [];  

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

    model.traverse((node) => {
        if (node.isMesh){

        const isNote = /^[A-G]/.test(node.name);

        if(isNote){
          node.material = node.material.clone();
          pianoKeys.push(node);
          console.log("obj name:", node.name);
        }else{
          node.raycast= () => {};
        }
        }
    });
  });


function playNote(key){

  const note = key.name;

  const originalcolor = key.material.color.getHex();
  key.material.color.setHex(0xff0000);

  playSound(note);

  setTimeout(() => {
    key.material.color.setHex(originalcolor);
  },200);
}




const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


window.addEventListener('mousedown', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(pianoKeys, false);
   if (intersects.length > 0) {
    const selectedKey = intersects[0].object;
    console.log("you are click this:", selectedKey.name);

    playNote(selectedKey);
   }else{
    console.log("out of cloviyes");
   }
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



function playSound(note){
  const url = soundMap[note];

if(!url){
  console.warn("sound not found", note);
  return;
}

const audio = new Audio(url);
audio.currentTime = 0;
audio.play();
}