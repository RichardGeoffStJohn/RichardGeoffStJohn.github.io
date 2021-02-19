class InteractiveObject {
	//vertices are wrt origin
	static objId = 0
	
	constructor(_id, _origin, _vertices) {
		InteractiveObject.objId++
		this.IOid = InteractiveObject.objId
		this.id = _id
		this.origin = _origin
		this.zone = {i:0, j:0}
		this.vertices = _vertices
		this.observers = []
		this.style = null
		this.velocity = new Vector2D(0,0)
		this.accel = new Vector2D(0,0)
		this.rotationalVel = 0 //radians per frame
		this.rotationalPos = 0
		this.radius = null
		this.density = 10
		this.mass = null
		this.centreMass = this.calcCentreMass()
		this.boundingBox = this.calcBoundingBox()
		this.convexHull = new ConvexPolygon(this.vertices)
		this.momentInertia = this.calcMomInert()
		
		//////
		this.intersecting = false
		this.colliding = false
		this.finishedColCalc = false
		
		this.collisionPoint = new Vector2D(0,0)
		
		//this.collisionSet = new Set()
	}
	
	getIOid(){
		return this.IOid
	}
	
	addObserver(observer) {
		this.observers.push(observer)
	}
	removeObserver(observer) {
		for(let i=0; i < this.observers.length; i++) {
			if (observers[i] === observer) {
				this.observers.splice(i,1)
				return true
			}
		}
		return false
	}
	
	notifyObservers() {
		for(let obs of this.observers) {
			obs.update(this)
		}
	}
	
	getId() {
		return this.id
	}
	getOrigin() {
		return this.origin
	}
	getStyle() {
		return this.style
	}
	getVertices() {
		return this.vertices
	}
	
	getCentreMass() {
		return this.centreMass
	}
	getTrCentreMass() {
		return this.centreMass.add(this.getOrigin())
	}
	
	getRotationalVelocity() {
		return this.rotationalVel
	}
	
	getRotationalPos() {
		return this.rotationalPos
	}
	getVelocity() {
		return this.velocity.copy() 
	}
	
	getRPerp(pt) {
		let r_pt = pt.subtract(this.getTrCentreMass())
		let rperp = new Vector2D(-r_pt.getY(),r_pt.getX())
		return rperp
	}
	
	//pt must be a point within the polygon of this object
	getVelAtPt(pt) {
		let rperp = this.getRPerp(pt)
		rperp.scalarMult(this.getRotationalVelocity())
		rperp.translateV(this.getVelocity())
		return rperp
	}
	
	getMass() {
		return this.mass
	}
	
	getMomentInertia() {
		return this.momentInertia
	}
	
	getZone() {
		return this.zone
	}
	getBBLengthX() {
		return this.boundingBox.getX()
	}
	getBBLengthY() {
		return this.boundingBox.getY()
	}
	getBBVertices(){
		let verts = []
		verts.push(this.getOrigin().copy())
		verts.push(this.getOrigin().addXY(0,this.getBBLengthY()))
		verts.push(this.getOrigin().addXY(this.getBBLengthX(),this.getBBLengthY()))
		verts.push(this.getOrigin().addXY(this.getBBLengthX(),0))
		
		return verts
	}
	
	getBBCol(){
		let col
		if (this.colliding) {
			col = 'pink'
		} else if (this.intersecting){
			col = 'yellow'
		} else {
			col = 'lime'
		}
		
		return col
	}
	
	getConvHullVerts() {
		return this.convexHull
	}
	
	setZone(i,j) {
		this.zone.i = i
		this.zone.j = j
	}

	moveOrigin(vec) {
		this.origin.translateV(vec)
		
	}
		
	setVel(x,y){
		this.velocity.x = x
		this.velocity.y = y
	}
	changeVel(x,y) {
		this.velocity.translate(x,y)
		
		//this.velocity.x = x
		//this.velocity.y = y
	}
	addVelVec(v) {
		this.velocity.translateV(v)
	}
	
	changeAccel(x,y) {
		this.accel.translate(x,y)
		
		//this.accel.x = x
		//this.accel.y = y
	}
	
	zeroAccel() {
		this.accel.zero()
	}
	
	changeRotationalVel(radPer) {
		this.rotationalVel += radPer
	}
	
	zeroRotationalVel() {
		this.rotationalVel = 0
	}
	
	updateRotationalPos() {
		this.rotationalPos += this.rotationalVel
		if(this.rotationalPos > 2*Math.PI) {this.rotationalPos -= 2*Math.PI}
		if(this.rotationalPos < 0) {this.rotationalPos += 2*Math.PI}
	}
	
	
	
	isColliding(){
		return this.colliding
	}
	
	isCollidingWith(obj){
		return this.collisionSet.has(obj.getIOid())
	}
	
	setColliding(obj){
		this.colliding = true
		//this.collisionSet.add(obj.getIOid())
	}
	
	setFinishedColCalc(){
		this.finishedColCalc = true
	}
	
	isFinishedColCalc() {
		return this.finishedColCalc
	}
	
	incrementState() {
		//this.origin.translateV(this.velocity)
		this.moveOrigin(this.velocity)
		this.velocity.translateV(this.accel)
		this.updateRotationalPos()
		this.notifyObservers()
		
		
		this.intersecting = false
		this.colliding = false
		this.finishedColCalc = false
		this.collisionPoint.set(-100,-100)
		//this.collisionSet.clear()
		//this.setTransformedVerticies()
		
		//this.origin.x += this.velocity.x
		//this.origin.y += this.velocity.y
		//this.velocity.x += this.accel.x
		//this.velocity.y += this.accel.y
	}
	
	calcCentreMass() {
		let areaOfObj = 0

		let vertices = this.vertices
		for(let i=0, n=vertices.length; i<n; i++) {
			let k = (i+1)%n
			areaOfObj += (vertices[i].getX() * vertices[k].getY() - vertices[k].getX() * vertices[i].getY())
		}
		areaOfObj *= 0.5
		this.mass = areaOfObj*this.density
		
		let x = 0
		for(let i=0, n=vertices.length; i<n; i++) {
			let k = (i+1)%n
			x += ( (vertices[i].getX() + vertices[k].getX())*(vertices[i].getX() * vertices[k].getY() - vertices[k].getX() * vertices[i].getY()))
		}
		
		x /= (6 * areaOfObj)
		
		let y = 0
		for(let i=0, n=vertices.length; i<n; i++) {
			let k = (i+1)%n
			y += ( (vertices[i].getY() + vertices[k].getY())*(vertices[i].getX() * vertices[k].getY() - vertices[k].getX() * vertices[i].getY()))
		}
		
			y /= (6 * areaOfObj)
			
		return new Vector2D(x,y)
	}
	
	calcBoundingBox() {
		let maxDistance = 0
		let vertices = this.vertices
		for(let i=0; i<vertices.length; i++) {
			let dist = this.centreMass.distance(vertices[i])
			if(dist > maxDistance) { maxDistance = dist}
		}
		this.radius = maxDistance
		//shift all vertices so that origin is the topLeft of boundingBox
		let topLeft = new Vector2D(this.centreMass.getX(), this.centreMass.getY())
		topLeft.translate(-maxDistance, -maxDistance)
		topLeft.scalarMult(-1)
		this.translateAllVertices(topLeft, this.vertices)
		this.centreMass.translateV(topLeft)
		return new Vector2D(Math.ceil(2*maxDistance), Math.ceil(2*maxDistance))
		//return Math.ceil(2*maxDistance)
	}
	
	calcMomInert() {
		return this.getMass()*Math.pow(this.radius, 2)*0.5
	}
	
	createConvexHull() {
		this.resetTransformedVertices()
		let poly = new Polygon()
		poly.copyFromArr(this.transformedVertices)
		
		return poly
	}
	
	orient(forwardDir){
		for(let i=0, n=this.vertices.length; i<n; i++) {
			this.vertices[i].rotate(this.centreMass, forwardDir)
		}
		this.convexHull.rotate(this.centreMass, forwardDir)
	}
	
	initTransformedVertices() {
		for(let i=0, n=this.vertices.length; i<n; i++) {
			this.transformedVertices.push(new Vector2D(0,0))
		}
	}
	
	resetTransformedVertices() {
		for(let i=0, n=this.vertices.length; i<n; i++) {
			this.transformedVertices[i].setTo(this.vertices[i])
		}
	}
		
	rotate() {
		for(let i=0, n=this.transformedVertices.length; i<n; i++) {
			this.transformedVertices[i].rotate(this.centreMass, this.rotationalPos)
		}
		
	}
	translateAllVertices(vec, verticesArr) {
		for(let vertex of verticesArr) {
			vertex.translateV(vec)
		}
	}
	
	setTransformedVertices() {
		this.resetTransformedVertices()
		this.rotate()
		this.translateAllVertices(this.getOrigin(), this.transformedVertices)
	}
	getTransformedVertices() {
		let ret = []
		for (let v of this.vertices){
			ret.push(v.copy())
		}
		for(let i=0, n=ret.length; i<n; i++) {
			ret[i].rotate(this.centreMass, this.rotationalPos)
		}
		this.translateAllVertices(this.getOrigin(), ret)
		return ret
	}
	getTransVertsCH() {
		return this.convexHull.getTransformedVertices(this.getOrigin(), this.rotationalPos)
	}
}

