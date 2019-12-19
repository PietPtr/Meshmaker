function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onKeyDown(event) {
    console.log(event)
    let mod = 0;
    if (event.key == "ArrowDown") {
        mod = -1;
    } else if (event.key == "ArrowUp") {
        mod = 1;
    }

    let index = mapCoordsToIndex(selectedCoords);
    plane.geometry.vertices[index].y += mod * 0.01;
    plane.geometry.verticesNeedUpdate = true
}

window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener( 'keydown', onKeyDown, false );
//////////////////////////////////////////////////////////////////////////////////
//		Initialisation
//////////////////////////////////////////////////////////////////////////////////

var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setClearColor(new THREE.Color('#0c0c0c'), 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Array of functions for the rendering loop
var onRenderFcts = [];

// Initialise scene and camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.0001, 1000);
camera.position.x = 0;
camera.position.y = 0.4;
camera.position.z = 0.8;
var controls = new THREE.OrbitControls(camera);

//////////////////////////////////////////////////////////////////////////////////
//		Scene setup
//////////////////////////////////////////////////////////////////////////////////

// White directional light at half intensity shining from the top.
var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.target.position.set(0.5, 0, 1);
scene.add( directionalLight );
scene.add( directionalLight.target );

const WORLDSIZE = 128;
const heightmap = Array(128).fill(Array(128).fill(0));

var geometry = new THREE.PlaneGeometry( 1, 1, WORLDSIZE, WORLDSIZE );
geometry.rotateX(-Math.PI/2);
var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, wireframe: true} );
var plane = new THREE.Mesh( geometry, material );
scene.add( plane );

geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
geometry.rotateX(-Math.PI/2);
var intersectPlane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0x00ffff}));
// scene.add(intersectPlane);


var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var selectedCoords = new THREE.Vector3();

//////////////////////////////////////////////////////////////////////////////////
//		Rendering
//////////////////////////////////////////////////////////////////////////////////

window.addEventListener('resize', function(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}, false);

onRenderFcts.push(function(){
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( [intersectPlane] );

    for ( var i = 0; i < intersects.length; i++ ) {
        selectedCoords = planeCoordsToMapCoords(intersects[i].point);
	}

    renderer.render( scene, camera );
});

var lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
    requestAnimationFrame(animate);

    lastTimeMsec = lastTimeMsec || nowMsec-1000/60;
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
    lastTimeMsec = nowMsec;

    onRenderFcts.forEach(function(onRenderFct){
        onRenderFct(deltaMsec / 1000, nowMsec / 1000)
    });
});

function planeCoordsToMapCoords(coords) {
    return {
        x: Math.round((coords.x + 0.5) * (WORLDSIZE)),
        z: Math.round((coords.z + 0.5) * (WORLDSIZE))
    };
}

function mapCoordsToIndex(coords) {
    return coords.z * (WORLDSIZE+1) + coords.x;
}
