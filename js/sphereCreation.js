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
function createSphereEarthlike(waterLevel) {
	var geometry = new THREE.SphereGeometry(1, 20, 16);

	var colorWater = new THREE.Color(waterColors[randomInt(3)]);
	var colorAtmosphere = new THREE.Color(0x66d5ed);
	var terrainColor = terrainColors[randomInt(2)];
	
	var color1 = new THREE.Color(terrainColor[2]);
	var color2 = new THREE.Color(terrainColor[1]);
	var color3 = new THREE.Color(terrainColor[0]);
	
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
		fragmentShader: earthlikeFragmentShader
	});
	
	var sphere = new THREE.Mesh(geometry, material);
	
	return sphere;
}


function createSphereGasGiant() {
	var geometry = new THREE.SphereGeometry(1, 20, 16);

	var gasGiantAtmoColor = gasGiantColors[randomInt(9)];

	var color1 = new THREE.Color(gasGiantAtmoColor[0]);
	var color2 = new THREE.Color(gasGiantAtmoColor[1]);
	var color3 = new THREE.Color(gasGiantAtmoColor[2]);

	var material = new THREE.ShaderMaterial({
		uniforms: {
			lightPosition: { value: lightPosition },
			atmoColor1: { value: color1 },
			atmoColor2: { value: color2 },
			atmoColor3: { value: color3 },
		},
		vertexShader: vertexShader,
		fragmentShader: gasGiantFragmentShader
	});
	
	var sphere = new THREE.Mesh(geometry, material);
	
	return sphere;
}


function createSphereOther(volcanism) {
	var geometry = new THREE.SphereGeometry(1, 20, 16);

	var terrainColor = metallicColors[randomInt(11)];
	if (volcanism == 1.0){
		terrainColor = metallicColors[0];
	}
	
	var color1 = new THREE.Color(terrainColor[1]);
	var color2 = new THREE.Color(terrainColor[0]);
	var color3 = new THREE.Color(terrainColor[2]);
	
	var material = new THREE.ShaderMaterial({
		uniforms: {
			lightPosition: { value: lightPosition },
			groundColor: { value: color1 },
			groundColor2: { value: color2 },
			groundColor3: { value: color3 },
			activeVolcanism: { value: volcanism }
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
function createSphereRockyBody(color) {
	var geometry = new THREE.SphereGeometry(1, 20, 16);
	
	var colorN = new THREE.Color(color);
	
	var material = new THREE.ShaderMaterial({
		uniforms: {
			lightPosition: { value: lightPosition },
			bodyColor: { value: colorN },
		},
		vertexShader: vertexShader,
		fragmentShader: rockybodyFragmentShader
	});
	var sphere = new THREE.Mesh(geometry, material);
	
	return sphere;
}