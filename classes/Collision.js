class Collision {
	constructor() {
		this.objOne = null
		this.objTwo = null
		this.simplex = null
		this.minDistSqr = null
		this.direction = new Vector2D(0,0)
	}
	
	setCollision(_objOne, _objTwo) {
		this.objOne = _objOne
		this.objTwo = _objTwo
		this.simplex = []
		this.minDistSqr = Number.POSITIVE_INFINITY
		this.direction.set(0,0)
		this.verts1 = this.objOne.getTransVertsCH()
		this.verts2 = this.objTwo.getTransVertsCH()
		//this.objOne.setTransformedVertices()
		//this.objTwo.setTransformedVertices()
	}
	
	resolve() {
		let o1 = this.objOne
		let o2 = this.objTwo
		
		
		
		if(o1.getId() === InteractiveObjID.projectile) {
			if(o2.getId() === InteractiveObjID.projectile) {
				return
			}
			else this.resolveProjectileCollision(o1, o2)
		}
		else if(o2.getId() === InteractiveObjID.projectile) {
			if(o1.getId() === InteractiveObjID.projectile) {
				return
			}
			else this.resolveProjectileCollision(o2, o1)
		}
		else {
			return this.resolveInteractiveObjectCollision()
		}
	}
	
	resolveProjectileCollision(projectile, object) {}
	
	resolveInteractiveObjectCollision() {
		let startPoint = new Vector2D(0,0)
		//any point in Minkowski sum : objOne-objTwo
		startPoint.set(this.verts1[0].getX()-this.verts2[0].getX(),
						this.verts1[0].getY()-this.verts2[0].getY())
		
		//this.simplex.push(startPoint)
		
		//console.log(startPoint)
		
		//console.log(this.objOne.getTrVertex(0).getX())
		//console.log(this.objTwo.getTrVertex(0).getX())
		
		this.direction.setTo(startPoint)
		//
		let nextPoint = this.supportMinkowskiDiff(this.verts1, this.verts2, this.direction)
		this.simplex.push(nextPoint)
		//
		//this.direction.scalarMult(-1)
		this.direction = nextPoint.neg()
		
		while(true) {
			nextPoint = this.supportMinkowskiDiff(this.verts1, this.verts2, this.direction)
			
			//console.log("nextPoint", nextPoint)
			
			
			if(nextPoint.dotProduct(this.direction) < 0) {
				//console.log("No intersection")
				return 0
			}
			this.simplex.push(nextPoint)			
			//console.log('simplex lenght:', this.simplex.length)
			if(this.checkSimplex()) {
				/*
				if(this.objOne.getId() === InteractiveObjID.player || this.objTwo.getId() === InteractiveObjID.player){
					console.log("player intersection")
				}
				*/
				
				//console.log("Intersection!!")
				this.objOne.setColliding(this.objTwo)
				this.objTwo.setColliding(this.objOne)
				
				this.expandPolytope()
				
				
				
				//console.log(this.simplex)
				//console.log(Geo.pointToLineDistSqr(new Vector2D(0,0), this.simplex[0], this.simplex[1]))
				//console.log(Geo.pointToLineDistSqr(new Vector2D(0,0), this.simplex[1], this.simplex[2]))
				//console.log(Geo.pointToLineDistSqr(new Vector2D(0,0), this.simplex[2], this.simplex[0]))
				//let mb = this.objOne.getVelocity().neg()
				//this.findCollisionPoint()
				//this.objOne.moveOrigin(mb)
				//this.objOne.setVel(0,0)
				//this.objOne.zeroRotationalVel()
				//mb = this.objTwo.getVelocity().neg()
				//this.objTwo.moveOrigin(mb)
				//this.objTwo.setVel(0,0)
				//this.objTwo.zeroRotationalVel()
				
				//console.log('done')
				
				return 1
				//break
			}
		}

		//translate o2 vertices
		
		//console.log("Resolving collision at: " + o1.getOrigin().getX() + "," + o1.getOrigin().getY())
		
	}
	
	polygonCollision(poly1, poly2) {
		this.simplex=[]
		let startPoint = new Vector2D(0,0)
		//any point in Minkowski sum : objOne-objTwo
		startPoint.set(poly1.getCentroid().getX()-poly2.getCentroid().getX(),
						poly1.getCentroid().getY()-poly2.getCentroid().getY())
		
		this.direction.setTo(startPoint)
		//
		let nextPoint = this.supportMinkowskiDiff2(poly1, poly2, this.direction)
		this.simplex.push(nextPoint)
		//
		//this.direction.scalarMult(-1)
		this.direction = nextPoint.neg()
		
		while(true) {
			nextPoint = this.supportMinkowskiDiff2(poly1, poly2, this.direction)

			if(nextPoint.dotProduct(this.direction) < 0) {
				console.log("No intersection")
				return 0
			}
			this.simplex.push(nextPoint)			
			//console.log('simplex lenght:', this.simplex.length)
			if(this.checkSimplex()) {
				console.log("player intersection")
				
				return 1
			}
		}
	}
	
	checkSimplex() {
		if (this.simplex.length === 2) {
			this.direction = (this.simplex[1].subtract(this.simplex[0])).doubleCross(this.simplex[0].neg())
		}
		else if (this.simplex.length === 3) {
			//a, b, c := simplex[0],[1],[2] 
			
			//check if origin is closest to a or b.
			let co = this.simplex[2].neg()
			let ca = this.simplex[0].subtract(this.simplex[2])
			let cb = this.simplex[1].subtract(this.simplex[2])
			
			//console.log(this.simplex[1].subtract(this.simplex[0]).dotProduct(co))
			if (this.simplex[1].subtract(this.simplex[0]).dotProduct(co) < 0) {
				//console.log('close a')
				//close to a
				
				this.direction = ca.doubleCross(cb)
				
				//console.log((this.direction).dotProduct(co))
				if ((this.direction).dotProduct(co) < 0) {
					//outside triangle
					this.direction.scalarMult(-1)
					this.simplex.splice(1,1)
				}
				else {
					//inside triangle
					//if (!this.fullCheck()) {console.log("EEEP!!")}
					return true
					//return this.fullCheck()
				}
			}
			else {
				//console.log('close b')
				
				//close to b
				this.direction = cb.doubleCross(ca)
				
				//console.log((this.direction).dotProduct(co))
				if ((this.direction).dotProduct(co) < 0) {
					//outside triangle
					this.direction.scalarMult(-1)
					this.simplex.splice(0,1)
				}
				else {
					//if (!this.fullCheck()) {console.log("EEEP!!")}
					return true
					//return this.fullCheck()
				}
			}
			
		}else {
			throw "wrong simplex size"
		}
		return false
	}
	
	fullCheck(){
		//console.log('in fullCheck')
		let ab = this.simplex[1].subtract(this.simplex[0])
		let bc = this.simplex[2].subtract(this.simplex[1])
		let ca = this.simplex[0].subtract(this.simplex[2])
		
		let ba = ab.neg()
		let cb = bc.neg()
		let ac = ca.neg() 
	
		let ao = this.simplex[0].neg()
		let bo = this.simplex[1].neg()
		let co = this.simplex[2].neg()
		
		let abNorm = ab.doubleCross(ac)				
		let bcNorm = bc.doubleCross(ba)
		let caNorm = ca.doubleCross(cb)
		
		if (abNorm.dotProduct(ao) < 0) {
			//console.log('ab ao')
			this.simplex.splice(2,1)
			return false
		}
		if (bcNorm.dotProduct(bo) < 0) {
			//console.log('bc bo')
			this.simplex.splice(0,1)
			return false
			}
		if (caNorm.dotProduct(co) < 0) {
			//console.log('ca co')
			this.simplex.splice(1,1)
			return false
			}
		
		//console.log('true')
		return true
	}
	
	closestSideToPoint(polygonPtList, point){
		this.minDistSqr = Number.POSITIVE_INFINITY
		let index1 = -1
		let index2 = -1 
		for (let i=0; i<polygonPtList.length; i++) {
			let j = (i+1 == polygonPtList.length ? 0 : i+1)
			let d = Geo.pointToLineDistSqr(point, polygonPtList[i], polygonPtList[j])
			if (d < this.minDistSqr) {
				this.minDistSqr = d
				index1 = i
				index2 = j
			}
			//return [polygonPtList[index1].copy(), polygonPtList[index2].copy()]
			
		}
		return [index1, index2]
	}
	
	findCollisionPoint() {
		let negVel = this.objOne.getVelocity().subtract(this.objTwo.getVelocity())
		negVel.scalarMult(-1)
		
		let oldPoint = null
		let dir = null
		let lineVec = null
		let nextPoint = this.supportMinkowskiDiff(this.verts1, this.verts2, negVel)
		let line = this.closestSideToPoint(this.simplex, nextPoint)
		
		//console.log('negvel', negVel)
		
		let i = 0
		while(true){
			//console.log('nextpoint', nextPoint)
			//console.log('line0', line[0])
			//console.log('line1', line[1])
			if (i>10) {break}
			
			if (nextPoint.equals(line[0]) || nextPoint.equals(line[1])) {
				this.velocityLineIntersection(negVel, line)
				break
			}
			
			if(nextPoint.doubleCross(line[0]).dotProduct(negVel) > 0){
				oldPoint = line[1]
				line[1] = nextPoint
				
			} else {
				oldPoint = line[0]
				line[0] = nextPoint
			}
			lineVec = line[0].subtract(line[1])
			dir = lineVec.doubleCross(oldPoint)
			dir.scalarMult(-1)
			nextPoint = this.supportMinkowskiDiff(this.verts1,this.verts2, dir)
			i++
		}
		
	}
	
	expandPolytope(){
		let orig = new Vector2D(0,0)
		let prevDistSqr = Number.POSITIVE_INFINITY
		let epsilon = 0.001
		let cLineInd = null
		let normVec = null
		//console.log('NEW')
		//console.log(this.simplex[0])
		//console.log(this.simplex[1])
		//console.log(this.simplex[2])
		let j=0
		while(true){
			if(j>10){
				//console.log('eep')
				this.MVCfound(cLineInd, normVec, this.minDistSqr)
				return 1
			}
			
			cLineInd = this.closestSideToPoint(this.simplex, orig)
			//console.log(cLineInd)
			//console.log(this.minDistSqr)
			if(this.minDistSqr <= 0) {throw 'on line'}
			normVec = this.simplex[cLineInd[0]].subtract(this.simplex[cLineInd[1]]).doubleCross(this.simplex[cLineInd[0]])
			
			
			if (Math.abs(prevDistSqr - this.minDistSqr) < epsilon) {
				let colPt = this.MVCfound(cLineInd, normVec, this.minDistSqr)
				//console.log(colPt)
				return 0
			} else {
				let newPoint = this.supportMinkowskiDiff(this.verts1, this.verts2, normVec)
				//console.log(newPoint)
				prevDistSqr = this.minDistSqr
				if (!(this.simplex[cLineInd[0]].equals(newPoint) || this.simplex[cLineInd[1]].equals(newPoint))){
					this.simplex.splice(cLineInd[1],0, newPoint)
				}
			}
			j++
		}
	}
	
	MVCfound(closestLineInd, normVec, sqrDistance){
		//console.log(mvc)
		//objOneCollSupp = this.supportFunc(this.verts1, normVec)
		//objTwoCollSupp = this.supportFunc(this.verts1, normVec.neg())
		
		let objOneColl = this.getSupportLineOrPoint(this.verts1, normVec)
		let objTwoColl = this.getSupportLineOrPoint(this.verts2, normVec.neg())
		let collisionPoint = null
		normVec.normalize()
		normVec.scalarMult(Math.sqrt(sqrDistance))
		
		if(objOneColl.length == 2){
			if(objTwoColl.length == 2) {
				//edge on edge collision
				collisionPoint = 'Edge on edge'
				console.log("edge")
				return 
			} else {
				collisionPoint = objTwoColl[0]
				
				this.objTwo.collisionPoint.setTo(objTwoColl[0])
				this.objOne.collisionPoint.setTo(collisionPoint.add(normVec))
				normVec.scalarMult(-1)
			}
		} else if (objTwoColl.length == 2) {
			collisionPoint = objOneColl[0]
			this.objOne.collisionPoint.setTo(objOneColl[0])
			this.objTwo.collisionPoint.setTo(collisionPoint.add(normVec.neg()))
			normVec.scalarMult(-1)
		} else {
			this.objOne.collisionPoint.setTo(objOneColl[0])
			this.objTwo.collisionPoint.setTo(objTwoColl[0])
			//point on point collision
			collisionPoint= 'point on point'
		}
		this.updateObjects(normVec, this.objOne.collisionPoint, this.objTwo.collisionPoint)
		return collisionPoint
	}
	
	computeImpulse(normVec, coeffRest, relVel, colPt1, colPt2) {
		let a = -(1+coeffRest)*(relVel.dotProduct(normVec))
		let b = (1/this.objOne.getMass() + 1/this.objTwo.getMass())*(normVec.dotProduct(normVec))
		let rp1 = this.objOne.getRPerp(colPt1)
		let c = Math.pow(rp1.dotProduct(normVec),2)/this.objOne.getMomentInertia()
		let rp2 = this.objTwo.getRPerp(colPt2)
		let d = Math.pow(rp2.dotProduct(normVec),2)/this.objTwo.getMomentInertia()
		return a/(b+c+d)
	}
	
	updateObjects(normVec, colPt1, colPt2){
		let vap1 = this.objOne.getVelAtPt(colPt1)
		let vap2 = this.objTwo.getVelAtPt(colPt2)
		let relVel = vap1.subtract(vap2)
		
		if (normVec.dotProduct(relVel)> 0){return}
		
		let impulse = this.computeImpulse(normVec, 0.2, relVel, colPt1, colPt2)
	
		this.updateObj(this.objOne, impulse, normVec, colPt1)
		this.updateObj(this.objTwo, -impulse, normVec, colPt2)
		
		return 
	}
	updateObj(obj, impulse, normVec, colPt) {
		let scalar = impulse/obj.getMass()
		let changeVel = normVec.copy()
		changeVel.scalarMult(scalar)
		obj.addVelVec(changeVel)
		
		let a = impulse/obj.getMomentInertia()
		let b = obj.getRPerp(colPt).dotProduct(normVec)
		obj.changeRotationalVel(a*b)
		
	}
	
	/* 
	
	*/
	supportMinkowskiDiff(polygon1, polygon2, directionVec) {
		let support1 = this.supportFunc(polygon1, directionVec)
		let support2 = this.supportFunc(polygon2, directionVec.neg())
		support1.translateVNeg(support2)
		
		return support1
	}
	
	supportMinkowskiDiff2(polygon1, polygon2, directionVec) {
		let support1 = polygon1.support(directionVec)
		let support2 = polygon2.support(directionVec.neg())
		support1.translateVNeg(support2)
		
		return support1
	}
	
	getSupportLineOrPoint(verts, dir) {
		let isLine = false
		let max = Number.NEGATIVE_INFINITY
		let dot=0
		let support1 = new Vector2D(0,0)
		let support2 = new Vector2D(0,0)
		for (let v of verts) {
			dot = v.dotProduct(dir)
			if(Math.abs(max-dot) < 0.000001){
				support2.setTo(v)
				isLine = true
			}
			else if(dot > max) { 
				max = dot
				support1.setTo(v)
				isLine = false
			}
		}
		if (isLine) {
			return [support1, support2]
		} else {
			return [support1]
		}
	}
	
	/*
		
	*/
	supportFunc(verts, directionVec) {
		let max = Number.NEGATIVE_INFINITY
		let dot=0
		let support = new Vector2D(0,0)
		
		//console.log(this.direction)
		//console.log(directionVec)
		
		for (let v of verts) {
			dot = v.dotProduct(directionVec)
			if(dot > max) { 
				max = dot
				support.setTo(v)
			} else if(dot < max) {
				
			}
		}
		return support
	}
}