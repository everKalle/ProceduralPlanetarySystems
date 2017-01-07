/**
 * Function to tell us the milliseconds
 *
 * @return - current time in milliseconds;
 */
function millis() {
	return (new Date()).getTime();
}

/**
 * Converts degrees to radians.
 * 
 * @degree - angle in degrees
 * @return - angle in radians
 */
function toRad(degree) {
	return Math.PI * 2 * degree / 360;
}

/**
 * Returns a random integer
 *
 * @n - end of range
 * @return - integer from the range [0, n]
 */

function randomInt(n) {
	return Math.floor((Math.random() * (n + 1)))
}

/**
 * Rounds a float to two decimals
 *
 * @n - float to round
 * @return - n rounded to two decimals
 */
function roundToTwoDecimals(n) {
	return Math.round(n * 100) / 100
}

/**
 * Linear distance scaling
 *
 * @dist - distance to scale
 * @return - scaled distance
 */
function getLinearScaledDistance(dist){
	return dist / orbitScale;
}

/**
 * Logarithmic distance scaling
 *
 * @dist - distance to scale
 * @return - scaled distance
 */
function getLogarithmicScaledDistance(dist){
	return 50 * Math.log(dist);
}

function betaLeft(){
	//http://stackoverflow.com/questions/16110758/generate-random-number-with-a-non-uniform-distribution
	unif = Math.random();
	beta = Math.pow(Math.sin(unif*Math.PI/2),10);
	beta_left = (beta < 0.5) ? 2*beta : 2*(1-beta);
	return beta_left;
}

/**
 * Scales a distance based on the selected scaling type
 *
 * @dist - distance to scale
 * @return - scaled distance
 */
function getScaledDistance(dist){
	if (distanceScaleMode == "log"){
		return getLogarithmicScaledDistance(dist);
	} else {
		return getLinearScaledDistance(dist);
	}
}

function periodString(t){
	if (t < 60){
		return roundToTwoDecimals(t) + " seconds";
	} else if (t < 3600){
		return roundToTwoDecimals(t / 60) + " minutes";
	} else if (t < 86400){
		return roundToTwoDecimals(t / 3600) + " hours";
	} else if (t < 31556926) {
		return roundToTwoDecimals(t / 86400) + " days";
	} else {
		return roundToTwoDecimals(t / 31556926) + " years";
	}
}

function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;		
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

/**
 * Return a random integer between min and max (both inclusive)
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}