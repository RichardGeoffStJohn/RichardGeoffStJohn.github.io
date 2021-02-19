class Geo {
	
	static pointToLineDistSqr(point, lpoint1, lpoint2){
		return (Math.pow((lpoint1.getY()-lpoint2.getY())*point.getX()+(lpoint2.getX()-lpoint1.getX())*point.getY()+(lpoint1.getX()*lpoint2.getY()-lpoint2.getX()*lpoint1.getY()), 2))/(Math.pow(lpoint2.getX()-lpoint1.getX(),2) + Math.pow(lpoint2.getY()-lpoint1.getY(), 2))
	}
	
	static pointToLineDistSqr2(point, linePoint1, linePoint2) {
		let lineVec = linePoint1.subtract(linePoint2)
		let pointVec = point.subtract(linePoint2)
		
		return pointVec.lengthSqr() - this.projectionScaleSqr(pointVec, lineVec)
	}
	
	//the square of the projection scale of v1 onto v2
	static projectionScaleSqr(v1, v2) {
		return Math.pow(v1.dotProduct(v2), 2)/v2.lengthSqr()
	}
	
	static vectorLineIntersection(v, line) {
		let u = line[0]
		let w = line[1].subtract(line[0])
		
		let r = (u.getY()-u.getX()*v.getY()+v.getX()*v.getY())/(w.getX()*v.getX()-w.getY())  // paramater for w
		let t = null  // paramater for v
		
		
	}
}