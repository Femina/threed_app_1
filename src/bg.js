var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var cgl = document.getElementById("myCanvas");
var renderer = new THREE.WebGLRenderer({canvas:cgl, antialias:true, alpha:true});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
//document.body.appendChild( renderer.domElement );

var mouse = {x:0, y:0};
var pVars = {speed: 0.001, tSpeed: 0.001}
var pAmount = 400;
var pRadius = 500;
var pGroup = new THREE.Group();
var pLoader = new THREE.TextureLoader();
var pTex = pLoader.load("https://i.postimg.cc/MHdq7xJS/icons.png");
var pMat = new THREE.SpriteMaterial({map:pTex, color: 0xffffff, fog:true});
var uniforms = {
    texture:    { value: pTex },
    repeat:     { value: new THREE.Vector2( 0.25, 0.25 ) }
};
var pPart = [];

for(var i=0; i<pAmount;i++){
    var x = (Math.random() - 0.5) * 2 * 6;
    var y = (Math.random() - 0.5) * 2 * 6;
    var z = (Math.random() - 0.5) * 2 * 6;
    var mat = pMat.clone();
    pPart[i] = new THREE.Sprite(mat);
    pPart[i].position.set(x,y,z);
    pPart[i].scale.set(0.1,0.1,0.1);
    pPart[i].material.rotation = (Math.random() - 0.5);
    pPart[i].material.map.repeat.set(0.25,0.25);
    pPart[i].myOffset = new THREE.Vector2(Math.floor(Math.random() * 4) * 0.25 ,Math.floor(Math.random() * 4) * 0.25);
    pPart[i].material.transparent = true;
    pPart[i].material.opacity = 0.25;
    pPart[i].onBeforeRender = function(){
        this.material.map.offset.set(this.myOffset.x ,this.myOffset.y);
    };
    pGroup.add(pPart[i]);
}

scene.add(pGroup);

var light = new THREE.PointLight(0xaa0066);
var light2 = new THREE.HemisphereLight(0xffffbb, 0xffff00, 0.3);
light.position.set(0, 0, 10);
scene.add(light);
scene.add(light2);

camera.position.z = 5;

scene.fog = new THREE.Fog(0x111130, 4, 6);

var animate = function () {
    requestAnimationFrame( animate );

    pVars.speed += ((pVars.tSpeed)-pVars.speed)*0.1;
    for(var i=0; i<pAmount;i++){
        pPart[i].position.z += pVars.speed;
        if(pPart[i].position.z >= 3.5){
            pPart[i].material.opacity = Math.max((4.5-pPart[i].position.z)/4, 0);
        }
        if(pPart[i].position.z >= 5) {
            pPart[i].position.x = (Math.random() - 0.5) * 2 * 6;
            pPart[i].position.y = (Math.random() - 0.5) * 2 * 6;
            pPart[i].position.z = -2;
            pPart[i].material.rotation = (Math.random() - 0.5);
            pPart[i].material.opacity = 0.25;
            pPart[i].myOffset.x = Math.floor(Math.random() * 4) * 0.25;
            pPart[i].myOffset.y = Math.floor(Math.random() * 4) * 0.25;
        };
    }

    //cube.geometry.attributes.position.needsUpdate = true;
    camera.position.x += ((mouse.x*0.2)-camera.position.x)*0.02;
    camera.position.y += ((-mouse.y*0.2)-camera.position.y)*0.02;
    camera.lookAt(0,0,0);
    camera.updateProjectionMatrix();
  
    renderer.render( scene, camera );
};
$(window).resize($.throttle( 100, function () { 
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}));

$(window).ready(function(){
    document.addEventListener("mousemove", function(e){
        mouse.x = e.clientX / window.innerWidth * 2 - 1;
        mouse.y = e.clientY / window.innerHeight * 2 - 1;
    });
    document.addEventListener("mousedown", function(e){
        pVars.speed = 0.4;
        pVars.tSpeed = 0.4;
    });
    document.addEventListener("mouseup", function(e){
        pVars.tSpeed = 0.001;
    });
    animate();
})
