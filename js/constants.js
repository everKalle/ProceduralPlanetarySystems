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

var waterColors = [0x5E75BF, 0x314994, 0x3d4b78, 0x38415c];
var rockyBodyColors = [0x494949, 0x675e4d, 0x968667, 0xc1bd9b, 0x58432e, 0x9c7853];
var icyBodyColors = [0xaec2cc, 0xdbefed, 0xc0d2dd];
var terrainColors = [[0x5c3d1e,0x365a28,0x447231], [0x213c2a,0x213c2a,0x257826], [0x3e3e3b,0x676557,0x798362]];