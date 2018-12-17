/**
 * Partially based on code by Ikaros Kappler from http://int2byte.de/public/blog.20160129_Three.js_Basic_Scene_Setup/
 **/
var windowWidth=800.0, windowHeight=600.0;

// Create a scene
this.scene = new THREE.Scene();

// Create a camera
// Parameters: vertical field of view, aspect ratio, near-clipping plane, far-clipping plane
var camera = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 0.1, 1000);

// Create a THREE renderer
this.renderer = new THREE.WebGLRenderer( { antialias : true, alpha:true } );
this.shadowMapEnabled = true;
this.renderer.setSize(windowWidth, windowHeight);
document.body.appendChild(renderer.domElement); // append it to the DOM

// position and point the camera to the center of the scene (0,0,0)
camera.position.x = 150;
camera.position.y = 100;
camera.position.z = 170;
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Create light, with same position and direction as camera
this.spotLight = new THREE.SpotLight(0xffffff);
this.spotLight.position.copy(camera.position)
this.spotLight.target.position.copy (camera.lookAt);
scene.add(spotLight);


// Function to create the actual mesh
function createMesh(geom) {
    // Translate geometry to center of scene
    geom.applyMatrix(new THREE.Matrix4().makeTranslation(-functionExtent/2, 0, -functionExtent/2));
    // Assign material
    var meshMaterial = new THREE.MeshLambertMaterial({color:0xff5555, wireframe:false}); // You can disable wireframe
    meshMaterial.side = THREE.DoubleSide;
    // create a multimaterial and return it
    return THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);
}

// Create and add parametric surface function (i.e., parametric geometry) to scene
this.functionExtent = 60;
var slides = functionExtent/3; //Number of evaluations on first variable
var stacks = functionExtent/3; //Number of evaluations on second variable


let controlPoints = inputJSON.controlPoints;
var parametricFunction = getBezierSurfaceEquation(controlPoints);

//
// Create parametric geometry based on parametric function
var graphGeometry = new THREE.ParametricGeometry(parametricFunction, slides, stacks);

// Add it to scene
this.scene.add(createMesh(graphGeometry));

/****************************/

// Auxiliary things

// Add grid helper
var gridExtent=80;
var gridHelper = new THREE.GridHelper( gridExtent, gridExtent/10 );
gridHelper.colorGrid = 0xE8E8E8;
this.scene.add( gridHelper );

// Add an axis helper
var ah = new THREE.AxisHelper(50);
ah.position.y -= 0.1;  // The axis helper should not interfere with the grid helper
this.scene.add( ah );

// Add an orbit control helper, to navigate scence with mosue
var _self = this;
this.orbitControls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
// Always move the point light with the camera. Looks much better ;)
this.orbitControls.addEventListener( 'change',
    function() { _self.spotLight.position.copy(_self.camera.position); }
);
this.orbitControls.enableDamping = true;
this.orbitControls.dampingFactor = 1.0;
this.orbitControls.enableZoom    = true;
this.orbitControls.target.copy(new THREE.Vector3(0, 0, 0));

// This is the basic render function. It will be called perpetual, again and again,
// depending on your machines possible frame rate.
this._render = function () {
    // Pass the render function itself
    requestAnimationFrame(this._render);
    this.renderer.render(this.scene, this.camera);
};

// Call the rendering function. This will cause an infinite recursion
this._render();

