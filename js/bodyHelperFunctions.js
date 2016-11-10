/**
 * Get how many seconds it takes for a body to complete an orbit
 * 
 * @largerMass - mass of the larger body in kilograms (eg when calculating orbit speed of earth around the sun, then the sun's mass)
 * @orbitRadius - radius of the orbit in kilometers
 *
 * @return - the time it takes for the body to complete a full orbit in seconds
 */
function getOrbitalPeriod(largerMass, orbitRadius){
	// Might need a separate function to calculate the time when the orbiting body mass is not trivial (eg in a binary sub-system)
	return 240000 * 0.72 * Math.PI * Math.sqrt(orbitRadius * orbitRadius * orbitRadius / (gConst * largerMass));
}

/**
 * Calculates a star radius based on it's mass (only applicable to main sequence stars [OBAFGKM])
 *
 * @bodyMass - stellar body mass in Solar Masses
 * @return - stellar body radius in Solar Radii (rounded to 2 decimals)
 */
function getStellarBodyRadius(bodyMass){
	return Math.round(Math.pow(bodyMass, 0.738) * 100) / 100
}

/**
 * Gives an approximated temperature of a star based on it's mass (Main sequence)
 * Based on https://en.wikipedia.org/wiki/Mass%E2%80%93luminosity_relation
 *
 * @bodyMass - stellar body mass in Solar Masses in Kelvins
 * @return - stellar surface temperature (rounded)
 */

function getStellarBodyTemperature(bodyMass){
	var radius = getStellarBodyRadius(bodyMass);
	var luminosity;
	if (bodyMass < .43){
		luminosity = 0.23 * Math.pow(bodyMass, 2.3);
	} else if (bodyMass < 2) {
		luminosity = Math.pow(bodyMass, 4);
	} else if (bodyMass < 20) {
		luminosity = 1.5 * Math.pow(bodyMass, 3.5);
	} else if (bodyMass < 40) {
		luminosity = 3200 * bodyMass;
	} else {
		luminosity = 12000 * bodyMass;
	}
	
	return Math.round(5790 * Math.pow(luminosity * Math.pow(radius, -2), 1.0/4.0));
}

/**
 * Might not be the most accurate way to find class (Main sequence), but currently it does the job well enough
 *
 * @bodyMass - stellar body mass in Solar Masses in Kelvins
 * @return - stellar body 
 */

function getSpectralClass(bodyMass){
	if (bodyMass < 0.43){
		return "M";
	} else if (bodyMass < 0.85) {
		return "K";
	} else if (bodyMass < 1.25) {
		return "G";
	} else if (bodyMass < 1.75) {
		return "F";
	} else if (bodyMass < 5.0) {
		return "A";
	} else if (bodyMass < 30.0) {
		return "B";
	} else {
		return "O";
	}
}

/**
 * Gets the colors of the star based on it's spectral class
 *
 * @bodyMass - stellar body class (O/B/A/F/G/K/M)
 * @return - array of three colors 
 */

function getStellarBodyColors(spectralClass){
	var colors = [0x000000, 0x000000, 0x000000];
	if (spectralClass == "M") {
		colors = [0xfa6843, 0xffa871, 0xffd38f];
	} else if (spectralClass == "K") {
		colors = [0xff9c62, 0xffca83, 0xffffa2];
	} else if (spectralClass == "G") {
		colors = [0xffbc7e, 0xffff9d, 0xffffd5];
	} else if (spectralClass == "F") {
		colors = [0xffb990, 0xffe7a6, 0xffffde];
	} else if (spectralClass == "A") {
		colors = [0x8da6ec, 0xbfe8ff, 0xe1ffff];
	} else if (spectralClass == "B") {
		colors = [0x858ace, 0xaeb4ff, 0xd9dfff];
	} else if (spectralClass == "O") {
		colors = [0x494da7, 0x949bff, 0xcfd6ff];
	}
	return colors;
}