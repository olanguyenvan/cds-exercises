
/**
 * Based on code by Ikaros Kappler from http://int2byte.de/public/blog.20160129_Three.js_Basic_Scene_Setup/
 **/

// Create new scene
this.scene = new THREE.Scene();

// Create a camera to look through
this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// Initialize a new THREE renderer (you are also allowed
// to pass an existing canvas for rendering).
this.renderer = new THREE.WebGLRenderer( { antialias : true, alpha:true } );
this.renderer.setSize(800, 600);

document.body.appendChild(renderer.domElement);


this.pointLight = new THREE.PointLight(0xFFFFFF);

this.pointLight.position.x = 10;
this.pointLight.position.y = 50;
this.pointLight.position.z = 130;

// add to the scene
this.scene.add( this.pointLight );


// Add grid helper
var gridHelper = new THREE.GridHelper( 90, 9 );
gridHelper.colorGrid = 0xE8E8E8;
this.scene.add( gridHelper );


// Add an axis helper
var ah = new THREE.AxisHelper(50);
ah.position.y -= 0.1;  // The axis helper should not interfere with the grid helper
this.scene.add( ah );


// Set the camera position
this.camera.position.set(50, 50, 50);
let originPoint = {x: 0, y: 0, z: 0}
this.camera.lookAt(originPoint);

// Finally we want to be able to rotate the whole scene with the mouse:
// Add an orbit control helper.
var _self = this;
this.orbitControls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
// Always move the point light with the camera. Looks much better ;)
this.orbitControls.addEventListener( 'change',
    function() { _self.pointLight.position.copy(_self.camera.position); }
);
this.orbitControls.enableDamping = true;
this.orbitControls.dampingFactor = 1.0;
this.orbitControls.enableZoom    = true;
this.orbitControls.target.copy(originPoint);


// This is the basic render function. It will be called perpetual, again and again,
// depending on your machines possible frame rate.
this._render = function () {
    // Pass the render function itself
    requestAnimationFrame(this._render);
    this.renderer.render(this.scene, this.camera);
};

// Call the rendering function. This will cause an infinite recursion
this._render();


var colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

function buildCircularHelix(){
    let lineGeom2 = new THREE.Geometry();
    let a = parseFloat(document.getElementById('circularHelixAValue').value);
    let b = parseFloat(document.getElementById('circularHelixBValue').value);
    let tStart = parseFloat(document.getElementById('circularHelixTValueFrom').value);
    let tEnd = parseFloat(document.getElementById('circularHelixTValueTo').value);
    let tIterations = parseFloat(document.getElementById('circularHelixTIterations').value);

    let tInterval = (tEnd - tStart) / tIterations
    for (var i=tStart; i<tEnd; i = i + tInterval){
        lineGeom2.vertices.push(new THREE.Vector3(a * Math.cos(i), b * i, a * Math.sin(i),));
    }

    let lineMat2 = new THREE.LineBasicMaterial( {
        color: colors[Math.floor(Math.random() * colors.length)]

    } );

    let line2 = new THREE.Line(lineGeom2, lineMat2, THREE.LineStrip );
    this.scene.add(line2);
}


function buildEllipticalHelix(){
    let lineGeom2 = new THREE.Geometry();
    let a1 = parseFloat(document.getElementById('EllipticalHelixA1Value').value);
    let a2 = parseFloat(document.getElementById('EllipticalHelixA2Value').value);
    let b = parseFloat(document.getElementById('EllipticalHelixBValue').value);
    let tStart = parseFloat(document.getElementById('EllipticalHelixTValueFrom').value);
    let tEnd = parseFloat(document.getElementById('EllipticalHelixTValueTo').value);
    let tIterations = parseFloat(document.getElementById('EllipticalHelixTIterations').value);


    let tInterval = (tEnd - tStart) / tIterations
    for (var i=tStart; i<tEnd; i = i + tInterval){
        lineGeom2.vertices.push(new THREE.Vector3(a1 * Math.cos(i), b * i, a2 * Math.sin(i),));
    }

    let lineMat2 = new THREE.LineBasicMaterial( {
        color: colors[Math.floor(Math.random() * colors.length)]
    } );


    let line2 = new THREE.Line(lineGeom2, lineMat2, THREE.LineStrip );
    this.scene.add(line2);
}

