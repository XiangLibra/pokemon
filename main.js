import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById("viewer-container");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 5, 5);
scene.add(directionalLight);

const loader = new GLTFLoader();
loader.load('models/pikachu.glb', function (gltf) {
  const model = gltf.scene;
  model.scale.set(0.2, 0.2, 0.2);
  model.position.y = 0.5;
  scene.add(model);

  function animate() {
    requestAnimationFrame(animate);
    model.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
}, undefined, function (error) {
  console.error('載入模型失敗', error);
});

const pokemonName = 'pikachu';

fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.json();
  })
  .then(data => {
    const infoDiv = document.getElementById('pokemon-info');

    // 招式整理成列表
    const moveList = data.moves.map(move => `<li>${move.move.name}</li>`).join('');

    infoDiv.innerHTML = `
      <h2>${data.name.toUpperCase()}</h2>
      <p>身高: ${data.height}</p>
      <p>體重: ${data.weight}</p>
      <p>類型: ${data.types.map(type => type.type.name).join(', ')}</p>
      <h3>可學會的招式</h3>
      <ul>${moveList}</ul>
    `;
  })
  .catch(error => {
    document.getElementById('pokemon-info').textContent = '⚠️ 無法取得資料';
    console.error('發生錯誤:', error);
  });

fetch('https://pokeapi.co/api/v2/pokemon-species/25')
  .then(response => response.json())
  .then(data => {
    const entries = data.flavor_text_entries;
    const entry = entries.find(e => e.language.name === 'zh-Hant') ||
                  entries.find(e => e.language.name === 'zh-Hans') ||
                  entries.find(e => e.language.name === 'en');
    document.getElementById('dex-info').textContent =
      entry ? entry.flavor_text.replace(/\n|\f/g, ' ') : '❓ 找不到圖鑑描述';
  })
  .catch(err => {
    document.getElementById('dex-info').textContent = '⚠️ 圖鑑描述載入失敗';
    console.error(err);
  });