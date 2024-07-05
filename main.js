import './style.css'
import * as THREE from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

let scene, camera, renderer, player, track, score = 0
const checkpoints = []
const playerSpeed = 0.15
const trackLength = 1000
const checkpointInterval = 20
let playerVelocity = new THREE.Vector3()

function init() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0xb6b8cc)
  document.querySelector('#app').appendChild(renderer.domElement)

  createTrack()
  createPlayer()
  createCheckpoints()

  camera.position.set(0, 6, -15)
  camera.lookAt(player.position)

  window.addEventListener('resize', onWindowResize, false)
  document.addEventListener('keydown', onKeyDown, false)
  document.addEventListener('keyup', onKeyUp, false)

  animate()
}

function createTrack() {
  const geometry = new THREE.BoxGeometry(10, 1, trackLength)
  const material = new THREE.MeshBasicMaterial({ color: 0x44557a })
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

function createCheckpoints() {
  for (let i = checkpointInterval; i < trackLength; i += checkpointInterval) {
    const checkpoint = createCheckpoint(i)
    checkpoints.push(checkpoint)
    scene.add(checkpoint)
  }
}

function createCheckpoint(position) {
  const checkpointGroup = new THREE.Group()
  checkpointGroup.position.set(0, 2.5, position)

  const leftGate = createGate(-2.5, 0xff0000)
  const rightGate = createGate(2.5, 0x0000ff)

  checkpointGroup.add(leftGate)
  checkpointGroup.add(rightGate)

  checkpointGroup.userData = {
    leftEquation: generateEquation(),
    rightEquation: generateEquation()
  }

  const loader = new FontLoader()
  loader.load('poppins.json', (font) => {
  })
}



function createGate(xPosition, color, equation) {
  const geometry = new THREE.BoxGeometry(5, 5, 0.5)
  const material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.5 })
  const gate = new THREE.Mesh(geometry, material)
  gate.position.set(xPosition, 0, 0)

  const formattedEquation = formatEquation(equation)
  const textGeometry = new THREE.TextGeometry(formattedEquation, {
    font: font,
    size: 0.5,
    height: 0.1,
  })

  const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
  const textMesh = new THREE.Mesh(textGeometry, textMaterial)
  textMesh.rotation.y = Math.PI
  gate.add(textMesh)

  return gate
}

function formatEquation(equation) {

  return `${equation.operator}${equation.value}`
}

function generateEquation() {
  const operators = ['+', '-', '*', '/']
  const operator = operators[Math.floor(Math.random() * operators.length)]
  const value = Math.floor(Math.random() * 10) + 1
  return { operator, value }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function onKeyDown(event) {
  switch (event.key.toLowerCase()) {
    case 'a':
      playerVelocity.x = -playerSpeed
      break
    case 'd':
      playerVelocity.x = playerSpeed
      break
  }
}

function onKeyUp(event) {
  switch (event.key.toLowerCase()) {
    case 'a':
      break
  }
}

function animate() {
  requestAnimationFrame(animate)

  player.position.add(playerVelocity)
  player.position.x = Math.max(-4, Math.min(4, player.position.x))
  player.position.z += playerSpeed
  updateCameraPosition()

  checkCheckpointCollisions()

  if (player.position.z >= trackLength) {
    alert(`Game Over! Final Score: ${score}`)
    player.position.z = 0
    score = 0
  }

  updateScoreDisplay()
  renderer.render(scene, camera)
}

function updateCameraPosition() {
  const cameraOffset = new THREE.Vector3(0, 6, -15)
  camera.position.copy(player.position).add(cameraOffset)
  camera.lookAt(player.position)
}

function checkCheckpointCollisions() {
  for (const checkpoint of checkpoints) {


    if (Math.abs(player.position.z - checkpoint.position.z) < 0.5) {



      // Collision logic here
    } else {
      checkpoint.position.y = -10; // Move checkpoint out of view
    }
  }
}

function applyEquation(equation) {
  switch (equation.operator) {
    case '+':
      score += equation.value
      break
    case '-':
      score -= equation.value
      break
    case '*':
      score *= equation.value
      break
    case '/':
      score = Math.floor(score / equation.value)
      break
  }
}

function updateScoreDisplay() {
  document.getElementById('score').innerText = `Score: ${score}`
}

init()