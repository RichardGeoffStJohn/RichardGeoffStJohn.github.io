class Screen {
	constructor(canvWidth, canvHeight, univSize) {
		this.origin = new Vector2D(0,0)
		this.zoom = 3.5
		this.canvasWidth = canvWidth
		this.canvasHeight = canvHeight
		this.universeSize = univSize
		
		//spare vector so we don't have to keep creating objects
		this.vector = new Vector2D(0,0)
		
	}
	
	//size of the screen in the universe
	getOrigin() {
		return this.origin
	}
	
	getCanvasWidth() {
		return this.canvasWidth
	}
	
	getCanvasHeight() {
		return this.canvasHeight
	}
	
	getZoom() {
		return this.zoom
	}
	
	sizeX() {
		return this.zoom * this.canvasWidth 
	}
	
	sizeY() {
		return this.zoom * this.canvasHeight
	}
	
	changeZoom(amount) {
		this.zoom = this.zoom + amount
		this.moveLeft(amount/2*this.canvasWidth)
		this.moveUp(amount/2*this.canvasHeight)
	}
	
	setOrigin(x, y) {
/*	
		if(x > this.universeSize || y > this.universeSize) {
			console.log("Error in Screen:setOrigin(): x or y > than universe size")
			return
		}
		if(x < 0 || y < 0) {
			console.log("Error in Screen:setOrigin(): x or y < 0")
			return
		}
*/	
		if		(x > this.universeSize) {this.origin.x = x - this.universeSize}
		else if	(x < 0) 				{this.origin.x = this.universeSize + x}
		else							{this.origin.x = x}
		
		if		(y > this.universeSize) {this.origin.y = y - this.universeSize}
		else if	(y < 0) 				{this.origin.y = this.universeSize + y}
		else 							{this.origin.y = y}
		
	}
	
	moveUp(amount) {
		this.origin.y -= amount
		if(this.origin.y < 0) {this.origin.y = this.universeSize + this.origin.y}
	}
		
	moveDown(amount) {
		this.origin.y += amount
		if(this.origin.y > this.universeSize) {this.origin.y = this.origin.y - this.universeSize}
	}
	
	moveRight(amount) {
		this.origin.x += amount
		if(this.origin.x > this.universeSize) {this.origin.x = this.origin.x - this.universeSize}
	}
	
	moveLeft(amount) {
		this.origin.x -= amount
		if(this.origin.x < 0) {this.origin.x = this.universeSize + this.origin.x}
	}
	
	update(ship) {
		this.vector.setTo(ship.getCentreMass())
		this.vector.translate(-this.sizeX()/2, -this.sizeY()/2)
		this.vector.translateV(ship.getOrigin())
		//this.origin.setTo(this.vector)
		this.setOrigin(this.vector.getX(), this.vector.getY())
	}
}

