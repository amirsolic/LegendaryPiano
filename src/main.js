import painoUrl from './assets/3dmodel/piano.glb'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import hdrUrl from './assets/textuers/brown_photostudio_01_2k.hdr'
import { objectGroup, texture } from 'three/tsl';
const soundFiles = import.meta.glob('./assets/sfx/*.mp3', {eager: true});


const soundMap = {};
if (Object.keys(soundFiles).length === 0){
}
for (const path in soundFiles) {
const fileNmae = path.split('/').pop().replace('.mp3', '');
const noteName = fileNmae.replace('s', '#')
soundMap[noteName] = soundFiles[path].default;
}


const audioBuffers = {};

for (const note in soundMap) {
const audio = new Audio(soundMap[note]);
audio.preload = 'auto';
audio.load();
audioBuffers[note] = audio;
}


// creat scene and camera and renderer

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('#app').appendChild(renderer.domElement);


//adding light 
const rgbeLoader = new RGBELoader();
rgbeLoader.load(hdrUrl, (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;

  scene.environment = texture;
})


const loader = new GLTFLoader();


let pianoKeys = [];  

loader.load(painoUrl, (gltf) => {
    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());

    model.position.x += (model.position.x - center.x);
    model.position.y += (model.position.y - center.y);
    model.position.z += (model.position.z - center.z);
    scene.add(model);
    document.getElementById("loading").style.display = "none";
    model.traverse((node) => {
        if (node.isMesh){

        const isNote = /^[A-G](#|s)?\d+$/.test(node.name) && !/1$/.test(node.name);

        if(isNote){
          node.material = node.material.clone();
          node.userData.target = 0;
          pianoKeys.push(node);
        }
        }
    });
  });


function playNote(key){

  const note = key.name;
  key.userData.target = 0.12;
  playSound(note);

}




const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


window.addEventListener('mousedown', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(pianoKeys, false);
   if (intersects.length > 0) {
    const selectedKey = intersects[0].object;

    playNote(selectedKey);
   }
});


function animate(){
  requestAnimationFrame(animate);

  pianoKeys.forEach((key) => {
  key.rotation.x += (key.userData.target - key.rotation.x) * 0.4;

  key.userData.target *= 0.6;
  });

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
const baseAoudio = audioBuffers[note];
if (!baseAoudio) return;

const audio = baseAoudio.cloneNode();
audio.currentTime = 0;
audio.play();
}
