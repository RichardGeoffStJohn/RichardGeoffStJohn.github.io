/*
	Client
*/
let debugMode = false

const mainView = document.getElementById('mainView')

const BackgroundObjID = {star:1}
const InteractiveObjID = {player:1, ship:2, asteroid:3, projectile:4}

const UNIVERSE_SIZE = 50000
const NUM_SECTORS_X = 50
const NUM_SECTORS_Y = 50
const NUM_ASTEROIDS = 4000
const NUM_STARS = 25000

let ready = true
let gamePaused = false
let globalCounter = 0

let keysPressed = {arowDown:false, arrowUp:false, arrowLef:false, arrowRight:false}

let stars = []
let asteroids = []
let ships = []

const objPool = new ObjectPool()
const universe = new Universe(UNIVERSE_SIZE, NUM_SECTORS_X, NUM_SECTORS_Y)
const screen = new Screen(mainView.width, mainView.height, universe.getSize())
const mainRender = new Renderer(screen, universe, mainView.getContext('2d'))
const collisionDetector = new BroadCollisionDetector(UNIVERSE_SIZE)

let player = new PlayerShip(
	InteractiveObjID.player,
	new Vector2D(UNIVERSE_SIZE/2,UNIVERSE_SIZE/2),
	[new Vector2D(20,0), new Vector2D(35,30), new Vector2D(20,25), new Vector2D(5,30)],
	screen, Math.PI/2)


//Create background
function setBackgroundStars() {
	for(let i=0; i<NUM_STARS; i++){
		let rand1 = Math.random()*UNIVERSE_SIZE
		let rand2 = Math.random()*UNIVERSE_SIZE
		let xCoord = Math.floor(rand1)
		let yCoord = Math.floor(rand2)
		//let star = {ID:BackgroundObjID.star, origin:{x:xCoord, y:yCoord}
		
		if(rand1<0.1) {
			type = "STAR_1"
		} else if (rand1<0.4) {
			type = "STAR_2"
		} else {
			type = "STAR_3"
		}
		let star = new BackgroundObject(BackgroundObjID.star, type, {x:xCoord, y:yCoord})
		stars.push(star)
		
	}
}

function setAsteroids() {
	let factory = new AstroidFactory(InteractiveObjID.asteroid, objPool)
	
	for(let i=0; i<NUM_ASTEROIDS; i++) {
		let x = Math.floor(Math.random()*universe.getSize())
		let y = Math.floor(Math.random()*universe.getSize())
		
		asteroids.push(factory.proceduralAsteroid2(20, 200, 0.1, 40, new Vector2D(x,y)))
		asteroids[i].rotationalVel = -0.01 + Math.random()*0.02
		asteroids[i].changeVel(-4 + Math.random()*16, -4 + Math.random()*16)
		
	}
}

/*
	@paramater: zones is an array of 2-tuples(first index, second index) for zones in universe object
*/
function drawCanvas(zones) {
	
	mainRender.resetView("black")
	
	/*
	for (let zone of zones) {
		mainRender.renderZone(zone)
		mainRender.renderHud(player)
	}
	*/
	mainRender.renderHud(player)
	mainRender.renderZoneLines()
	mainRender.renderZones(zones)

	
}
function handleKeyDown(e) {
	univSize = universe.getSize()
	scrOrg = screen.getOrigin()
	
	if (e.key == 'ArrowLeft') {
		//player.setRotateLeft()
		keysPressed.arrowLeft = true
	}
	if (e.key == 'ArrowRight') {
		//player.setRotateRight()
		keysPressed.arrowRight = true
	}
	if (e.key == 'ArrowUp') {
		//player.accelerate(0.1)
		keysPressed.arrowUp = true
	}
	if (e.key == 'ArrowDown') {
		//player.accelerate(-0.02)
		keysPressed.arrowDown = true
	}
	if (e.key == '-') {
		if (screen.zoom <= 5)
				screen.changeZoom(0.05)
	}
	if (e.key == '+') {
		if (screen.zoom >= 0.7)
				screen.changeZoom(-0.05)
	}
	if (e.key == 'p') {gamePaused = !gamePaused}
	if (e.key == 'o') {mainRender.toggleBB()}
	if (e.key == 'i') {mainRender.toggleCH()}
}

function handleKeyUp(e){
	if (e.key == 'ArrowUp'){
		player.zeroAccel()
		keysPressed.arrowUp = false
	}
	if (e.key == 'ArrowDown'){
		player.zeroAccel()
		keysPressed.arrowDown = false
	}
	if (e.key == 'ArrowLeft'){
		player.stopRotating()
		keysPressed.arrowLeft = false
	}
	if (e.key == 'ArrowRight'){
		player.stopRotating()
		keysPressed.arrowRight = false
	}
}

function handlePressedKeys(){
	if (keysPressed.arrowUp == true){
		player.accelerate(0.1)
	}
	if (keysPressed.arrowDown == true){
		player.accelerate(-0.02)
	}
	if (keysPressed.arrowLeft == true){
		player.accelRotLeft()
	}
	if (keysPressed.arrowRight == true){
		player.accelRotRight()
	}
}

function zonesInScreen() {
	let scrOrg = screen.getOrigin()
	let univSize = universe.getSize()
	
	let startIndex_1 = Math.floor(scrOrg.x/univSize * universe.getNumSectorsX())-1
	let startIndex_2 = Math.floor(scrOrg.y/univSize * universe.getNumSectorsY())-1
	let endIndex_1 = Math.floor((scrOrg.x+screen.sizeX())/univSize * universe.getNumSectorsX())+1
	let endIndex_2 = Math.floor((scrOrg.y+screen.sizeY())/univSize * universe.getNumSectorsY())+1
	
	let zones = []
	for(let i=startIndex_1; i<=endIndex_1; i++) {
		for(let j=startIndex_2; j<=endIndex_2; j++) {
			let zox=0
			let zoy=0
			let wrpx=0
			let wrpy=0
			
			if (i<0) {
				zox = i+universe.getNumSectorsX()
				wrpx = -1
			}else {
				zox = i%universe.getNumSectorsX()
			}
			
			if (j<0) {
				zoy = j+universe.getNumSectorsY()
				wrpy = -1
			} else {
				zoy = j%universe.getNumSectorsY()
			}
			
			let obj = {i:zox, j:zoy, wrapX:wrpx, wrapY:wrpy}
			
			if(i >= universe.getNumSectorsX()) {obj.wrapX = 1}
			if(j >= universe.getNumSectorsY()) {obj.wrapY = 1}

			zones.push(obj)
		}
	}
	//console.log(zones)
	return zones
}

function gameLoop() {
	if(!gamePaused) {
		ready = false
		handlePressedKeys()
		
		player.incrementState()
		for(let roid of asteroids) {
			roid.incrementState()
		}
		universe.calcCollisions(collisionDetector)
		let zonesToDisp = zonesInScreen()
		drawCanvas(zonesToDisp)
		
		globalCounter++
		globalCounter%=10
		
		if(globalCounter === 0) {
		//
			debugPrint("Screen origin")
			debugPrint(screen.getOrigin())
			debugPrint("Player zone")
			debugPrint(player.getZone())
			debugPrint(player.getOrigin())
		//
		}
	} 
	requestAnimationFrame(gameLoop)
	
}

function debugPrint(str) {
	if (debugMode) {
		console.log(str)
	}
}
	
document.addEventListener('keydown', handleKeyDown)
document.addEventListener('keyup', handleKeyUp)

setBackgroundStars()
setAsteroids()
asteroids.push()

universe.setBackgroundStars(stars)
ships.push(player)

universe.setPlayer(player)
universe.setInteractiveObjects(asteroids, ships)

requestAnimationFrame(gameLoop)

