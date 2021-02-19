class BackgroundObject {
	
	//origin is point of form {x: xCoord, y: yCoord}
	constructor(_id, _type, _origin) {
		this.id = _id
		this.type = _type
		this.origin = _origin
	}
	
	getId() 	{return this.id}
	getType() 	{return this.type}
	getOrigin() {return this.origin}
	

}