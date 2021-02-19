class ObjectPool {
	constructor() {
		this.vectorPool = new VectorPool()
		//polygonPool = new PolygonPool()
		//interactiveObjectPool = new InteractiveObjectPool()
	}
	
	getVector() {
		return this.vectorPool.getVector()
	}
	
	getVectorInit(x,y) {
		return this.vectorPool.getVectorInit(x,y)
	}
	
	returnVector(vec) {
		this.vectorPool.returnVector(vec)
	}
}