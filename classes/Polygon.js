class Polygon {
	constructor(vertices, isConvex=false) {
		this.vertices = vertices
		this.centroid = this.calcCentroid()
		this.boundingBox = this.calcBoundingBox()
		this.isConvex = isConvex
	
		
	}

	getVertices() {
		return this.vertices
	}
	getCHverts() {
		this.convexHull.getVertices()
	}
	
	getVertex(i) {
		return this.vertices[i]
	}
	getCentroid(){
		return this.centroid.copy()
	}
	
	copy() {
		let poly = new Polygon(this.vertices)
	}
	
	translate(x,y) {
		for(let v of this.vertices) {
			v.translate(x,y)
		}
	}
	
	translateV(vec) {
		for(let v of this.vertices) {
			v.translateV(vec)
		}
	}
	
	translateAllVertices(vec, verticesArr) {
		for(let vertex of verticesArr) {
			vertex.translateV(vec)
		}
	}
	
	rotate(centrePoint, angle) {
		for(let v of this.vertices) {
			v.rotate(centrePoint, angle)
		}
	}
	
	getTransformedVertices(orig, rotPos, vertices=this.vertices) {
		let ret = []
		for (let v of this.vertices){
			ret.push(v.copy())
		}
		for(let i=0, n=ret.length; i<n; i++) {
			ret[i].rotate(this.centroid, rotPos)
		}
		this.translateAllVertices(orig, ret)
		return ret
	}
	getTransVertCH(orig, rotPos) {
		this.getTransformedVertices(orig, rotPos, this.getCHverts())
	}
	
	
	
	calcCentroid() {
		let areaOfObj = 0

		let vertices = this.vertices
		for(let i=0, n=vertices.length; i<n; i++) {
			let k = (i+1)%n
			areaOfObj += (vertices[i].getX() * vertices[k].getY() - vertices[k].getX() * vertices[i].getY())
		}
		areaOfObj *= 0.5
		
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
			let dist = this.centroid.distance(vertices[i])
			if(dist > maxDistance) { maxDistance = dist}
		}
		return [this.centroid.addXY(-maxDistance,-maxDistance),
				this.centroid.addXY(maxDistance,-maxDistance),
				this.centroid.addXY(maxDistance,maxDistance),
				this.centroid.addXY(-maxDistance,maxDistance)];
	}
	
	support(direction){
		let max = Number.NEGATIVE_INFINITY
		let dot=0
		let support = new Vector2D(0,0)

		for (let v of this.vertices) {
			dot = v.dotProduct(direction)
			if(dot > max) { 
				max = dot
				support.setTo(v)
			} 
		}
		return support
	}
	
}