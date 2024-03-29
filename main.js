import * as THREE from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js'

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import vertexShader from './shaders/vertexShader.glsl'
import fragmentShader from './shaders/fragmentShader.glsl'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 10
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio * 1)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

const controls = new FirstPersonControls(camera, renderer.domElement)
controls.lookSpeed = 0.001
controls.movementSpeed = 0.1

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

const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0)
const objMaterial = new THREE.MeshLambertMaterial()
const cube = new THREE.Mesh(icosahedronGeometry, objMaterial)
cube.castShadow = true
cube.receiveShadow = true
cube.position.x = -2
cube.position.z = 2
scene.add(cube)

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const sphere = new THREE.Mesh(sphereGeometry, objMaterial)
sphere.castShadow = true
sphere.receiveShadow = true
sphere.position.x = 2
sphere.position.z = -2
scene.add(sphere)

// light
var light = new THREE.PointLight(0xffffff, 1)
light.castShadow = true
// light.shadow.bias = 0.00001
light.shadow.mapSize.width = 2048
light.shadow.mapSize.height = 1024
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
// ditherPass.renderToScreen = true
composer.addPass(ditherPass)

function animate() {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  orbit(floor, light, 0.1, 100)
  controls.update(1)
  // renderer.render(scene, camera)
  composer.render()
}
animate()
