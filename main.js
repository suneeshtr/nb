$(function() {
	var canvas = $("#c");
	var canvasHeight;
	var canvasWidth;
	var ctx;
	var dt = 0.1;
	
	var pointCollection;
	
	function init() {
		updateCanvasDimensions();
		
		var g = [new Point(202, 78, 0.0, 9, "#ed9d33"), new Point(267, 72, 0.0, 8, "#4f7af2"), new Point(290, 68, 0.0, 7, "#4f7af2"), new Point(214, 59, 0.0, 9, "#ef9a1e"), new Point(265, 39, 0.0, 9, "#4976f3"),   new Point(268, 55, 0.0, 9, "#2a56ea"),   new Point(235, 62, 0.0, 9, "#2e5def"),new Point(288, 52, 0.0, 8, "#2e5def"), new Point(208, 41, 0.0, 8, "#f9b125"),  new Point(34, 77, 0.0, 8, "#2a59f0"), new Point(36, 60, 0.0, 8, "#2a59f0"), new Point(36, 42, 0.0, 8, "#2a59f0"), new Point(46, 45, 0.0, 7, "#2a59f0"), new Point(36, 88, 0.0, 6, "#2a59f0"), new Point(71, 85, 0.0, 8, "#2a59f0"),new Point(61, 70, 0.0, 8, "#2a59f0"),new Point(56, 56, 0.0, 8, "#2a59f0"),new Point(74, 70, 0.0, 7, "#2a59f0"),new Point(72, 55, 0.0, 7, "#2a59f0"),new Point(72, 40, 0.0, 7, "#2a59f0"), new Point(180, 81, 0.0, 8, "#eb9c31"), new Point(146, 65, 0.0, 8, "#c41731"), new Point(145, 49, 0.0, 8, "#d82038"), new Point(246, 34, 0.0, 9, "#5f8af8"),new Point(302, 76, 0.0, 7, "#5f8af8"),new Point(315, 69, 0.0, 7, "#5f8af8"), new Point(169, 69, 0.0, 8, "#efa11e"), new Point(315, 35, 0.0, 8, "#0b991a"), new Point(316, 52, 0.0, 8, "#0b991a"),  new Point(117, 83, 0.0, 8, "#cf4055"), new Point(137, 80, 0.0, 8, "#cd4359"),  new Point(233, 46, 0.0, 8, "#4a7bf9"),   new Point(194, 32, 0.0, 6, "#fac652"), new Point(97, 56, 0.0, 6, "#ee5257"), new Point(105, 75, 0.0, 6, "#cf2a3f"), new Point(166, 55, 0.0, 6, "#f7b326"), new Point(178, 34, 0.0, 6, "#facb5e"), new Point(100, 65, 0.0, 6, "#e02e3d"), new Point(288, 35, 0.0, 8, "#f16d6f"),  new Point(123, 32, 0.0, 6, "#f0696c"),  new Point(108, 36, 0.0, 6, "#f4716e"), new Point(169, 43, 0.0, 6, "#f8c247"), new Point(137, 37, 0.0, 6, "#e74653"),  new Point(101, 46, 0.0, 5, "#ef5c5c"), new Point(239, 76, 0.0, 7, "#2552ea"), ];
		
		gLength = g.length;
		for (var i = 0; i < gLength; i++) {
			g[i].curPos.x = (canvasWidth/2 - 180) + g[i].curPos.x;
			g[i].curPos.y = (canvasHeight/2 - 65) + g[i].curPos.y;
			
			g[i].originalPos.x = (canvasWidth/2 - 180) + g[i].originalPos.x;
			g[i].originalPos.y = (canvasHeight/2 - 65) + g[i].originalPos.y;
		};
		
		pointCollection = new PointCollection();
		pointCollection.points = g;
		
		initEventListeners();
		timeout();
	};
	
	function initEventListeners() {
		$(window).bind('resize', updateCanvasDimensions).bind('mousemove', onMove);
		
		canvas.get(0).ontouchmove = function(e) {
			e.preventDefault();
			onTouchMove(e);
		};
		
		canvas.get(0).ontouchstart = function(e) {
			e.preventDefault();
		};
	};
	
	function updateCanvasDimensions() {
		canvas.attr({height: $(window).height(), width: $(window).width()});
		canvasWidth = canvas.width();
		canvasHeight = canvas.height();

		draw();
	};
	
	function onMove(e) {
		if (pointCollection)
			pointCollection.mousePos.set(e.pageX, e.pageY);
	};
	
	function onTouchMove(e) {
		if (pointCollection)
			pointCollection.mousePos.set(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
	};
	
	function timeout() {
		draw();
		update();
		
		setTimeout(function() { timeout() }, 30);
	};
	
	function draw() {
		var tmpCanvas = canvas.get(0);

		if (tmpCanvas.getContext == null) {
			return; 
		};
		
		ctx = tmpCanvas.getContext('2d');
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		
		if (pointCollection)
			pointCollection.draw();
	};
	
	function update() {		
		if (pointCollection)
			pointCollection.update();
	};
	
	function Vector(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
 
		this.addX = function(x) {
			this.x += x;
		};
		
		this.addY = function(y) {
			this.y += y;
		};
		
		this.addZ = function(z) {
			this.z += z;
		};
 
		this.set = function(x, y, z) {
			this.x = x; 
			this.y = y;
			this.z = z;
		};
	};
	
	function PointCollection() {
		this.mousePos = new Vector(0, 0);
		this.points = new Array();
		
		this.newPoint = function(x, y, z) {
			var point = new Point(x, y, z);
			this.points.push(point);
			return point;
		};
		
		this.update = function() {		
			var pointsLength = this.points.length;
			
			for (var i = 0; i < pointsLength; i++) {
				var point = this.points[i];
				
				if (point == null)
					continue;
				
				var dx = this.mousePos.x - point.curPos.x;
				var dy = this.mousePos.y - point.curPos.y;
				var dd = (dx * dx) + (dy * dy);
				var d = Math.sqrt(dd);
				
				if (d < 150) {
					point.targetPos.x = (this.mousePos.x < point.curPos.x) ? point.curPos.x - dx : point.curPos.x - dx;
					point.targetPos.y = (this.mousePos.y < point.curPos.y) ? point.curPos.y - dy : point.curPos.y - dy;
				} else {
					point.targetPos.x = point.originalPos.x;
					point.targetPos.y = point.originalPos.y;
				};
				
				point.update();
			};
		};
		
		this.draw = function() {
			var pointsLength = this.points.length;
			for (var i = 0; i < pointsLength; i++) {
				var point = this.points[i];
				
				if (point == null)
					continue;

				point.draw();
			};
		};
	};
	
	function Point(x, y, z, size, colour) {
		this.colour = colour;
		this.curPos = new Vector(x, y, z);
		this.friction = 0.8;
		this.originalPos = new Vector(x, y, z);
		this.radius = size;
		this.size = size;
		this.springStrength = 0.1;
		this.targetPos = new Vector(x, y, z);
		this.velocity = new Vector(0.0, 0.0, 0.0);
		
		this.update = function() {
			var dx = this.targetPos.x - this.curPos.x;
			var ax = dx * this.springStrength;
			this.velocity.x += ax;
			this.velocity.x *= this.friction;
			this.curPos.x += this.velocity.x;
			
			var dy = this.targetPos.y - this.curPos.y;
			var ay = dy * this.springStrength;
			this.velocity.y += ay;
			this.velocity.y *= this.friction;
			this.curPos.y += this.velocity.y;
			
			var dox = this.originalPos.x - this.curPos.x;
			var doy = this.originalPos.y - this.curPos.y;
			var dd = (dox * dox) + (doy * doy);
			var d = Math.sqrt(dd);
			
			this.targetPos.z = d/100 + 1;
			var dz = this.targetPos.z - this.curPos.z;
			var az = dz * this.springStrength;
			this.velocity.z += az;
			this.velocity.z *= this.friction;
			this.curPos.z += this.velocity.z;
			
			this.radius = this.size*this.curPos.z;
			if (this.radius < 1) this.radius = 1;
		};
		
		this.draw = function() {
			ctx.fillStyle = this.colour;
			ctx.beginPath();
			ctx.arc(this.curPos.x, this.curPos.y, this.radius, 0, Math.PI*2, true);
			ctx.fill();
		};
	};
	
	init();
});
