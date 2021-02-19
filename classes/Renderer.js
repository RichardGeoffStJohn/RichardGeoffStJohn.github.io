class Renderer {
	constructor(_screen, _universe, _view) {
		this.screen = _screen
		this.universe = _universe
		this.view = _view
		//this.transformedVertices = []
		this.showBB = false
		this.showCH = false
		this.showCollPts = false
	}
	
	toggleBB(){
		this.showBB = !this.showBB
	}
	toggleCH() {
		this.showCH = !this.showCH
	}
	
	resetView(color) {
		this.view.fillStyle = color
		this.view.fillRect(0,0,this.screen.getCanvasWidth(),this.screen.getCanvasHeight())
	}
	
	renderHud(player) {
		let centreScreenX = Math.floor(this.screen.getOrigin().getX() + this.screen.sizeX()/2)
		let centreScreenY = Math.floor(this.screen.getOrigin().getY() + this.screen.sizeY()/2)
		let currPos = "Current Position: (" + centreScreenX + ", " + centreScreenY + ")"
		this.view.font = "15px Arial"
		this.view.fillStyle = "white"
		this.view.fillText(universe.totalCollisionCount, 15, this.screen.getCanvasHeight() - 30)
	}
	
	renderZones(zones){
		for (let zone of zones){
			this.renderBackgroundObjects(zone)
		}
		for (let zone of zones) {
			this.renderInteractiveObjects(zone)
		}
	}
	
	renderZoneLines() {
		let scrOrg = this.screen.getOrigin()
		let scrSizeX = this.screen.sizeX()
		let scrSizeY = this.screen.sizeY()
		let sectorSizeX = this.universe.getSectorSizeX()
		let sectorSizeY = this.universe.getSectorSizeY()
		let offsetX = scrOrg.getX()%sectorSizeX
		let offsetY = scrOrg.getY()%sectorSizeY
		offsetX = this.screenTransformLength(sectorSizeX-offsetX)
		offsetY = this.screenTransformLength(sectorSizeY-offsetY)
		
		this.view.strokeStyle = "white"
		while (offsetX<this.screen.getCanvasWidth()){
			this.view.beginPath()
			this.view.moveTo(offsetX,0)
			this.view.lineTo(offsetX, this.screen.getCanvasHeight())
			this.view.stroke()
			
			offsetX += this.screenTransformLength(sectorSizeX)
		}
		
		while (offsetY<this.screen.getCanvasHeight()){
			this.view.beginPath()
			this.view.moveTo(0, offsetY)
			this.view.lineTo(this.screen.getCanvasWidth(), offsetY)
			this.view.stroke()
			
			offsetY += this.screenTransformLength(sectorSizeY)
		}
	}
	
	renderZone(zone) {
		this.renderBackgroundObjects(zone)
		this.renderInteractiveObjects(zone)
	}
	
	renderBackgroundObjects(zone) {
		
		//debugPrint(JSON.stringify(zone))
		for(let star of this.universe.backgroundObjects[zone.i][zone.j]){
			let point = this.screenTransformPoint(star.getOrigin(), zone.wrapX, zone.wrapY)
			let grad = this.view.createRadialGradient(point.x, point.y, this.screenTransformLength(Math.random()), point.x, point.y, this.screenTransformLength(4))
			grad.addColorStop(0, 'white')
			grad.addColorStop(1, 'rgba(' + Math.floor(Math.random()*255) + ',0,' + Math.floor(Math.random()*255) + ',0)')
			this.view.fillStyle = grad
			//this.view.fillStyle = "white"
			point = this.screenTransformPoint(this.addPoint(star.getOrigin(), {x:-7, y:-7}), zone.wrapX, zone.wrapY)
			length = this.screenTransformLength(15)
			this.view.fillRect(point.x, point.y, length, length)
		}
		
	}
	
	renderInteractiveObjects(zone) {
		//this.transformedVertices.length = 0
		for(let obj of this.universe.interactiveObjects[zone.i][zone.j]) {
			let fillStyle, lineCol, lineWidth
			if (obj.getStyle() === null) {
				fillStyle = "grey"
				lineCol = "white"
				lineWidth = 3
			}else {
				let style = obj.getStyle()
				console.log(style)
				fillStyle = style.fillStyle
				lineCol = style.lineCol
				lineWidth = style.lineWidth
			}
			this.view.fillStyle = fillStyle
			
			//obj.resetTransformedVertices()
			//obj.rotate()
			//obj.translateAllVertices(obj.getOrigin(), obj.transformedVertices)
			//obj.setTransformedVerticies()
			//obj.setTransformedVertices()
			
			let transVerts = obj.getTransformedVertices()
			
			for(let vertex of transVerts) {
				this.screenTransformVec(vertex, zone.wrapX, zone.wrapY)
			}
			this.view.beginPath()
			this.view.moveTo(transVerts[0].getX(), transVerts[0].getY())
			for(let i=1, n=transVerts.length; i<n; i++) {
				this.view.lineTo(transVerts[i].getX(), transVerts[i].getY())
			}
			this.view.closePath()
			this.view.fill()
			
			/*
			if(this.showCollPts && obj.isColliding()) {
				let pt = this.screenTransformPoint(obj.collisionPoint)
				this.view.strokeStyle = 'white'
				this.view.beginPath()
				this.view.arc(pt.x, pt.y, 10,0, 2*Math.PI)
				this.view.stroke()
			}
			*/
			if(this.showBB){
				let vertices = obj.getBBVertices()
				this.screenTransformArrIP(vertices, zone.wrapX, zone.wrapY)
				
				this.view.beginPath()
				this.view.moveTo(vertices[0].getX(), vertices[0].getY())
				for (let i=1; i<vertices.length; i++){
					this.view.lineTo(vertices[i].getX(),vertices[i].getY())
				}
				this.view.closePath()
				
				this.view.strokeStyle = obj.getBBCol()
				this.view.lineWidth = 2
				this.view.stroke()
			}
			if (this.showCH) {

				this.drawPolygon(obj.getTransVertsCH(), zone)
			}
		}
	}
	
	drawPolygon(vertexArr, zone){
		this.screenTransformArrIP(vertexArr, zone.wrapX, zone.wrapY)
		this.view.beginPath()
		this.view.moveTo(vertexArr[0].getX(), vertexArr[0].getY())
		for (let i=1; i<vertexArr.length; i++){
			this.view.lineTo(vertexArr[i].getX(),vertexArr[i].getY())
		}
		this.view.closePath()
		this.view.strokeStyle = 'red'
		this.view.lineWidth = 2
		this.view.stroke()
	}
	
	addPoint(point_1, point_2) {
		return {x:(point_1.x + point_2.x), y:(point_1.y + point_2.y)}
	}
	
	screenTransformPoint(point, wrapX, wrapY) {
		let scrX  = this.screen.getOrigin().x
		let scrY = this.screen.getOrigin().y
		let zoom = this.screen.getZoom()
		//debugPrint("before x: " + point.x)
		//debugPrint("before y: " + point.y)
		let x = point.x
		let y = point.y
		
		if(wrapX == 1) {
			x += universe.getSize()
		} 
		else if (wrapX == -1){
			x -= universe.getSize()
		}
		
		if(wrapY) {
			y += universe.getSize()
		}
		else if (wrapY == -1) {
			y -= universe.getSize()
		}
		x = (x - scrX)/zoom
		y = (y - scrY)/zoom
		//debugPrint("x: " + x)
		//debugPrint("y: " + y)
		return new Vector2D(x,y)
	}
	
	screenTransformVec(vec, wrapX, wrapY) {
		let scrX  = this.screen.getOrigin().x
		let scrY = this.screen.getOrigin().y
		let zoom = this.screen.getZoom()
		//debugPrint("before x: " + point.x)
		//debugPrint("before y: " + point.y)
		
		if(wrapX) {
			vec.x += universe.getSize()
		} 
		else if (wrapX == -1){
			x -= universe.getSize()
		}
		
		if(wrapY) {
			vec.y += universe.getSize()
		}
		else if (wrapY == -1) {
			y -= universe.getSize()
		}
		vec.x = (vec.x - scrX)/zoom
		vec.y = (vec.y - scrY)/zoom
		//debugPrint("x: " + x)
		//debugPrint("y: " + y)
	}
	
	screenTransformArrIP(arr, wrapX, wrapY){
		for (let i=0; i<arr.length; i++){
			this.screenTransformVec(arr[i], wrapX, wrapY)
		}
	}
	
	screenTransformLength(length) {
		return length/this.screen.getZoom()
	}
	
}
