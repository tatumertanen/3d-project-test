import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let scene, camera, renderer, player, track, score = 0
const gates = []
const playerSpeed = 0.1
const trackLength = 1000
const gateInterval = 20

function init() {
scene = new THREE.Scene()
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.querySelector('#app').appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.25
controls.enableZoom = false

createTrack()
createPlayer()
createGates()

camera.position.set(0, 5, -10)
camera.lookAt(player.position)

window.addEventListener('resize', onWindowResize, false)
document.addEventListener('keydown', onKeyDown, false)

animate()
}

function createTrack() {
const geometry = new THREE.BoxGeometry(10, 1, trackLength)
const material = new THREE.MeshBasicMaterial({ color: 0x808080 })
track = new THREE.Mesh(geometry, material)
track.position.set(0, -0.5, trackLength / 2)
scene.add(track)
}

function createPlayer() {
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
player = new THREE.Mesh(geometry, material)
player.position.set(0, 0.5, 0)
scene.add(player)
}

function createGates() {
for (let i = gateInterval; i < trackLength; i += gateInterval) {
const gate = createGate(i)
gates.push(gate)
scene.add(gate)
}
}

function createGate(position) {
const geometry = new THREE.BoxGeometry(10, 5, 0.5)
const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
const gate = new THREE.Mesh(geometry, material)
gate.position.set(0, 2.5, position)
gate.userData = {
effect: Math.random() < 0.5 ? 'add' : 'multiply',
value: Math.random() < 0.5 ? 50 : 2
}
return gate
}

function onWindowResize() {
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()
renderer.setSize(window.innerWidth, window.innerHeight)
}

function onKeyDown(event) {
switch (event.keyCode) {
case 37: // left arrow
if (player.position.x > -4) player.position.x -= 1
break
case 39: // right arrow
if (player.position.x < 4) player.position.x += 1
break
}
}

function animate() {
requestAnimationFrame(animate)

player.position.z += playerSpeed
camera.position.z = player.position.z - 10

checkGateCollisions()

if (player.position.z >= trackLength) {
alert(`Game Over! Final Score: ${score}`)
player.position.z = 0
score = 0
}

updateScoreDisplay()
renderer.render(scene, camera)
}

function checkGateCollisions() {
for (const gate of gates) {
if (Math.abs(player.position.z - gate.position.z) < 0.5 &&
Math.abs(player.position.x - gate.position.x) < 5) {
if (gate.userData.effect === 'add') {
score += gate.userData.value
} else {
score *= gate.userData.value
}
gate.position.y = -10; // Move gate out of view
}
}
}

function updateScoreDisplay() {
document.getElementById('score').innerText = `Score: ${score}`
}

init()