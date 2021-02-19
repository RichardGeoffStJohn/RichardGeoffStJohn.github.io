class CollisionList {
	constructor() {
		this.collisionObjArr = []
		this.collisionObjPool = []
		this.initPool()
	}
	
	resetDetector() {
		while(this.collisionObjArr.length > 0) {
			this.collisionObjPool.push(this.collisionObjArr.pop())	
		}
	}
	
	addCollision(objOne, objTwo) {
		if(this.collisionObjPool.length > 0) {
			let collision = this.collisionObjPool.pop()
			collision.setCollision(objOne, objTwo)
			this.collisionObjArr.push(collision)
		}
		else {
			this.collisionObjPool.push(new Collision())
			this.addCollision(objOne, objTwo)
		}
	}
	
	resolveCollisions() {
	/*	for(let c of this.collisionObjArr) {
			console.log("obj 1: (" + c.objOne.getOrigin().getX() + ", " + c.objOne.getOrigin().getY() + ")")
			console.log("obj 2: (" + c.objTwo.getOrigin().getX() + ", " + c.objTwo.getOrigin().getY() + ")")
		}
	*/	
		let collisionCount = 0
		let c = null
		while(this.collisionObjArr.length > 0) {
			c = this.collisionObjArr.pop()
			collisionCount += c.resolve()
			this.collisionObjPool.push(c)
		}
		return collisionCount
	}
	
	initPool() {
		for(let i=0; i<10; i++) {
			this.collisionObjPool.push(new Collision())
		}
	}
}