// Import three.js
import * as THREE from 'three';
// Import addons for three.js (fps monitor, bloom effect stuff)
import Stats from 'stats-gl';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// Initialize the 3d scene
const scene = new THREE.Scene();

// Create the camera (fov=125)
const camera = new THREE.PerspectiveCamera(125, window.innerWidth/window.innerHeight, 0.1, 250);
scene.add(camera)

// Create the WebGL renderer and add the 3d canvas to the webpage
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
// Set the size and pixel ratio of the renderer based on the window's dimensions
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Initialize the performance profiler
const stats = new Stats({horizontal:false});
stats.init(renderer);
let statsVisible=true
document.body.appendChild(stats.dom);
toggleStats()

function toggleStats() {
    statsVisible = !statsVisible
    stats.domElement.style.display = statsVisible ? 'block' : 'none';
}

// Toggle the performance profiler overlay when the "`" key is pressed.
window.addEventListener('keydown', (event) => {if (event.key === '`') {toggleStats()}});

// Create the cubes (not really cubes)
function generateCubes(amount, radius, length) {
    let cubes = []
    for(let i=0; i<amount; i++) {
        // Create the mesh and material for the cube
        const geometry = new THREE.BoxGeometry(1,1,3)
        const material = new THREE.MeshStandardMaterial({color:0x005eb0})
        const cube = new THREE.Mesh(geometry, material)
        
        // Place the cube in a random position along a cylinder's surface
        const radians = (Math.random()*360)*(Math.PI/180)
        const x = Math.cos(radians)*radius
        const y = Math.sin(radians)*radius
        const z = Math.random()*length

        cube.position.set(x,y,z)

        // Add the cube to the list of cubes
        cubes.push(cube)
    }
    return cubes
}

// Call the function to initialize the cubes
const cubes = generateCubes(2500, 25, 1000)

// Go through the cubes and add each one to the scene
cubes.forEach(cube=>{
    scene.add(cube)
})

// Create the lighting for the scene
const pointLight = new THREE.PointLight(0xFFFFFF)
pointLight.intensity = 250
pointLight.position.set(0,0,0)

// Adding to the camera will make the light follow the camera's position
camera.add(pointLight)

// Uncomment next two lines to give the pointLight a visible hitbox
// const pointLightHelper = new THREE.PointLightHelper(pointLight)
// scene.add(pointLightHelper)

// Variable that keeps track of the camera's slight backwards movement
let cameraOffset=0

// Function that handles moving the camera based on the user's position on the webpage
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    camera.position.z = 250+(t*-0.1)+cameraOffset
}

// Bloom effect code...
const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = 0;

const outputPass = new OutputPass();

const composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );
composer.addPass( outputPass );
// End of bloom effect code.

// Function to resize the 3d canvas when the user resizes their window
let previousHeight = window.innerHeight;
function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Only update the height if the new height is greater than the previous height
    // This is to improve comptibility on mobile devices
    if (height > previousHeight) {
        previousHeight = height;
    }

    camera.aspect = width / previousHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(width, previousHeight);
    composer.setSize(width, previousHeight);
}

// Main animation loop
function animate() {
    // Call the onWindowResize function if the window is resized
    window.addEventListener( 'resize', onWindowResize )

    // Start the animation process
    requestAnimationFrame(animate);

    // Call the function to update the camera's position
    moveCamera()

    // Add some slight rotation and backwards movement to the camera to make
    // the background less boring when the user isn't actively scrolling
    camera.rotation.z+=0.00025
    cameraOffset+=0.005

    // Render the scene!
    composer.render(scene, camera);

    // Update the performance profiler
    stats.update()
}

// Call the animation function
animate()
