var width = window.innerWidth; 
var height = window.innerHeight;

var renderer, scene, camera;
var planet;		// Need kolm variable suht useless siin
var star;
var moon;

var focusedObject;	// What object to follow when <SPACE> is pressed

var hoverables;		// useless vist

var distanceScaleMode = "lin";
var orbitScale = 1;	// How many times smaller are orbits compared to their real value.
var speedScale = 100000;	// How much faster does time move.


var raycaster = new THREE.Raycaster();	// Mouseover stuff.
var mouse = new THREE.Vector2(0.0);

var lightPosition;		// Where's the light-source

var mainPivot;			// All stellar and non-stellar bodies are it's children, sort of the central point

var vertexShader;				// Shaders
var planetFragmentShader;		
var starFragmentShader;
var rockybodyFragmentShader;



function onLoad() { 
	var canvasContainer = document.getElementById('canvasContainer'); 
	vertexShader = document.getElementById('vertexShader').textContent;
	planetFragmentShader = document.getElementById('earthlikeFragmentShader').textContent;
	
	starFragmentShader = document.getElementById('starFragmentShader').textContent;
	
	rockybodyFragmentShader = document.getElementById('rockyFragmentShader').textContent;
	
	renderer = new THREE.WebGLRenderer(); 
	renderer.setSize(width, height);
	canvasContainer.appendChild(renderer.domElement);
	
	scene = new THREE.Scene();
	scene2 = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000000000 );
	//camera2 = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, -1000000000, 1000000000); //Mitte eemaldada hetkel, see kaugete planeetide billboardide kuvamise testiks hetkel (tho praegu ei tööta väga)
	camera.position.set(10,30,1000);
	camera.up = new THREE.Vector3(0,1,0);
	camera.lookAt(new THREE.Vector3(0,0,0));
	
	/*camera2.position.set(10,30,1000);
	camera2.up = new THREE.Vector3(0,1,0);
	camera2.lookAt(new THREE.Vector3(0,0,0));*/
	scene.add(camera);
	//scene.add(camera2);
	
	lightPosition = new THREE.Vector3(0, 0, 0);
	mainPivot = new THREE.Object3D();
	mainPivot.position.set(0.0, 0.0, 0.0);
	scene.add(mainPivot);
	
	/*
	 * This part of the code is temporary, just used to create Sol for now
	 */
	 
	 
	 /* TODO : siit peaks sellest distanceMultiplier-iga korrutamisest lahti saama, mingi add???Body funktsioonis tegema korrutamise tegelt.
	 Seal peab vaatama tho et igalpool oleks läbi korrutatud ikka (st et userdatadesse ja igale poole saaks juba distanceMultiplier-ga läbi korrutatud kaugus) */
	star = addStar(mainPivot, 1, 0.0, 0, 0, 400);
	mercury = addRockyBody(mainPivot, 0.1, 57910000 * distanceMultiplier, getOrbitalPeriod(solarMass, 57910000), toRad(173), 80);
	venus = addRockyBody(mainPivot, 0.815, 108200000 * distanceMultiplier, getOrbitalPeriod(solarMass, 108200000), toRad(173), 80);
	earth = addPlanet(mainPivot, 1, 150000000 * distanceMultiplier, getOrbitalPeriod(solarMass, 150000000), toRad(123), 80);
	moon = addRockyBody(earth, 0.3, Math.max(365000 * distanceMultiplier, 1.0), getOrbitalPeriod(earthMass, 365000), toRad(33), 30);
	mars = addRockyBody(mainPivot, 0.53, 227900000 * distanceMultiplier, getOrbitalPeriod(solarMass, 227900000), toRad(123), 80);
	phobos = addRockyBody(mars, 0.07, Math.max(6000 * distanceMultiplier, 0.7), getOrbitalPeriod(0.107 * earthMass, 6000), toRad(22), 80);
	deimos = addRockyBody(mars, 0.02, Math.max(23460 * distanceMultiplier, 1.0), getOrbitalPeriod(0.107 * earthMass, 23460), toRad(112), 80);
	jupiter = addRockyBody(mainPivot, 11.5, 778500000 * distanceMultiplier, getOrbitalPeriod(solarMass, 778500000), toRad(33), 80);
	saturn = addRockyBody(mainPivot, 9.6, 1429000000 * distanceMultiplier, getOrbitalPeriod(solarMass, 1429000000), toRad(13), 80);
	ur_anus = addRockyBody(mainPivot, 4.1, 2871000000 * distanceMultiplier, getOrbitalPeriod(solarMass, 2871000000), toRad(234), 80);
	neptune = addRockyBody(mainPivot, 4.0, 4498000000 * distanceMultiplier, getOrbitalPeriod(solarMass, 4498000000), toRad(234), 80);
	
	focusedObject = mainPivot;
	
	window.addEventListener( 'mousemove', onMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );
	
	window.addEventListener('keydown', function(event) {
		if (event.keyCode == 32) { //<SPACE>
			if (camera.parent != focusedObject.parent){
				focusedObject.parent.add(camera);
				camera.lookAt(focusedObject.worldPosition);
				// TODO : Make the camera properly focus on the object
			} else {
				scene.add(camera);
			}
		} else if (event.keyCode == 65) { //A
			orbitScale /= 2;
			changeOrbitScale();
		} else if (event.keyCode == 68) { //D
			orbitScale *= 2;
			changeOrbitScale();
		} else if (event.keyCode == 81) { //A
			speedScale /= 10;
		} else if (event.keyCode == 69) { //D
			speedScale *= 10;
		}
	}, false);
	
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	renderer.autoClear = false;
	
	draw();
}


/**
 * Changes the orbit scales
 */
 
//TODO: väiksed orbiidid võivad isegi mingi 1/2 suuruse korral juba liiga väikseks minna (st kaks keha satuvad üksteise sisse)
//praegu ei teagi kuidas seda normaalne parandada oleks
function changeOrbitScale(){
	scene.traverse(function(object) {
		if (object.name == "OrbitLine") {
			var scale = getScaledDistance(0.5);
			object.scale.set(scale*2, scale*2, scale*2);
		} else if (object.name == "OrbitingBodyPivot") {
			var dist = object.UserData['baseOrbit'];
			object.position.set(getScaledDistance(dist), 0, 0);
		}
	});
}

// TODO: peab vist muutma seda kuidas orbiteerimine/pöörlemine töötab, sest hetkel speedScale muutusega muutub asukoht ka :D
// Also, rotatsioon on mingi staatilise kiirusega hetkel

function draw() {
	requestAnimationFrame(draw);
	
	raycaster.setFromCamera( mouse, camera );
	
	scene.traverse(function(object) {
		if (object.name == "NonStellar"){
			object.material.uniforms.lightPosition.value = new THREE.Vector3().copy(lightPosition).applyMatrix4(camera.matrixWorldInverse);
			var data = object.UserData;
			object.rotation.set(0, toRad((millis() / data['rotationalSpeed']) % 360), 0);
			var intersects = raycaster.intersectObject( object, true);
			if (intersects.length>0){
				$("#body-class").html(data['type']);
				$("#body-mass").html('Mass: ' + data['mass'] + ' Earth Masses');
				$("#body-radius").html('Radius: ' + data['radius'] + ' Earth Radii');
				focusedObject = object;
			}
		} else if (object.name == "Star"){
			object.material.uniforms.starAnimation.value = Math.cos(toRad((millis() / 50) % 720));
			object.material.uniforms.starAnimation2.value = Math.sin(toRad((millis() / 50) % 720));
			
			var data = object.UserData;
			
			object.rotation.set(0, toRad((millis() / data['rotationalSpeed']) % 360), 0);
			var intersects = raycaster.intersectObject( object, true);
			if (intersects.length>0){
				$("#body-class").html(data['type']);
				$("#body-mass").html('Mass: ' + data['mass'] + ' Solar Masses');
				$("#body-radius").html('Radius: ' + data['radius'] + ' Solar Radii');
				focusedObject = object;
			}
		} else if (object.name == "Orbit"){
			var data = object.UserData;
			if (data['speed'] > 0){
				object.rotation.set(0, data['baseRotation'] + toRad((millis() / (data['speed']  / speedScale)) % 360), 0);
			}
		}
	});
	
	/*camera2.position.set(camera.position.x, camera.position.y, camera.position.z);
	camera2.rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z);*/
	
	renderer.clear();
	renderer.render(scene, camera);
	//renderer.render(scene, camera2);
	//renderer.clearDepth();
}

/**
 * Creates orbit line
 *
 * @radius - radius of the orbit
 * @return - THREE.Line
 */
function createCircle(radius){
	segments = 64,
	material = new THREE.LineBasicMaterial( { color: 0x33383e } ),
	geometry = new THREE.CircleGeometry( getScaledDistance(radius), segments );
	
	geometry.vertices.shift();
	
	circle = new THREE.Line( geometry, material );
	circle.position.set(0.0, 0.0, 0.0);
	circle.rotation.set(toRad(90.0), 0.0, 0.0);
	circle.name = "OrbitLine";
	var scale = getScaledDistance(0.5);
	circle.scale.set(scale*2,scale*2,scale*2);

	return circle;
}