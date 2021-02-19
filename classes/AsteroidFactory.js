class AstroidFactory {
	constructor(asteroidId, objPool) {
		this.id = asteroidId
		this.objPool = objPool
	}
	
	proceduralAsteroid(minSize, maxSize, sizeDiff, numLines, origin) {
		let vertices = []
		
		let r1 = minSize + Math.random() * (maxSize-minSize)
		sizeDiff *= r1
		let r2 = r1 + Math.random() * (sizeDiff)
		let angle = 2*Math.PI/numLines
		let currAngle = 0
		for (let i=0, n=numLines; i<n; i++) {
			let r = r1 + Math.random() * (r2-r1)
			let x = Math.cos(currAngle)*r
			let y = Math.sin(currAngle)*r
			vertices.push(this.objPool.getVectorInit(x,y))
			currAngle += angle
		}

		return this.createAsteroid(origin, vertices)
	}
	
	proceduralAsteroid2(minSize, maxSize, sizeDiff, numLines, origin) {
		let vertices = []
		let a = 1
		let b = 0.5+Math.random()
		
		let r1 = minSize + Math.random() * (maxSize-minSize)
		sizeDiff *= r1
		let r2 = r1 + 0.1*r1 + Math.random() * (sizeDiff)
		let angle = 2*Math.PI/numLines
		let currAngle = 0
		for (let i=0, n=numLines; i<n; i++) {
			let r = r1 + Math.random() * (r2-r1)
			let x = a*Math.cos(currAngle)*r
			let y = b*Math.sin(currAngle)*r
			vertices.push(this.objPool.getVectorInit(x,y))
			currAngle += angle
		}

		return this.createAsteroid(origin, vertices)
	}
	
	createAsteroid(origin, vertices) {
		return new InteractiveObject(this.id, origin, vertices) 
	}
	
	
}
