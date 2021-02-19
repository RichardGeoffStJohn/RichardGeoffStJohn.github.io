class VectorPool {
	constructor() {
		this.pool = []
	}
	
	getVector() {
		if(this.pool.length === 0) {
			this.pool.push(new Vector2D(0,0, this))
		}
		return this.pool.pop()
	}
	
	getVectorInit(x,y) {
		let vec = this.getVector()
		vec.set(x,y)
		return vec
	}
	
	returnVector(vec) {
		vec.zero()
		this.pool.push(vec)
	}
}