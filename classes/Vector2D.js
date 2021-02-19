/*
		2D Vector
*/

class Vector2D {
	constructor(xCoord, yCoord) {
		this.x = xCoord
		this.y = yCoord
	}
	
	getX() 	{ return this.x}
	getY()	{ return this.y}
	
	
	equals(a, epsilon=0.01) {
		return (Math.abs(this.getX()-a.getX()) < epsilon) && (Math.abs(this.getY()-a.getY() < epsilon))
	}
	
	zero() {
		this.x = 0
		this.y = 0
	}
	//Euclidean distance between point a and b
	distance(a) {
		return Math.sqrt(this.distanceSqr(a))
	}
	distanceSqr(a) {
		return Math.pow(a.getX() - this.x, 2) + Math.pow(a.getY() - this.y, 2)
	}
	
	magnitudeSqr() {
		return Math.pow(this.getX(),2) + Math.pow(this.getY(), 2) 
	}
	magnitude() {
		return Math.sqrt(this.magnitudeSqr())
	}
	normalize() {
		this.scalarMult(1/this.magnitude())
	}
	
	///////////////////////////////////////////////////////
	/*
		These methods return new vector
	*/
	
	//returns new vector that is the sum of this and a
	addXY(x,y) {
		return new Vector2D(this.getX()+x, this.getY()+y)
	}
	add(a) {
		return new Vector2D(this.x+a.getX(),this.y+a.getY())
	}
	subtract(a) {
		return new Vector2D(this.x-a.getX(),this.y-a.getY())
	}
	
	neg() {
		let vec = new Vector2D(0,0)
		vec.set(-this.x, -this.y)
		return vec
	}
	
	// this cross b cross this, the 3rd dimension cancels
	doubleCross(b) {
		let q = this.getX()*b.getY()-this.getY()*b.getX()
		let x = -1*this.getY()*q
		let y = this.getX()*q
		return new Vector2D(x,y)
	}
	
	copy(a) {
		return new Vector2D(this.getX(),this.getY())
	}
	
	///////////////////////////////////////////////////////
	
	setTo(a) {
		this.x = a.getX()
		this.y = a.getY()
	}
	
	set(x,y) {
		this.x = x
		this.y = y
	}
	
	scalarMult(multiplier) {
		this.x *= multiplier
		this.y *= multiplier
	}
	
	dotProduct(vec) {
		return this.x * vec.getX() + this.y * vec.getY()
	}
	
	/*	1 argument : must be a Vector2D object
		2 arguments : 2 numbers
	*/
	translateV(a) {
		this.x += a.getX()
		this.y += a.getY()
	}
	
	translateVNeg(a) {
		this.x -= a.getX()
		this.y -= a.getY()
	}
	
	//shift point a
	translate(xShift, yShift) {
		this.x += xShift
		this.y += yShift
	}
	
	rotateVec(angle) {
		this.rotate(new Vector2D(0,0), angle)
	}
	
	rotate(centrePoint, angle) {
		this.translate(-centrePoint.x, -centrePoint.y)
		
		let x = this.x
		let y = this.y
		this.x = x*Math.cos(angle) - y*Math.sin(angle)
		this.y = x*Math.sin(angle) + y*Math.cos(angle)
		
		this.translate(centrePoint.x, centrePoint.y)
	
	}
	
	
}



