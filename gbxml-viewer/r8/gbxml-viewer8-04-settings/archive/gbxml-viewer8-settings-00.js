

//	var divAppMenu = divAppMenu || undefined;

	var icw;
	var THREE;
	var scene;
	var surfaceMeshes
	var opacity;
	var cameraOrtho;
	var surfaceEdges;

	var helperNormalsFaces

	init();


	function init() {

		if ( !divAppMenu ) {

			divAppMenu= document.body.appendChild( document.createElement( 'div' ) );
			divAppMenu.style.cssText = 'background-color: white; border: 1px solid red; max-width: 350px; opacity: 0.85; ' +
				' padding: 10px; position: fixed; right: 30px; top: 20px; z-index:100000; ';

		}

		icw = ifrThree.contentWindow;
		THREE = icw.THREE;
		scene = icw.scene;
		surfaceMeshes = icw.surfaceMeshes;

		divAppMenu.innerHTML =

		'<div id = "divMenuItems" ></div>' +

			'<p><button onclick=setRandomMaterial(); >Set random material</button></p>' +

			'<p><button onclick=setPhongDefaultMaterial(); >Set default phong material</button></p>' +

			'<p><button onclick=setNormalMaterial(); >Set normal material</button></p>' +

			'<p><button onclick=setDefaultMaterial(); >Set default material</button></p>' +

			'<p><button onclick=setExposureMaterial(); >Set exposure type material</button></p>' +


			'<hr>' +

			'<p><button onclick=toggleBackgroundGradient(); > Toggle background gradient </button></p>' +

			'<p><button onclick=toggleWireframe(); title="View all the triangles created by Three.js to display the geometry." > Toggle wireframe </button></p>' +

			'<p><button onclick=toggleSurfaceNormals(); title="Every Three.js triangle has a normal. See them here." > Draw surface normals </button></p>' +

			'<p><button onclick=toggleAxesHelper(); >Toggle axes</button></p>' +

			'<p><button onclick=toggleGridHelper(); >Toggle grid</button></p>' +

			'<p><button onclick=toggleGroundHelper(); >Toggle ground</button></p>' +


			'<p><button onclick=toggleSceneAutoRotate() title= "Stop the spinning!" > Toggle scene rotation </button></p>' +

			'<p><button onclick=setCameraOrthoPerspective() title="" > Set Camera Ortho </button></p>' +

			'<p title="building opacity: 0 to 100%" >Opacity: ' +
				'<output id=outOpacity class=floatRight >85%</output>' +
				'<input type="range" id="rngOpacity" min=0 max=100 step=1 value=85 oninput=updateOpacity(); >' +
			'</p>';


	}



	function setRandomMaterial() {

		surfaceMeshes.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				child.material = new THREE.MeshPhongMaterial( {
					color: 0xffffff * Math.random(),
					polygonOffset: false,
					polygonOffsetFactor: 10, // positive value pushes polygon further away
					polygonOffsetUnits: 1,
					side: 2,
					transparent: true
				} );

			}

		} );

	}



	function setPhongDefaultMaterial() {

		surfaceMeshes.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				child.material = new THREE.MeshPhongMaterial( {
					side: 2,
					transparent: true
				} );

			}

		} );

	}



	function setNormalMaterial() {

		surfaceMeshes.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				child.material = new THREE.MeshNormalMaterial( {
					side: 2,
					transparent: true
				} );

			}

		} );

	}



	function setDefaultMaterial() {

		surfaceMeshes.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				child.material =
					new THREE.MeshPhongMaterial( { color: icw.colors[ child.userData.data.surfaceType ], side: 2, opacity: 0.85, transparent: true } );

			}

		} );

	}


	function setExposureMaterial() {


		var colorsExposure = {

			InteriorWall: 0xffff00,
			ExteriorWall: 0x00ff00,
			Roof: 0x00ff00,
			InteriorFloor: 0xffff00,
			ExposedFloor: 0x00ff00,
			Shade: 0x00ff00,
			UndergroundWall: 0x00ffff,
			UndergroundSlab: 0x00ffff,
			Ceiling: 0xffff00,
			Air: 0xffff00,
			UndergroundCeiling: 0xffff00,
			RaisedFloor: 0xffff00,
			SlabOnGrade: 0x00ffff,
			FreestandingColumn: 0xffff00,
			EmbeddedColumn: 0xffff00

		}

		surfaceMeshes.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				child.material =
					new THREE.MeshPhongMaterial( { color: colorsExposure[ child.userData.data.surfaceType ], side: 2, opacity: 0.85, transparent: true } );

			}

		} );

	}



/////////////////

	function toggleBackgroundGradient() {

// 2016-07-18

		var col = function() { return ( 0.5 + 0.5 * Math.random() ).toString( 16 ).slice( 2, 8 ); };
		var pt = function() { return ( Math.random() * window.innerWidth ).toFixed( 0 ); }
		var image = document.body.style.backgroundImage;

		ifrThree.contentDocument.body.style.backgroundImage = image ? '' : 'radial-gradient( circle farthest-corner at ' +
			pt() + 'px ' + pt() + 'px, #' + col() + ' 0%, #' + col() + ' 50%, #' + col() + ' 100% ) ';

	}




	function toggleWireframe() {

		icw.scene.traverse( function ( child ) {

			if ( child instanceof icw.THREE.Mesh ) {

				child.material.wireframe = !child.material.wireframe;

			}

		} );

	}




	function toggleSurfaceNormals() {

		if ( !helperNormalsFaces ) {

			helperNormalsFaces = new THREE.Group();

			surfaceMeshes.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {

					helperNormalsFace = new THREE.FaceNormalsHelper( child, 2, 0xff00ff, 3 );
					helperNormalsFaces.add( helperNormalsFace );

				}

			} );

			scene.add( helperNormalsFaces );
			helperNormalsFaces.visible = false;

		}

		helperNormalsFaces.visible = !helperNormalsFaces.visible;

	}




	function toggleAxesHelper() {

		icw.axesHelper.visible = !icw.axesHelper.visible;

	}



	function toggleGridHelper() {

		if ( !icw.gridHelper ) {

			icw.gridHelper = new THREE.GridHelper( 3 * surfaceMeshes.userData.radius, 20, 'green', 'lightgreen' );

			icw.gridHelper.rotation.x = Math.PI / 2;
			icw.gridHelper.position.set( icw.axesHelper.position.x, icw.axesHelper.position.y, 0 );
			surfaceMeshes.add( icw.gridHelper );

			icw.gridHelper.visible = false;

		}

		icw.gridHelper.visible = !icw.gridHelper.visible;

	}


	function toggleGroundHelper() {

		if ( !icw.groundHelper ) {

			icw.groundHelper = new THREE.GridHelper( 3 * surfaceMeshes.userData.radius, 20, 'green', 'lightgreen' );

			const geometry = new THREE.BoxBufferGeometry( 3 * surfaceMeshes.userData.radius, 3 * surfaceMeshes.userData.radius, 1  );
			const material = new THREE.MeshPhongMaterial( { color: 'green', opacity: 0.85, transparent: true } );
			icw.groundHelper= new THREE.Mesh( geometry, material );
			icw.groundHelper.name = 'groundHelper';
			icw.groundHelper.receiveShadow = true;
			icw.groundHelper.position.set( icw.axesHelper.position.x, icw.axesHelper.position.y, -0.51 );
			surfaceMeshes.add( icw.groundHelper );

			icw.groundHelper.visible = false;

		}

		icw.groundHelper.visible = !icw.groundHelper.visible;

	}


	function toggleSceneAutoRotate() {

		icw.controls.autoRotate = !icw.controls.autoRotate;

	}



	function setCameraOrthoPerspective() {

		if ( !cameraOrtho ) {

			const width = 300; //surfaceMeshes.userData.radius > 10 ? 3 * surfaceMeshes.userData.radius : 200;
			const height = 300; // surfaceMeshes.userData.radius > 10 ? 3 * surfaceMeshes.userData.radius : 200; //; //  * surfaceMeshes.userData.radius;
			cameraOrtho = new icw.THREE.OrthographicCamera( width / -3, width / 3, height / 3, height / - 3, 1, 1000 );
			cameraOrtho.up.set( 0, 0, 1 );
			icw.scene.add( cameraOrtho );
			controlsOrtho = new icw.THREE.OrbitControls( cameraOrtho, icw.renderer.domElement );

		}

		icw.camera = cameraOrtho;
		icw.camera.updateProjectionMatrix();
		icw.controls = controlsOrtho;

		icw.zoomObjectBoundingSphere( icw.surfaceMeshes )

	}



	function updateOpacity() {

		opacity = parseInt( rngOpacity.value, 10 );
		outOpacity.value = opacity + '%';

		icw.scene.traverse( function ( child ) {

			if ( child instanceof icw.THREE.Mesh ) {

				child.material.opacity = opacity / 100;

			}

		} );


	}

