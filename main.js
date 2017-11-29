var AMOUNT = 100;
var container, stats;
var camera, scene, renderer;
var videostream, videoImage, videoImageContext, videoTexture;
var video, beat, image, imageContext,
imageReflection, imageReflectionContext, imageReflectionGradient,
texture, textureReflection, textureLeft;
var image2, imageContext2, texture2, video2, texture2;
var image3, imageContext3, texture3, video3, texture3;
var mesh;
var mouseX = 0;
var mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
  container = document.createElement( 'div' );

  document.body.appendChild( container );
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 9000 );
  camera.position.z = 1200;
  camera.position.y = 500;
  scene = new THREE.Scene();

  // here we grab the videos from their html elements:
  videostream = document.getElementById('monitor')
  video = document.getElementById( 'video' );
  video2 = document.getElementById( 'video2' );
  video3 = document.getElementById( 'video3' );

  ///////////
	// stream from webcam //
	///////////

	videoImage = document.getElementById( 'videoImage' );
  videoImage.width = 362;
  videoImage.height = 204;
	videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	//videoImageContext.fillStyle = '#000000';
	//videoImageContext.fillRect( 0, 0, 480, 204 );

	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;

	// var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
	// // the geometry on which the movie will be displayed;
	// // 		movie image will be scaled to fit these dimensions.
	// var movieGeometry = new THREE.PlaneGeometry( 100, 100, 1, 1 );
	// var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
	// movieScreen.position.set(0,0,0);
	// scene.add(movieScreen);
  // camera.position.set(0,150,1000);
	// camera.lookAt(movieScreen.position);


  //Front screen
  image = document.createElement( 'canvas' );
  image.width = 362;
  image.height = 204;
  imageContext = image.getContext( '2d' );
  imageContext.fillStyle = '#000000';
  imageContext.fillRect( 0, 0, 480, 204 );


  //videotexture for the front screen
  texture = new THREE.Texture( videoImage );
  var material = new THREE.MeshBasicMaterial( {map:videoTexture, overdraw: 0.5} );
  var plane = new THREE.PlaneGeometry( 380, 204, 4, 4 );
  mesh = new THREE.Mesh( plane, material );
  mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
  scene.add(mesh);


  //left screen
  image2 = document.createElement( 'canvas' );
  image2.width = 362;
  image2.height = 204;
  imageContext2 = image2.getContext( '2d' );
  imageContext2.fillStyle = '#000000';
  imageContext2.fillRect( 0, 0, 480, 204 );

  texture2 = new THREE.Texture( image2 );
  var material = new THREE.MeshBasicMaterial( {map: texture2, overdraw: 0.5} );
  let mesh2 = new THREE.Mesh( plane, material);
  mesh2.position.x = -620;
  mesh2.position.y = 5;
  mesh2.position.z = 350;
  mesh2.rotation.y = -43;
  mesh2.scale.x = mesh.scale.y = mesh.scale.z = 1.6;
  scene.add(mesh2);

  //right fullScreen
  image3 = document.createElement( 'canvas' );
  image3.width = 362;
  image3.height = 204;
  imageContext3 = image3.getContext( '2d' );
  imageContext3.fillStyle = '#000000';
  imageContext3.fillRect( 0, 0, 480, 204 );

  texture3 = new THREE.Texture( image3 );
  var material = new THREE.MeshBasicMaterial( {map: texture3, overdraw: 0.5} );
  mesh3 = new THREE.Mesh( plane, material);
  mesh3.position.x = 620;
  mesh3.position.y = 5;
  mesh3.position.z = 350;
  mesh3.rotation.y = 43;
  mesh3.scale.x = mesh.scale.y = mesh.scale.z = 1.6;
  scene.add(mesh3);

  //dot floor
  var separation = 150;
  var amountx = 10;
  var amounty = 10;
  var PI2 = Math.PI * 2;
  var material = new THREE.SpriteCanvasMaterial( {
    color: 0x0808080,
    program: function ( context ) {
      context.beginPath();
      context.arc( 0, 0, 0.5, 0, PI2, true );
      context.fill();
    }
  } );
  for ( var ix = 0; ix < amountx; ix++ ) {
    for ( var iy = 0; iy < amounty; iy++ ) {
      var sprite = new THREE.Sprite( material );
      sprite.position.x = ix * separation - ( ( amountx * separation ) / 2 );
      sprite.position.y = -153;
      sprite.position.z = iy * separation - ( ( amounty * separation ) / 2 );
      sprite.scale.setScalar( 2 );
      scene.add( sprite );
    }
  }
  renderer = new THREE.CanvasRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  stats = new Stats();
  container.appendChild( stats.dom );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseMove( event ) {
  mouseX = ( event.clientX - windowHalfX );
  mouseY = ( event.clientY - windowHalfY ) * 0.01;

}
function animate() {
  requestAnimationFrame( animate );
  render();
  stats.update();
}
function render() {
  camera.position.x += ( mouseX - camera.position.x ) * 0.05;
  camera.position.y += ( - mouseY - camera.position.y ) ;
  camera.lookAt( scene.position );
  if ( videostream.readyState === videostream.HAVE_ENOUGH_DATA ) {
    videoImageContext.drawImage( videostream, 0, 0 );
    if ( texture ) texture.needsUpdate = true;
  }
  if ( video2.readyState === video2.HAVE_ENOUGH_DATA ) {
    imageContext2.drawImage( video2, 0, 0 );
    if ( texture2 ) texture2.needsUpdate = true;
  }
  if ( video3.readyState === video3.HAVE_ENOUGH_DATA ) {
    imageContext3.drawImage( video3, 0, 0 );
    if ( texture3 ) texture3.needsUpdate = true;
  }
  if ( videostream.readyState === videostream.HAVE_ENOUGH_DATA )
	{
		videoImageContext.drawImage( videostream, 0, 0, videoImage.width, videoImage.height );
		if ( videoTexture )
			videoTexture.needsUpdate = true;
	}
  renderer.render( scene, camera );
}
