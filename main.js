
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
camera.position.y = 1.4;
camera.position.z = 1.8;
var controls = new THREE.OrbitControls(camera);

//////////////////////////////////////////////////////////////////////////////////
//		Scene setup
//////////////////////////////////////////////////////////////////////////////////

// White directional light at half intensity shining from the top.
var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.target.position.set(0.5, 0, 1);
scene.add( directionalLight );
scene.add( directionalLight.target );



var geometry = new THREE.PlaneGeometry( 1, 1, 1, 1 );
geometry.rotateX(Math.PI / 2);
var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, wireframe: true} );
var plane = new THREE.Mesh( geometry, material );
// scene.add( plane );

// let root = {corners: [0, 0, 0, 0], values: [1, 1, 1, 1, 2]};
// let roottext = {corners: ['a', 'b', 'c', 'd'], values: ['ab', 'ac', 'bd', 'cd', 'x']}
// let child0 = new Node(root, 1, 0);
let root = new Root();
root.createChildrenRecursively(1);
root.children[0].createChildren();
root.children[2].createChildren();
root.children[0].children[0].createChildren();
root.children[0].children[2].createChildren();
// root.createChildrenRecursively(4);

let group = new THREE.Group();
console.log(group);
root.createGeometry(group, []);
scene.add(group);



//////////////////////////////////////////////////////////////////////////////////
//		Rendering
//////////////////////////////////////////////////////////////////////////////////

window.addEventListener('resize', function(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}, false);

onRenderFcts.push(function(){
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
