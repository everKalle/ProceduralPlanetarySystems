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
var speedScale = 1;	// How much faster does time move.


var raycaster = new THREE.Raycaster();	// Mouseover stuff.
var mouse = new THREE.Vector2(0.0);

var lightPosition;		// Where's the light-source

var mainPivot;			// All stellar and non-stellar bodies are it's children, sort of the central point

var vertexShader;				// Shaders
var planetFragmentShader;		
var starFragmentShader;
var rockybodyFragmentShader;


var textureLoader;
var glowTexture;


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
	camera.position.set(10,30,10000);
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
	
	textureLoader = new THREE.TextureLoader();
    glowTexture = textureLoader.load("images/glow.png");
    
    /*
     * Very basic procedural generation
     */
    
    //http://stackoverflow.com/questions/16110758/generate-random-number-with-a-non-uniform-distribution
    unif = Math.random();
    beta = Math.pow(Math.sin(unif*Math.PI/2),10);
    beta_left = (beta < 0.5) ? 2*beta : 2*(1-beta);
    star = addStar(mainPivot, Math.max(beta_left * 20.0, 0.02), 0, getOrbitalPeriod(earthMass, 5791000), 0, 400);
    var i = 0;
    var numPlanets = Math.floor(Math.random() * 10);
    var distance = 50820000 + 10820000 * Math.random();
    for(i = 0; i < numPlanets; i++){
        planet = addPlanet(mainPivot, 20 * Math.random(), distance * distanceMultiplier, getOrbitalPeriod(solarMass, distance), 3.14 * Math.random(), 50 + Math.random() * 100);
        var j = 0;
        var numMoons = Math.floor(Math.random() * 5);
        moonDistance = 165000 + Math.random() * 165000
        for(j = 0; j < numMoons; j++){
            moon = addRockyBody(planet, 1 * Math.random(), Math.max(moonDistance * distanceMultiplier, 1.0), getOrbitalPeriod(earthMass, moonDistance), 3.14 * Math.random(), Math.random() * 30 + 30);
            moonDistance += 16500 + Math.random() * 265000;
        }
        distance += 5082000 + 20082000 * Math.random();
    }
	 
	 
	 /* TODO : siit peaks sellest distanceMultiplier-iga korrutamisest lahti saama, mingi add???Body funktsioonis tegema korrutamise tegelt.
	 Seal peab vaatama tho et igalpool oleks läbi korrutatud ikka (st et userdatadesse ja igale poole saaks juba distanceMultiplier-ga läbi korrutatud kaugus) */
	
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


function focusPlanet(planetID){
    var planet = scene.getObjectById( planetID, true );
    planet.parent.add(camera);
    camera.lookAt(planet.position);
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
			object.material.uniforms.starAnimation.value = Math.cos(toRad((millis() / 500) % 720));
			object.material.uniforms.starAnimation2.value = Math.sin(toRad((millis() / 500) % 720));
			
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