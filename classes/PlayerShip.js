class PlayerShip extends InteractiveObject {
	constructor(id, origin, vertices, screen, forwardDir) {
		super(id, origin, vertices)
		//this.screen = _screen
		super.style = {fillStyle:'#28FCFF', lineCol:'white', lineWidth:3}
		super.addObserver(screen)
		this.rotatingLeft = false
		this.rotatingRight = false
		this.accelerating = false
		super.orient(forwardDir)
		//super.rotationalPos = forwardDir
		this.rotAccel = 0.001
	}
	
	/*
	incrementState() {
		super.incrementState()
		if (this.screen !== null) {
			this.screen.update(this)
		}
	}
	*/
	
	accelerate(force) {
		super.zeroAccel()
		super.changeAccel(Math.cos(this.rotationalPos)*force, Math.sin(this.rotationalPos)*force)
		
	}
	stopAccelerate() {
		super.zeroAccel()
	}
	
	accelRotLeft() {
		super.changeRotationalVel(-this.rotAccel)
	}
	
	accelRotRight() {
		super.changeRotationalVel(this.rotAccel)
	}
	
	setRotateLeft() {
		if(!this.rotatingLeft) {
			this.stopRotating()
			super.changeRotationalVel(-0.05)
			this.rotatingLeft = true
		}
	}
	setRotateRight() {
		if(!this.rotatingRight) {
			this.stopRotating()
			super.changeRotationalVel(0.05)
			this.rotatingRight = true
		}
	}
	stopRotating() {
		super.zeroRotationalVel()
		this.rotatingLeft = false
		this.rotatingRight = false
	}
	
	
}