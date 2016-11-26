
/**
 * Creates an Earth-like planet
 *
 * @parentPivot - Pivot to orbit
 * @radius - Radius of the planet in Earth Radii
 * @orbit - Orbit radius
 * @orbitSpeed - Time it takes to complete one full orbit in seconds
 * @baseOrbitRotation - How many radians of the orbit has the body completed in the beginning (to give some variance, otherwise all planets start at the same angle and it looks kinda odd)
 * @rotationalSpeed - How long (in seconds) does it take to complete one full rotation
 *
 * @return - Pivot of the planet
 */
function addPlanet(parentPivot, radius, orbit, orbitSpeed, baseOrbitRotation, rotationalSpeed) {	//TODO: vaja lisada argumendid, et muuta orbiidi rotationit (ka kõigi järgnevate meetodite jaoks). massi ka ei anta ette.
	var pivot = new THREE.Object3D();			//Planet's pivot (around which other bodies orbiting it will rotate)
	pivot.name = "OrbitingBodyPivot";
	pivot.UserData = {'baseOrbit' : orbit };
	
	var orbitPivot = new THREE.Object3D();		// Pivot controlling orbiting of this planet
	orbitPivot.name = "Orbit";
	orbitPivot.UserData = {'speed' : orbitSpeed, 'baseRotation' : baseOrbitRotation};
	
	var planet = new THREE.Mesh();
	
	var waterLevel = 1.0 - (Math.random() * 1.2);
	
	var sphere = createSphereEarthlike(waterLevel);
	sphere.scale.set(radius * 2, radius * 2, radius * 2);
	sphere.name = "NonStellar";
	
	var mass = radius - (radius / 5) + Math.random() * (radius / 2);
	
	var typeVal = Math.random();
	var typeName;
	if (waterLevel > 0.25){
		typeName = "Water world";
	} else {
		typeName = "Earth-like planet";
	}
	if (typeVal > 0.9){
		typeName += " with water based life";
	}
	
	sphere.UserData = {'type': typeName, 'mass': roundToTwoDecimals(mass), 'radius': roundToTwoDecimals(radius), 'rotationalSpeed': rotationalSpeed};
	$("#planetContainer").append('<p onclick="focusPlanet(' + planet.id + ')">&nbsp;' + typeName + '</p>');
	
	planet.add(sphere);
	
	pivot.position.set(getScaledDistance(orbit), 0, 0);
	pivot.add(planet);
	
	orbitPivot.add(pivot);
	parentPivot.add(orbitPivot);

	parentPivot.add( createCircle(orbit) );
	
	return pivot;
}

/**
 * Creates a rocky body (eg moon)
 *
 * @parentPivot - Pivot to orbit
 * @radius - Radius of the body in Earth Radii
 * @orbit - Orbit radius
 * @orbitSpeed - Time it takes to complete one full orbit in seconds
 * @baseOrbitRotation - How many radians of the orbit has the body completed in the beginning (to give some variance, otherwise all planets start at the same angle and it looks kinda odd)
 * @rotationalSpeed - How long (in seconds) does it take to complete one full rotation
 *
 * @return - Pivot of the body
 */
function addRockyBody(parentPivot, radius, orbit, orbitSpeed, baseOrbitRotation, rotationalSpeed) {
	var pivot = new THREE.Object3D();			//Body's pivot (around which other bodies orbiting it will rotate)
	pivot.name = "OrbitingBodyPivot";
	pivot.UserData = {'baseOrbit' : orbit };
	
	var orbitPivot = new THREE.Object3D();		// Pivot controlling orbiting of this body
	orbitPivot.name = "Orbit";
	orbitPivot.UserData = {'speed' : orbitSpeed, 'baseRotation' : baseOrbitRotation};
	
	var planet = new THREE.Mesh();
	
	var bodyType;
	var bodyColor;
	if (Math.random() < 0.3){
		bodyType = "Icy Body";
		bodyColor = icyBodyColors[randomInt(2)];
	} else {
		bodyType = "Rocky Body";
		bodyColor = rockyBodyColors[randomInt(5)];
	}
	
	var sphere = createSphereRockyBody(bodyColor);
	sphere.scale.set(radius * 2, radius * 2, radius * 2);
	sphere.name = "NonStellar";
	
	var mass = radius - (radius / 5) + Math.random() * (radius / 2);
	
	sphere.UserData = {'type': bodyType, 'mass': roundToTwoDecimals(mass), 'radius': roundToTwoDecimals(radius), 'rotationalSpeed': rotationalSpeed};//Siia erinevad tyybid icy/rocky/metal etc. icy jaoks vist läheb teistsugust shaderit vaja, need suht siledad
	$("#planetContainer").append('<p onclick="focusPlanet(' + planet.id + ')">&nbsp;&nbsp;' + bodyType + '</p>');
	
	planet.add(sphere);
	
	pivot.position.set(getScaledDistance(orbit), 0, 0);
	pivot.add(planet);
	
	orbitPivot.add(pivot);
	parentPivot.add(orbitPivot);
	
	parentPivot.add( createCircle(orbit) );
	
	return pivot;
}

/**
 * Creates a star (currently only main-sequence)
 *
 * @parentPivot - Pivot to orbit
 * @mass - Mass of the star in Solar Masses
 * @orbit - Orbit radius
 * @orbitSpeed - Time it takes to complete one full orbit in seconds
 * @baseOrbitRotation - How many radians of the orbit has the body completed in the beginning (to give some variance, otherwise all planets start at the same angle and it looks kinda odd)
 * @rotationalSpeed - How long (in seconds) does it take to complete one full rotation
 *
 * @return - Pivot of the planet
 */
function addStar(parentPivot, mass, orbit, orbitSpeed, baseOrbitRotation, rotationalSpeed) {
	var pivot = new THREE.Object3D();		//Star's pivot (around which other bodies orbiting it will rotate)
	pivot.name = "OrbitingBodyPivot";
	pivot.UserData = {'baseOrbit' : orbit };
	
	var orbitPivot = new THREE.Object3D();	// Pivot controlling orbiting of this star
	orbitPivot.name = "Orbit";
	orbitPivot.UserData = {'speed' : orbitSpeed, 'baseRotation' : baseOrbitRotation};
	
	var spectralClass = getSpectralClass(mass);	//Get the star's spectral class based on it's mass
	var planet = new THREE.Mesh();
	
	var sphere = createSphereStar(getStellarBodyColors(spectralClass));
	var scale = getStellarBodyRadius(mass);
	sphere.scale.set(scale*2*solarMultiplier, scale*2*solarMultiplier, scale*2*solarMultiplier);
	sphere.name = "Star";
	sphere.UserData = {'type': spectralClass + '-Class Star', 'mass': roundToTwoDecimals(mass), 'radius': roundToTwoDecimals(scale), 'rotationalSpeed': rotationalSpeed};
	
	planet.add(sphere);
	
	$("#planetContainer").append('<p onclick="focusPlanet(' + planet.id + ')">' + spectralClass + '-Class Star</p>');
	
	var glowMaterial = new THREE.SpriteMaterial( { map: glowTexture, color: getStellarBodyColors(spectralClass)[1], transparent: false, blending: THREE.AdditiveBlending } );
	
	var sprite = new THREE.Sprite( glowMaterial );
	sprite.scale.set(scale*7*solarMultiplier, scale*7*solarMultiplier, 1.0);
	planet.add(sprite);
	
	pivot.position.set(getScaledDistance(orbit), 0, 0);
	pivot.add(planet);
	
	orbitPivot.add(pivot);
	parentPivot.add(orbitPivot);
	
	// If the orbit is 0, there is no need to create the orbit line
	if (orbit>0){
		parentPivot.add( createCircle(orbit) );
	}
	
	return pivot;
}

/**
 * Creates a nonexisting body (almost like creating a planet without an actual mesh)
 * Could be used to create a binary system (eg two planets orbit this pivot)
 *
 * //TODO: arguments
 */
function addEmptyBody(parentPivot, orbit){	//TODO: üsna lõpetamata see, vaja argumendid: orbitSpeed, baseOrbitRotation, rotationalSpeed nagu teistel.
	var pivot = new THREE.Object3D();
	pivot.name = "OrbitingBodyPivot";
	var orbitPivot = new THREE.Object3D();
	orbitPivot.name = "Orbit";
	orbitPivot.UserData = {'speed' : 300, 'baseRotation' : 0};
	pivot.position.set(getScaledDistance(orbit), 0, 0);
	orbitPivot.add(pivot);
	parentPivot.add(orbitPivot);
	
	parentPivot.add( createCircle(orbit) );
	
	return (pivot);
}