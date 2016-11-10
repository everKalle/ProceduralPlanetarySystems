//TODO for all these : add some uniform to change the noise or something (maybe vec3 to add to the noise generation) so the bodies don't look the same

/**
 * Creates a sphere for a star
 *
 * @colors - array of the colors
 * @return - THREE.SphereGeometry
 */

function createSphereStar(colors) {
	var geometry = new THREE.SphereGeometry(1, 40, 32);
	
	var material = new THREE.ShaderMaterial({
		uniforms: {
			lightPosition: { value: lightPosition },
			starColorDark: { value: new THREE.Color(colors[0]) },
			starColorMed: { value: new THREE.Color(colors[1]) },
			starColorLight: { value: new THREE.Color(colors[2]) },
			starAnimation: {value: 0.0},
			starAnimation2: {value: 0.0}
		},
		vertexShader: vertexShader,
		fragmentShader: starFragmentShader
	});
	var sphere = new THREE.Mesh(geometry, material);
	
	return sphere;
}

/**
 * Creates a sphere for an earth-like planet
 *
 * @return - THREE.SphereGeometry
 */
 
//TODO : Pass colors and waterLevel as arguments
function createSphereEarthlike() {
	var geometry = new THREE.SphereGeometry(1, 20, 16);

	var colorWater = new THREE.Color(0x283B5E);
	var colorAtmosphere = new THREE.Color(0x66d5ed);
	var color1 = new THREE.Color(0x538d46);
	var color2 = new THREE.Color(0x43693a);
	var color3 = new THREE.Color(0x4b4333);
	var waterLevel = 0.0; //higher value = more water. if it's like -1 or less then there is no water (could be used to create kinda interesting planets as well probably)
							//though it must be noted that all planets created with this function will have atmospheric effects (clouds, rimlight)
							//probably should also add a "cloudLevel" uniform to control how many clouds there are...
	
	var material = new THREE.ShaderMaterial({
		uniforms: {
			lightPosition: { value: lightPosition },
			waterColor: { value: colorWater },
			atmosphereColor: { value: colorAtmosphere },
			groundColor: { value: color1 },
			groundColor2: { value: color2 },
			groundColor3: { value: color3 },
			waterLevel: {value: waterLevel}
		},
		vertexShader: vertexShader,
		fragmentShader: planetFragmentShader
	});
	
	var sphere = new THREE.Mesh(geometry, material);
	
	return sphere;
}

/**
 * Creates a sphere for a rocky body
 *
 * @return - THREE.SphereGeometry
 */
 
//TODO : Pass color as an arguments
function createSphereRockyBody() {
	var geometry = new THREE.SphereGeometry(1, 20, 16);

	var color3 = new THREE.Color(0x4b4333);
	
	var material = new THREE.ShaderMaterial({
		uniforms: {
			lightPosition: { value: lightPosition },
			bodyColor: { value: color3 },
		},
		vertexShader: vertexShader,
		fragmentShader: rockybodyFragmentShader
	});
	var sphere = new THREE.Mesh(geometry, material);
	
	return sphere;
}