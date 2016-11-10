
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
	
	var sphere = createSphereEarthlike();
	sphere.scale.set(radius * 2, radius * 2, radius * 2);
	sphere.name = "NonStellar";
	sphere.UserData = {'type': 'Earth-Like Planet', 'mass': 1.2, 'radius': radius, 'rotationalSpeed': rotationalSpeed};
	
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
	
	var sphere = createSphereRockyBody();
	sphere.scale.set(radius * 2, radius * 2, radius * 2);
	sphere.name = "NonStellar";
	sphere.UserData = {'type': 'Rocky Body', 'mass': 0.3, 'radius': radius, 'rotationalSpeed': rotationalSpeed};//Siia erinevad tyybid icy/rocky/metal etc. icy jaoks vist läheb teistsugust shaderit vaja, need suht siledad
	
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
	sphere.UserData = {'type': spectralClass + '-Class Star', 'mass': mass, 'radius': scale, 'rotationalSpeed': rotationalSpeed};
	
	planet.add(sphere);
	
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