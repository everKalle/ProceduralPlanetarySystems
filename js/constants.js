var earthMass = 5972000000000000000000000.0;			// Earth mass in kilograms
var solarMass = 1989100000000000000000000000000.0;		// Sun mass in kilograms
var gConst = 0.0000000000667408;						// G - gravitational constant

var earthRadius = 6371;									// Earth radius in kilometers
var solarRadius = 695700;								// Sun radius in kilometers

/*
 * These variables are necessary to get correct scale.
 * Since the way things are set up:
 * 1 THREE.js unit = Earth radius
 * Might have to change it maybe? Because some moons *could* be very small. Don't know if were gonna make any of those, but for instance Deimos and Phobos are scaled up like 100 times currently
 */
var solarMultiplier = solarRadius / earthRadius;
var distanceMultiplier = 1/earthRadius;