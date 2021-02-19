class BroadCollisionDetector {
	constructor(universeSize) {
		this.universeSize = universeSize

		this.potentialCollisions = []
		this.collisions = new CollisionList()
	}
	
	findCollisions(mainArr, objArr) {
		this.potentialCollisions = []
		this.collisions.resetDetector()
		//this.axisSweepX(objArr)
		this.addAllPairs(mainArr, objArr)
		this.addBBIntersectionPairs()
		return this.collisions.resolveCollisions()
		
	}
	
	addAllPairs(mainArr, objArrays) {
		//first passed paramater must be the list from center zone
		for (let i=0; i<mainArr.length; i++){
			for (let j=i+1; j<mainArr.length; j++){
				this.potentialCollisions.push({objOne:mainArr[i], objTwo:mainArr[j]})
			}
		}
		
		for (let i=0; i<mainArr.length; i++){
			for (let j=0; j<objArrays.length; j++){
				for (let k=0; k<objArrays[j].length; k++){
					//console.log(objArrays[k])
					//if (mainArr[i] != objArrays[j][k]){
					
						this.potentialCollisions.push({objOne:mainArr[i], objTwo:objArrays[j][k]})
					//}
					//if(mainArr[i].getId() === InteractiveObjID.player){
					//	console.log("player")
					//}
				}
			}
		}
		//console.log(this.potentialCollisions)
	}
	
	//
	axisSweepX(objArr) {
		if(objArr.length < 2) {return}
		objArr.sort(function(a,b) {
			return a.getOrigin().getX() - b.getOrigin().getX()
		})
		//console.log(objArr)
		for(let i=0, n=objArr.length; i<n; i++) {
			//this.potentialCollisions.push(objArr[i])
			let j=i+1
			if(j == n) {break}
			
			while(objArr[i].getOrigin().getX()+objArr[i].getBBLengthX() > objArr[j].getOrigin().getX()) {
				this.potentialCollisions.push({objOne:objArr[i], objTwo:objArr[j]})
				j++
				if (j === n) {break}
			}
			//console.log(this.potentialCollisions)
			
		}
		
	}
	
	addBBIntersectionPairs() {
		for(let i = 0; i < this.potentialCollisions.length; i++){
			if(this.BBIntersect(this.potentialCollisions[i].objOne, this.potentialCollisions[i].objTwo)) {
				this.collisions.addCollision(this.potentialCollisions[i].objOne, this.potentialCollisions[i].objTwo)
			}
		}
		//this.potentialCollisions.forEach(function(coll) {
		//	if(this.BBIntersect(coll.objOne, coll.objTwo)) {
		//		this.collisions.addCollision(coll.objOne, coll.objTwo)
		//	}
		//}) 
	}
	
	BBIntersect(obj1, obj2) {
		//console.log("in BBIntersect")
		
		// This prevents 4 or more objects colliding simultaneously, use another method if you want to allow that case
		
		/*
		if (obj1.isColliding() && obj2.isColliding) {
			//if(obj1.isCollidingWith(obj2)){
				return false
			//}
		}
		*/
		if (obj1.isFinishedColCalc() || obj2.isFinishedColCalc()){
			return false
		}
		
		
		let px = obj2.getOrigin().getX() - obj1.getOrigin().getX() - obj1.getBBLengthX()
		let py = obj2.getOrigin().getY() - obj1.getOrigin().getY() - obj1.getBBLengthY()
		let qx = obj1.getOrigin().getX() - obj2.getOrigin().getX() - obj2.getBBLengthX()
		let qy = obj1.getOrigin().getY() - obj2.getOrigin().getY() - obj2.getBBLengthY()
		
		//if(obj1.getId() === InteractiveObjID.player){
		//	console.log("player before")
		//}

		if(px > 0 || py > 0) { return false}
		if(qx > 0 || qy > 0) { return false}
		
		//if(obj1.getId() === InteractiveObjID.player || obj2.getId() === InteractiveObjID.player){
		//	console.log("player after")
		//}
		
		//console.log("intersect: true")
		
		
		
		obj1.intersecting = true
		obj2.intersecting = true
		
		return true
	}

}