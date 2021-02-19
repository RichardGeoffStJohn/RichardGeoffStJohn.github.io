class ConvexPolygon extends Polygon{
	/* Constructor takes an array of Vector2D representing any polygon(convex or concave) and constructs
	a convex hull of the input polygon.
	
	*/
	constructor(vertices) {
		super(vertices)
		this.setConvexVerts()
		
	}

	setConvexVerts(num=20){
		let convVerts = []
		let nextPoint = null
		let direction = new Vector2D(1,0)
		for(let i=0; i<num; i++){
			direction.rotateVec(2*Math.PI/num)
			nextPoint = super.support(direction)
			//console.log(nextPoint)
			if (i == 0 || !nextPoint.equals(convVerts[convVerts.length-1])){
				if(convVerts.length > 1 && nextPoint.equals(convVerts[0])) {continue}
				convVerts.push(nextPoint)
			}
			
		}
		//console.log(convVerts)
		super.vertices = convVerts
		
	}
	/*
	support(direction) {
		let dot=0
		let support = new Vector2D(0,0) 
		let incr = false
		let rev = false
		
		let verts = super.vertices
		let max = verts[0].dotProduct(direction)
		
		let i=1
		while(true){
			dot = verts[i].dotProduct(direction)
			if(dot > max) { 
				incr = true
				max = dot
				support.setTo(v)
				if(rev){i--}
				else {i++}
			} else if (incr) {
				return support
			} else {
				i=verts.length-1
			}
		return support
		}
	}
	*/
}