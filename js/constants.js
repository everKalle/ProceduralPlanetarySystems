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

var gasGiantColors = [[0x5c3d1e,0x365a28,0x447231], [0x213c2a,0x213c2a,0x257826], [0x3e3e3b,0x676557,0x798362], [0x800000,0xCD853F,0x8B4513],[0x00008B,0x8A2BE2,0x4B0082],[0x4682B4,0x7B68EE,0x0000CD]];
var waterColors = [0x5E75BF, 0x314994, 0x3d4b78, 0x38415c];
var rockyBodyColors = [0x494949, 0x675e4d, 0x968667, 0xc1bd9b, 0x58432e, 0x9c7853];
var icyBodyColors = [0xaec2cc, 0xdbefed, 0xc0d2dd];
var terrainColors = [[0x5c3d1e,0x365a28,0x447231], [0x213c2a,0x213c2a,0x257826], [0x3e3e3b,0x676557,0x798362]];
var metallicColors = [[0x070604,0x0b0704,0x0d0908], [0xb59276,0xba977b,0xdab69c], [0xd2a35d,0xddb26d,0xeec681], [0xa24b1e,0xa85a29,0xbd682f], [0x683e26,0x966d4f,0x966d4f], [0x2a1b16,0x38251e,0x38251e], [0x4e2919,0x6f3c2b,0x764737], [0x645830,0x6d613b,0x756845], [0x4c4348,0x544c59,0x594f4e], [0x342329,0x4f3842,0x755d6a], [0x6d5e5b,0x75665f,0x837167], [0x6c6b66,0x7b726d,0x867d78]];