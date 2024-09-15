import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import vertexShader from './shaders/vertexShader.glsl'
import fragmentShader from './shaders/fragmentShader.glsl'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    114,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 2
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio * 0.33)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

// shader material
const uniforms = {
    tDiffuse: { value: null },
}
const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader,
    fragmentShader,
})

// geo
const floorMaterial = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
})
const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 32, 32)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.receiveShadow = true
floor.rotateX(-Math.PI / 2)
floor.position.y = -3
scene.add(floor)

const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 2)
const objMaterial = new THREE.MeshLambertMaterial()
const icosahedron = new THREE.Mesh(icosahedronGeometry, objMaterial)
icosahedron.castShadow = true
icosahedron.receiveShadow = true
scene.add(icosahedron)

const loader = new GLTFLoader()
loader.load(
    'models/scene.gltf',
    function (gltf) {
        const model = gltf.scene
        scene.add(model)
        model.position.x = -160
        model.position.y = -10
        model.position.z = -60
    },
    undefined,
    function (error) {
        console.error(error)
    }
)

// light
var light = new THREE.PointLight(0xffffff, 1)
light.castShadow = true
light.shadow.bias = 0.00001
light.shadow.mapSize.width = 4096
light.shadow.mapSize.height = 4096
light.position.set(100, 100, 100)
scene.add(light)

function orbit(body, orbiter, speed, distance) {
    var time = Date.now()
    orbiter.position.x =
        Math.cos((time * speed) / 1000) * distance + body.position.x
    orbiter.position.z =
        Math.sin((time * speed) / 1000) * distance + body.position.z
}

const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)
const ditherPass = new ShaderPass(shaderMaterial)
ditherPass.renderToScreen = true
composer.addPass(ditherPass)

function animate() {
    requestAnimationFrame(animate)
    icosahedron.rotation.x += 0.01
    icosahedron.rotation.y += 0.01
    orbit(floor, light, 0.1, 100)
    // renderer.render(scene, camera)
    composer.render()
}
animate()
