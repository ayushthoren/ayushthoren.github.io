import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(125, window.innerWidth/window.innerHeight, 0.1, 250);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    // antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(0)

//

function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

const lenis = new Lenis({
    duration: 1.5,
    easing: easeOutCubic,
})

// Lenis debugging, uncomment to see scroll info in console
// lenis.on('scroll', (e) => {
//   console.log(e)
// })

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

//

// const controls = new OrbitControls( camera, renderer.domElement );

// create the testing torus geometry
const geometry = new THREE.TorusGeometry(10,3,16,100);
const material = new THREE.MeshStandardMaterial({color:0x0088FF})
const torus = new THREE.Mesh(geometry, material);

scene.add(torus)

// create the cubes

function generateCubes(amount, radius, length) {
    let cubes = []
    for(let i=0; i<amount; i++) {
        const geometry = new THREE.BoxGeometry(1,1,3)
        // const material = new THREE.MeshStandardMaterial({color:0x00FF88})
        const material = new THREE.MeshStandardMaterial({color:0x005eb0})
        const cube = new THREE.Mesh(geometry, material)

        // const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(1000))
        
        const radians = (Math.random()*360)*(Math.PI/180)
        const x = Math.cos(radians)*radius
        const y = Math.sin(radians)*radius
        const z = Math.random()*length

        cube.position.set(x,y,z)

        cubes.push(cube)
    }
    return cubes
}

const cubes = generateCubes(2500, 25, 1000)

cubes.forEach(cube=>{
    scene.add(cube)
})

//Add the "at" logo
// const textureLoader = new THREE.TextureLoader();
// const svgTexture = textureLoader.load("../images/at_logo.svg");

// const planeGeometry = new THREE.PlaneGeometry(25, 25); // Adjust the size as needed
// const planeMaterial = new THREE.MeshBasicMaterial({
//     map: svgTexture,
//     side: THREE.DoubleSide,
//     transparent: true
// });

// const logoMesh = new THREE.Mesh(planeGeometry, planeMaterial);
// scene.add(logoMesh);

// logoMesh.position.set(0,0,225)

// create the lighting for the scene

const pointLight = new THREE.PointLight(0xFFFFFF)
pointLight.intensity = 250
pointLight.position.set(0,0,0)
// pointLight.decay = 0.45

// const pointLightHelper = new THREE.PointLightHelper(pointLight)

// const rectLight = new THREE.RectAreaLight( 0xffffff, 400,  0.5, 500 );
// rectLight.position.set( 0, 0, 0 );
// rectLight.lookAt( 0, 99999999999, 0 );

// scene.add( rectLight )

// const rectLightHelper = new RectAreaLightHelper( rectLight );
// rectLight.add( rectLightHelper );

// const spotLight = new THREE.SpotLight(0xFFFFFF)
// spotLight.intensity=1250000
// spotLight.position.set(0,100,0)
// spotLight.angle = (camera.fov*(Math.PI/180))
// spotLight.decay = 4

// const spotLightHelper = new THREE.SpotLightHelper(spotLight)

// const ambientLight = new THREE.AmbientLight(0xFFFFFF)
// ambientLight.intensity=0.1

camera.add(pointLight)
// scene.add(spotLight)

// const p1 = new THREE.PointLight(0xFFFFFF)
// p1.intensity = 2500
// p1.position.set(0,0,50)

// scene.add(p1)

// create a grid for the scene
const gridHelper = new THREE.GridHelper(1000,50)
// scene.add(gridHelper)

let cameraOffset=0

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    camera.position.z = 250+(t*-0.1)+cameraOffset
    // if(t>0) {camera.position.z=0}
    // console.log(t)
}

// document.body.onscroll = moveCamera

const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = 0;
// bloomPass.strength = params.strength;
// bloomPass.radius = params.radius;

const outputPass = new OutputPass();

const composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );
composer.addPass( outputPass );

scene.add(camera)






let previousHeight = window.innerHeight;

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Only update the height if the new height is greater than the previous height
    if (height > previousHeight) {
        previousHeight = height;
    }

    camera.aspect = width / previousHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(width, previousHeight);
    composer.setSize(width, previousHeight);
}









function animate() {
    stats.begin()

    window.addEventListener( 'resize', onWindowResize )

    requestAnimationFrame(animate);

    moveCamera()

    torus.rotation.x += 0.005;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.005

    // logoMesh.rotation.y += 0.005

    camera.rotation.z+=0.00025
    cameraOffset+=0.005

    composer.render(scene, camera);

    console.log(camera.position.z)

    stats.end()
}

animate()
