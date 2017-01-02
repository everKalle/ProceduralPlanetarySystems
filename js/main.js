var width = window.innerWidth; 
var height = window.innerHeight;

var renderer, scene, camera;
var planet;		// Need kolm variable suht useless siin
var star;
var moon;

var focusedObject;	// What object to follow when <SPACE> is pressed
var controls;

var hoverables;		// useless vist

var distanceScaleMode = "lin";
var orbitScale = 1;	// How many times smaller are orbits compared to their real value.
var speedScale = 1;	// How much faster does time move.


var raycaster = new THREE.Raycaster();	// Mouseover stuff.
var mouse = new THREE.Vector2(0.0);
var prevTime;

var lightPosition;		// Where's the light-source

var mainPivot;			// All stellar and non-stellar bodies are it's children, sort of the central point
var pivots = [];

var vertexShader;				// Shaders
var planetFragmentShader;		
var starFragmentShader;
var rockybodyFragmentShader;

var textureLoader;
var glowTexture;

var tempGlow;

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
	//camera2 = new THREE.OrthographicCamera(-width, width, 64, -64, -1000000000, 1000000000); //Mitte eemaldada hetkel, see kaugete planeetide billboardide kuvamise testiks hetkel (tho praegu ei tööta väga)
	camera.position.set(10,30,10000);
	camera.up = new THREE.Vector3(0,1,0);
	camera.lookAt(new THREE.Vector3(0,0,0));
	
	/*camera2.position.set(0,0,10000);
	camera2.up = new THREE.Vector3(0,1,0);
	camera2.lookAt(new THREE.Vector3(0,0,0));*/
	scene.add(camera);
	//scene.add(camera2);
	mainPivot = new THREE.Object3D();
	mainPivot.position.set(0.0, 0.0, 0.0);
	scene.add(mainPivot);

	
	lightPosition = new THREE.Vector3(0, 0, 0);
	 
	 
	 /* TODO : siit peaks sellest distanceMultiplier-iga korrutamisest lahti saama, mingi add???Body funktsioonis tegema korrutamise tegelt.
	 Seal peab vaatama tho et igalpool oleks läbi korrutatud ikka (st et userdatadesse ja igale poole saaks juba distanceMultiplier-ga läbi korrutatud kaugus) */
	
	textureLoader = new THREE.TextureLoader();
	glowTexture = textureLoader.load("images/glow.png");
	
	/*
	 * Very basic procedural generation
	 */
	
	
	
	procedularGeneration();
	
	
	window.addEventListener( 'mousemove', onMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );
	
	window.addEventListener('keydown', function(event) {
		if (event.keyCode == 32) { //<SPACE>
			if (camera.parent != focusedObject.parent){
				focusedObject.parent.add(camera);
				controls.target = new THREE.Vector3(focusedObject.position.x,focusedObject.position.y,focusedObject.position.z);
				controls.update();
			} else {
				scene.add(camera);
			}
		}
	}, false);
	
	$('#speedScaleSlider').on("change mousemove", function() {
		$('#speedScaleText').text($('#speedScaleSlider').val() + "x");
		speedScale = Number($('#speedScaleSlider').val());
	});
	
	$('#orbitScaleSlider').on("change mousemove", function() {
		$('#orbitScaleText').text("1/" + $('#orbitScaleSlider').val());
		orbitScale = Number($('#orbitScaleSlider').val());
		changeOrbitScale();
	});
	
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	renderer.autoClear = false;
	
	prevTime = millis() - 100;
	
	/*scene.add( new THREE.AmbientLight( 0xFFFFFF ) );
	
	var skyGeo = new THREE.SphereGeometry(100000000, 25, 25); 
	var texture = textureLoader.load("images/stars.png");
	var material = new THREE.MeshPhongMaterial({ 
		map: texture
		
	});
	var sky = new THREE.Mesh(skyGeo, material);
    sky.material.side = THREE.BackSide;
    scene.add(sky);*/
	
	draw();
}

function procedularGeneration() {

	scene.remove(mainPivot);
	$("#planetContainer").empty()

	mainPivot = new THREE.Object3D();
	mainPivot.position.set(0.0, 0.0, 0.0);
	scene.add(mainPivot);
	generateStar(mainPivot, 0, 0, 0, 2);
	focusedObject = mainPivot;
	scene.add(camera);
	changeOrbitScale();
}

function generateStar(pivot, orbit, orbitPeriod, baseRotation, depth){
	var starMass;
	if (Math.random() <= 0.8 || depth == 0){
		starMass = Math.max(betaLeft() * 20.0, 0.02)
		star = addStar(pivot, starMass, orbit, orbitPeriod, baseRotation, 400);
		generatePlanets(pivot, starMass, 10, 50082000 + 10820000 * Math.random(), 5082000, 10082000);
		return star;
	} else {
		var starMass1 = Math.max(betaLeft() * 20.0, 0.02);
		var starMass2 = Math.max(betaLeft() * 20.0, 0.02);
		starMass = starMass1 + starMass2;
		var binary;
		if (Math.random() <= 0.9){
			var binaryOrbitDistance = (getStellarBodyRadius(starMass1)*solarRadius + getStellarBodyRadius(starMass2)*solarRadius + 508200 + 10820000 * Math.random()) * distanceMultiplier;
			
			binary = addEmptyBody(pivot, orbit, orbitPeriod, baseRotation, true);
			
			star1 = addStar(binary, starMass1, binaryOrbitDistance, getOrbitalPeriod(starMass1, binaryOrbitDistance), 0, 400);
			star2 = addStar(binary, starMass2, binaryOrbitDistance, getOrbitalPeriod(starMass1, binaryOrbitDistance), toRad(180), 400);
			generatePlanets(pivot, starMass, 10, 50082000 + 5820000 * Math.random(), 5082000, 10082000);
		} else {
			var binaryOrbitDistance = (getStellarBodyRadius(starMass1)*solarRadius + getStellarBodyRadius(starMass2)*solarRadius + 508200000 + 1082000000 * Math.random()) * distanceMultiplier;
			
			binary = addEmptyBody(pivot, orbit, orbitPeriod, baseRotation, true);
			
			star1 = generateStar(binary, binaryOrbitDistance, getOrbitalPeriod(starMass1, binaryOrbitDistance), 0, depth-1);//addStar(binary, starMass1, binaryOrbitDistance, getOrbitalPeriod(starMass1, binaryOrbitDistance), 0, 400);
			star2 = generateStar(binary, binaryOrbitDistance, getOrbitalPeriod(starMass1, binaryOrbitDistance), toRad(180), depth-1);//addStar(binary, starMass2, binaryOrbitDistance, getOrbitalPeriod(starMass1, binaryOrbitDistance), toRad(180), 400);
			
			generatePlanets(star1, starMass1, 10, 10082000 + 5820000 * Math.random(), 5082000, 10082000);
			generatePlanets(star2, starMass2, 10, 10082000 + 5820000 * Math.random(), 5082000, 10082000);
		}
		return binary;
	}
}

function generatePlanets(pivot, baseMass, maxCount, baseDistance, distanceIncreaseBase, distanceIncreaseRandom){
	var numPlanets = Math.floor(Math.random() * maxCount);
	var distance = baseDistance;
	var CHZ_MidPoint = 149597871 * Math.sqrt(baseMass);
	var i = 0;
	for(i = 0; i < numPlanets; i++){
		if (Math.random() <= 0.9){
			if (distance < CHZ_MidPoint + 39597871 && distance > CHZ_MidPoint - 39597871){
				planet = addPlanet(pivot, 20 * Math.random(), distance * distanceMultiplier, getOrbitalPeriod(solarMass * baseMass, distance), 2 * 3.14 * Math.random(), 50 + Math.random() * 100, 1);
			} else {
				planet = addRockyBody(pivot, 20 * Math.random(), distance * distanceMultiplier, getOrbitalPeriod(solarMass * baseMass, distance), 2 * 3.14 * Math.random(), 50 + Math.random() * 100, 1);
			}
			generateMoons(planet);
		} else {
			binary = addEmptyBody(pivot, distance * distanceMultiplier, getOrbitalPeriod(solarMass * baseMass, distance), 2 * 3.14 * Math.random(), true);
			binaryOrbitDistance = 1650000 + Math.random() * 1650000;
			var planetMass1 = 20 * Math.random();
			var planetMass2 = 20 * Math.random();
			var planet1;
			var planet2;
			if (distance < CHZ_MidPoint + 39597871 && distance > CHZ_MidPoint - 39597871){
				planet1 = addPlanet(binary, planetMass1, binaryOrbitDistance * distanceMultiplier, getOrbitalPeriod((planetMass1 + planetMass2) * earthMass, binaryOrbitDistance), 0, 50 + Math.random() * 100, 1);
			} else {
				planet1 = addRockyBody(binary, planetMass1, binaryOrbitDistance * distanceMultiplier, getOrbitalPeriod((planetMass1 + planetMass2) * earthMass, binaryOrbitDistance), 0, 50 + Math.random() * 100, 1);
			}
			
			if (distance < CHZ_MidPoint + 39597871 && distance > CHZ_MidPoint - 39597871){
				planet2 = addPlanet(binary, planetMass2, binaryOrbitDistance * distanceMultiplier, getOrbitalPeriod((planetMass1 + planetMass2) * earthMass, binaryOrbitDistance), toRad(180), 50 + Math.random() * 100, 1);
			} else {
				planet2 = addRockyBody(binary, planetMass2, binaryOrbitDistance * distanceMultiplier, getOrbitalPeriod((planetMass1 + planetMass2) * earthMass, binaryOrbitDistance), toRad(180), 50 + Math.random() * 100, 1);
			}
			
			generateMoons(planet1);
			generateMoons(planet2);
		}
		distance += distanceIncreaseBase + distanceIncreaseRandom * Math.random();
	}
}

function generateMoons(pivot){
	var j = 0;
	var numMoons = Math.floor(Math.random() * 5);
	moonDistance = 165000 + Math.random() * 165000
	for(j = 0; j < numMoons; j++){
		moon = addRockyBody(pivot, 1 * Math.random(), Math.max(moonDistance * distanceMultiplier, 1.0), getOrbitalPeriod(earthMass, moonDistance), 2 * 3.14 * Math.random(), Math.random() * 30 + 30, 2);
		moonDistance += 16500 + Math.random() * 265000;
	}
}

function focusPlanet(planetID){
	var planet = scene.getObjectById( planetID, true );
	planet.parent.add(camera);
	controls.target = new THREE.Vector3(planet.position.x,planet.position.y,planet.position.z);
	controls.update();
	var data = planet.children[0].UserData;
	if (planet.children[0].name == "NonStellar"){
		$("#body-class").html(data['type']);
		$("#body-mass").html('Mass: ' + data['mass'] + ' Earth Masses');
		$("#body-radius").html('Radius: ' + data['radius'] + ' Earth Radii');
	} else if (planet.children[0].name == "Star") {
		$("#body-class").html(data['type']);
		$("#body-mass").html('Mass: ' + data['mass'] + ' Solar Masses');
		$("#body-radius").html('Radius: ' + data['radius'] + ' Solar Radii');
	}
	focusedObject = planet;
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
			object.material.uniforms.starAnimation.value = Math.cos(toRad((millis() * (1 + speedScale / 5000) / 500) % 360));
			object.material.uniforms.starAnimation2.value = Math.sin(toRad((millis() * (1 + speedScale / 5000) / 500) % 360));
			
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
				var newRotation = (data['rotation'] + (360 * deltaTime() * speedScale / (1000 * data['speed']))) % 360
				object.UserData['rotation'] = newRotation;
				object.rotation.set(0, newRotation, 0);
			}
		}
	});
	
	/*camera2.position.set(camera.position.x, camera.position.y, camera.position.z);
	camera2.rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z);*/
	/*var sc = Math.sqrt(Math.pow(tempGlow.position.x - camera.position.x, 2) + Math.pow(tempGlow.position.y - camera.position.y, 2) + Math.pow(tempGlow.position.z - camera.position.z, 2));
	tempGlow.scale.set(sc * 0.005, sc * 0.005, 1);*/
	
	prevTime = millis();
	
	renderer.clear();
	
	//renderer.setViewport( 0, 0, width, height );
	renderer.render(scene, camera);
	/*renderer.setViewport( 0, height - 128, width, 128 );
	renderer.render(scene, camera2);*/
	//renderer.clearDepth();
}

function deltaTime(){
	return millis() - prevTime;
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
	geometry = new THREE.CircleGeometry( radius, segments );
	
	geometry.vertices.shift();
	
	circle = new THREE.Line( geometry, material );
	circle.position.set(0.0, 0.0, 0.0);
	circle.rotation.set(toRad(90.0), 0.0, 0.0);
	circle.name = "OrbitLine";

	return circle;
}