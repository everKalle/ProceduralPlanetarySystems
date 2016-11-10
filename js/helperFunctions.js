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

function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;		
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}