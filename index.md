<!DOCTYPE html>
<!--



-->
<html>
   <head>
     <title>2406 A3</title>    
      <style> 
         body {
            background: #dddddd;
         }	
		 
		 /*element selectors: */
		 canvas {
		    margin: 20px;
			/*important here for padding to be 0 for mouse calculations */
            padding: 0px; 
		 }
		 
		 /* class selectors: */
		 .canvas {            
            background: #ffffff;
            border: thin inset #aaaaaa;
         }

         /*id selectors: */		 
         #curlingCloseUp {
         }
		 #curlingFullCanvas {
		 }
		  
 
      </style>
   </head>

  <body>
    <div>
    <canvas id='mainView' class='canvas' width='1300' height='850'>
      Canvas not supported
    </canvas> 
	</div>
	<script src="/classes/Geo.js"></script>
	<script src="/classes/Vector2D.js"></script>
	<script src="/classes/InteractiveObject.js"></script>
	<script src="/classes/PlayerShip.js"></script>
	<script src="/classes/Polygon.js"></script>
	<script src="/classes/ConvexPolygon.js"></script>
	<script src="/classes/VectorPool.js"></script>
	<script src="/classes/ObjectPool.js"></script>
	<script src="/classes/BroadCollisionDetector.js"></script>
	<script src="/classes/CollisionList.js"></script>
	<script src="/classes/Collision.js"></script>
	<script src="/classes/AsteroidFactory.js"></script>
	<script src="/classes/BackgroundObject.js"></script>
	<script src="/classes/Screen.js"></script>
	<script src="/classes/Universe.js"></script>
	<script src="/classes/Renderer.js"></script>
    <script src='/spaceClient.js'></script>
	
  </body>
</html>
