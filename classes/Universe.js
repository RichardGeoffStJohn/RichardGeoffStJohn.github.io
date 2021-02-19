class Universe {
	constructor(size, numSectorsX, numSectorsY) {
		this.size = size
		this.numSectorsX = numSectorsX
		this.numSectorsY = numSectorsY
		this.sectorSizeX = this.size/this.numSectorsX
		this.sectorSizeY = this.size/this.numSectorsY
		
		this.backgroundObjects = []
		this.interactiveObjects = []
		this.tempObjs = [] 
		
		
		this.setAllObjectArrays()
		this.totalCollisionCount = 0
		this.player = null
		this.spareVec = new Vector2D(0,0)
		
	}
	
	mod(num1,num2){
		return ((num1 % num2) + num2 ) % num2
	}
	
	getSize() {
		return this.size
	}
	
	getNumSectorsX() {
		return this.numSectorsX
	}
	
	getNumSectorsY() {
		return this.numSectorsY
	}
	
	getSectorSizeX(){
		return this.sectorSizeX
	}
	getSectorSizeY(){
		return this.sectorSizeY
	}
	
	setZoneIndexOne(obj) {
		return Math.floor(Math.floor(obj.getOrigin().getX())/this.size * this.numSectorsX)
	}
	setZoneIndexTwo(obj) {
		return Math.floor(Math.floor(obj.getOrigin().getY())/this.size * this.numSectorsY)
	}
	
	setPlayer(player){
		this.player = player
	}
	
	/*
		stars is an array of Star objects
	*/
	setBackgroundStars(stars) {
		for(let i=0; i<stars.length; i++) {
			let star = stars[i]
			let index_1 = Math.floor(star.getOrigin().x/this.size * this.numSectorsX)
			let index_2 = Math.floor(star.getOrigin().y/this.size * this.numSectorsY)
			universe.backgroundObjects[index_1][index_2].push(star)
		}
	}
	
	setInteractiveObjects(...args) {
		for(let i=0; i<args.length; i++) {
			for(let j=0, n=args[i].length; j<n; j++) {
				let obj = args[i][j]
				let index_1 = this.setZoneIndexOne(obj)
				let index_2 = this.setZoneIndexTwo(obj)
				universe.interactiveObjects[index_1][index_2].push(obj)
				obj.setZone(index_1, index_2)
				obj.addObserver(this)
				//console.log(obj)
			}
		}
	}
	
	
	
	calcCollisions(collisionDetector) {
		for (let i=0, n1=this.interactiveObjects.length; i<n1; i++) {
			for (let j=0, n2=this.interactiveObjects[i].length; j<n2; j++) {
				
				/*
				collisionDetector.findCollisions(this.interactiveObjects[i][j].concat( 
					this.interactiveObjects[this.mod(i-1,this.numSectorsX)][this.mod(j-1, this.numSectorsY)],
					this.interactiveObjects[i][this.mod(j-1, this.numSectorsY)],
					this.interactiveObjects[this.mod(i+1,this.numSectorsX)][this.mod(j-1, this.numSectorsY)],
					this.interactiveObjects[this.mod(i-1,this.numSectorsX)][j],
					this.interactiveObjects[this.mod(i+1,this.numSectorsX)][j],
					this.interactiveObjects[this.mod(i-1,this.numSectorsX)][this.mod(j+1, this.numSectorsY)],
					this.interactiveObjects[i][this.mod(j+1, this.numSectorsY)],
					this.interactiveObjects[this.mod(i+1,this.numSectorsX)][this.mod(j+1, this.numSectorsY)]));
				*/
				//collisionDetector.findCollisions(this.interactiveObjects[i][j])
				
				if (this.interactiveObjects[i][j].length === 0) {continue}
				
				/*
				if (i === 0)  {
					console.log(this.mod(i-1,this.numSectorsX))
				}	
				if (j === 0)	 {
					console.log(this.mod(j-1, this.numSectorsY))
				}
				*/
				
				
				let arrs = []
				arrs.push(this.interactiveObjects[this.mod(i-1,this.numSectorsX)][this.mod(j-1, this.numSectorsY)])
				arrs.push(this.interactiveObjects[i][this.mod(j-1, this.numSectorsY)])
				arrs.push(this.interactiveObjects[this.mod(i+1,this.numSectorsX)][this.mod(j-1, this.numSectorsY)])
				arrs.push(this.interactiveObjects[this.mod(i-1,this.numSectorsX)][j])
				//arrs.push(this.interactiveObjects[i][j])
				arrs.push(this.interactiveObjects[this.mod(i+1,this.numSectorsX)][j])
				arrs.push(this.interactiveObjects[this.mod(i-1,this.numSectorsX)][this.mod(j+1, this.numSectorsY)])
				arrs.push(this.interactiveObjects[i][this.mod(j+1, this.numSectorsY)])
				arrs.push(this.interactiveObjects[this.mod(i+1,this.numSectorsX)][this.mod(j+1, this.numSectorsY)])
				
				//console.log(this.mod(i-1,this.numSectorsX))
			
				this.totalCollisionCount += collisionDetector.findCollisions(this.interactiveObjects[i][j], arrs)
					/*this.interactiveObjects[this.mod(i-1,this.numSectorsX)][this.mod(j-1, this.numSectorsY)],
					this.interactiveObjects[i][this.mod(j-1, this.numSectorsY)],
					this.interactiveObjects[this.mod(i+1,this.numSectorsX)][this.mod(j-1, this.numSectorsY)],
					this.interactiveObjects[this.mod(i-1,this.numSectorsX)][j],
					this.interactiveObjects[this.mod(i+1,this.numSectorsX)][j],
					this.interactiveObjects[this.mod(i-1,this.numSectorsX)][this.mod(j+1, this.numSectorsY)],
					this.interactiveObjects[i][this.mod(j+1, this.numSectorsY)],
					this.interactiveObjects[this.mod(i+1,this.numSectorsX)][this.mod(j+1, this.numSectorsY)]);				*
					*/
					
				this.setFinishedColCalc(this.interactiveObjects[i][j])
			}
		}
	}
	setFinishedColCalc(objArr) {
		for (let obj of objArr){
			obj.setFinishedColCalc()
		}
	}
	
	calcZoneCollisions(collisionDetector, zone) {
		collisionDetector.findCollisions(this.interactiveObjects[zone.i][zone.j])
	}
	
	update(object) {
		let objOrigin = object.getOrigin()
		let objZone = object.getZone()
			
		//handle objects moving out of universe bounds (wrap back to other side)
		this.spareVec.zero()
		
		if(objOrigin.x < 0) {
			this.spareVec.translate(this.size, 0)
		}
		else if(objOrigin.x >= this.size) {
			this.spareVec.translate(-this.size, 0)
		}
		
		if(objOrigin.y < 0) {
			this.spareVec.translate(0, this.size)
		}
		else if (objOrigin.y >= this.size) {
			this.spareVec.translate(0, -this.size)
		}
		object.moveOrigin(this.spareVec)
		
		let i = this.setZoneIndexOne(object)
		let j = this.setZoneIndexTwo(object)
		if((i !== objZone.i) || (j !== objZone.j)) {
			this.moveSector(object, objZone.i, objZone.j, i, j)
			object.setZone(i,j)
		}
	}
	
	/*
		PRIVATE
	*/
	
	moveSector(object, oldZone_i, oldZone_j, newZone_i, newZone_j) {
		if(this.removeObject(this.interactiveObjects[oldZone_i][oldZone_j], object)) {
			this.interactiveObjects[newZone_i][newZone_j].push(object)
		} else {
			throw "Object not found in moveSector"
		}
	}
	
	removeObject(arr, object) {
		for(let i=0, n=arr.length; i<n; i++) {
			if(arr[i] === object) {
				arr.splice(i,1)
				return true
			}
		}
		return false
	}
	
	setAllObjectArrays() {
		for(let i=0; i<this.numSectorsX; i++) {
			this.backgroundObjects.push([])
			this.interactiveObjects.push([])
			for (let j=0; j<this.numSectorsY; j++) {
				this.backgroundObjects[i].push([])
				this.interactiveObjects[i].push([])
			}
		}
	}
}