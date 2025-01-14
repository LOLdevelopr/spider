/*global

THR, THREE, GBP, GBV, window, document,butSettings, detSettings,divMenuItems,rngOpacity,rngViewExplodeVertical

*/

// Copyright 2018 Ladybug Tools authors. MIT License


	// needs a cleanup / streamlining / going from gets to sets

	var NUM = {};

	NUM.initNumbers = function () {

		if ( window.butMenuLoad ) {

			NUM.butMenuNumbers = butMenuLoad;

			NUM.title = 'gv-NUM - gbXML Viewer Numbers';
			document.title = NUM.title;
			aDocumentTitle.innerHTML = NUM.title;
			NUM.butMenuNumbers.innerHTML = NUM.title;

		} else {

			divPopUp.style.display = 'none';
			NUM.butMenuNumbers = butMenuNumbers;

		}

		if ( NUM.butMenuNumbers.style.fontStyle !== 'italic' ) {

			NUM.timeStart = Date.now();

			/// better to have a setMenuItems()?? / have all code in one function?
			divMenuItems.innerHTML = NUM.getMenuItems();

			NUMdivMenuPanelPrelims.innerHTML = NUM.getPanelVisibilityToggle();

			//NUMdivStoreyAreas.innerHTML = NUM.getAreasByStorey();

			NUM.setAreasByStorey( NUMdivStoreyAreas );

			NUMdivSurfaceTypeAreas.innerHTML = NUM.getAreaBySurfaceType();

			NUMdivOpeningAreas.innerHTML = NUM.getAreaByOpeningType();

			NUMdivExteriorAreas.innerHTML = NUM.getAreaByExteriorSurfaces();

			NUMdivOrientationAreas.innerHTML = NUM.getOrientationAreas();

			NUM.butMenuNumbers.style.cssText = 'background-color: pink !important; font-style: italic; font-weight: bold';

			const butts = divMenuItems.getElementsByTagName( "button" );
			//console.log( 'butts', butts );

			for ( let butt of butts ) {

				butt.classList.add( "w3-theme-d1", "w3-hover-theme", "w3-hover-border-theme" );

			}

		} else {

			divMenuItems.innerHTML = '';

			NUM.butMenuNumbers.style.fontStyle = '';
			NUM.butMenuNumbers.style.backgroundColor = '';
			NUM.butMenuNumbers.style.fontWeight = '';

		}

		THR.controls.autoRotate = false;
		THR.controls.keys = false;

	};



	NUM.getMenuItems = function() {

		const menuItems =

		`<details id = "NUMdetNumbers" open>

			<summary>Numbers &nbsp; <a href=#../gv-num-numbers/README.md>?</a></summary>

			<p><small>All quantities shown in this panel are calculated on-the-fly from the coordinate data in the gbXML file</small></p>

			<div id = "NUMdivMenuPanelPrelims" ></div>

			<div id = "NUMdivStoreyAreas" ></div>

			<div id = "NUMdivSurfaceTypeAreas" ></div>

			<div id = "NUMdivOpeningAreas" ></div>

			<div id = "NUMdivExteriorAreas" ></div>

			<div id = "NUMdivOrientationAreas" ></div>

			<hr>

		</details>`;

		return menuItems;

	}



	NUM.getPanelVisibilityToggle = function() {

		const txt =

		`<details open >

			<summary>Visibility Toggles</summary>

			<button class="w3-theme-d1 w3-hover-theme w3-hover-border-theme" onclick=GBP.surfaceMeshes.visible=!GBP.surfaceMeshes.visible; >surfaces</button>
				<button class="w3-theme-d1 w3-hover-theme w3-hover-border-theme" onclick=GBP.surfaceEdges.visible=!GBP.surfaceEdges.visible; >edges</button>
				<button class="w3-theme-d1 w3-hover-theme w3-hover-border-theme" onclick=GBP.openingMeshes.visible=!GBP.openingMeshes.visible; title="toggle the windows" >openings</button>
				<button class="w3-theme-d1 w3-hover-theme w3-hover-border-theme" onclick=GBP.setAllVisible(); >all visible</button>

			<hr>

		</details>`;

		return txt;

	};



	NUM.setAreasByStorey = function( target ) {

		GBP.surfaceOpenings.visible = false;

		let storeys = GBP.gbjson.Campus.Building.BuildingStorey;

		if ( !storeys ) { NUMdivStoreys.innerHTML = 'No storey data'; return; }

		storeys = Array.isArray( storeys ) ? storeys : [ storeys ];

		NUM.storeys = [];

		for ( let i = 0; i < storeys.length; i++ ) {

			NUM.storeys.push( storeys[ i ] );

		}

		NUM.storeys.sort();

		target.innerHTML =

		`<details>

			<summary id = "NUMsumAreasByStorey" >Areas by Storey &raquo; ` + NUM.storeys.length + ` found</summary>

			<p><small>Surface areas of floors</small></p>

			<div id=NUMdivAreasByStorey ></div>

			<p>
				<button onclick=NUM.showFloorSlab(NUMselAreasByStorey.value); title="area this slab" >get area of slab</button>

				<span id=NUMspnArea ></span>
			</p>

			<hr>

		</details>`;

		let item = {};
		item.attribute = 'idAreasByStorey';
		item.divAttributes = 'NUMdivAreasByStoreyAtts';
		item.divTarget = document.getElementById( 'NUMdivAreasByStorey' );
		item.element = 'Storey';
		item.name = 'itemAreasByStorey';
		item.optionValues = NUM.storeys.map( item => [ item.id, item.Name, item.Level ] );
		item.parent = GBP.gbjson.Campus.Building.BuildingStorey;
		item.placeholder = 'storey name';
		item.selItem = 'NUMselAreasByStorey';

		GBI.itemAdjacentSpaceInvalid = GBI.setElementPanel2( item );
		NUMselAreasByStorey.selectedIndex = 0;
		NUMselAreasByStorey.click();


	};


	NUM.showFloorSlab = function( storeyId ) {

		//console.log( 'id', id );

		GBP.surfaceOpenings.visible = false;

		const spaces = GBP.gbjson.Campus.Building.Space;

		const types = [ 'Ceiling', 'InteriorFloor', 'SlabOnGrade', 'RaisedFloor', 'UndergroundSlab' ];

		GBP.surfaceMeshes.children.forEach( element => element.visible = false );

		for ( let child of GBP.surfaceMeshes.children ) {

			adjacentSpaceId = child.userData.data.AdjacentSpaceId

			if ( !adjacentSpaceId ) { continue; }

			spaceIdRef = Array.isArray( adjacentSpaceId ) ? adjacentSpaceId[ 1 ].spaceIdRef : adjacentSpaceId.spaceIdRef

			spaces.forEach( element => { child.visible = element.id === spaceIdRef
				&& element.buildingStoreyIdRef === storeyId  && types.includes( child.userData.data.surfaceType )  ? true : child.visible;

			} );

		}

		NUM.floorSlabs = GBP.surfaceMeshes.children.filter( child => child.visible === true );
		//console.log( 'GBV.floorSlabs', GBV.floorSlabs);

		NUMspnArea.innerHTML = 'area: ' + NUM.getSurfacesAreaByArrayOfSurfaces( NUM.floorSlabs ).toLocaleString();

	};


	NUM.setStoreyAttributes = function() {

		const id = GBP.gbjson.Campus.Building.BuildingStorey[ NUMselStorey.selectedIndex ];

		GBP.openingMeshes.visible = false;

		NUM.floorSlabs = GBP.surfaceMeshes.children.filter( child => child.visible === true );
		//console.log( 'NUM.floorSlabs', NUM.floorSlabs );

		const area = NUM.getSurfacesAreaByArrayOfSurfaces( NUM.floorSlabs );

		NUMdivStoreys.innerHTML = NUM.traverseGbjson( id ).attributes + '<br>' +
			'area: ' + Math.round( area ).toLocaleString();

		// not yet
		//GBI.setGbjsonAttributes( id, NUMdivStoreys ) + '<br>' +
		//'area: ' + Math.round( area ).toLocaleString();

	}



	NUM.getAreaBySurfaceType = function() {

		const surfaces = GBP.gbjson.Campus.Surface;

		let txt = '';
		types = [];
		const typesCount = [];

		for ( let surfaceType of GBP.surfaceTypes ) {

			NUM[ 'surfaces' + surfaceType + 'Area' ] =  0;

		}

		for ( let surface of surfaces ) {

			index = types.indexOf( surface.surfaceType );

			if ( index < 0 ) {

				types.push( surface.surfaceType );
				typesCount[ types.length - 1 ] = 1;


			} else {

				typesCount[ index ] ++;

			}

		}


		for ( let i = 0; i < types.length; i++ ) {

			color =  GBP.colorsDefault[types[ i ]] ?  GBP.colorsDefault[types[ i ]].toString( 16 ) : '';
			color = color.length > 4 ? color : '00' + color;
			//console.log( 'col', color );

			const area = Math.round( NUM.getSurfacesArea( types[ i ] ) ).toLocaleString();
			//console.log( 'area', area );

			txt +=
			` <button
				 class=toggle onclick=GBI.setSurfaceTypeVisible(this.innerText);
				 style="width:8rem;background-color:#` + color + ` !important;" >` + types[ i ] +
					`</button> area: ` +
				area +
			`<br>`;

		}

		const tfa =
			NUM.surfacesInteriorFloorArea +
			NUM.surfacesSlabOnGradeArea +
			NUM.surfacesRaisedFloorArea +
			NUM.surfacesUndergroundSlabArea;

		surfaceTypes = ["InteriorFloor","RaisedFloor","SlabOnGrade","UndergroundSlab"];

		surfaceTypeAreas =

		`<details>

			<summary >Areas by Surface Type</summary>

			<p>Areas here are surface areas.</p>` +

			txt +

			`<p>
				<button style=width:8rem; onclick=NUM.showBySurfaceTypeArray(surfaceTypes); >Total floor</button>  area: ` +
					Math.round( tfa ).toLocaleString() + `</p>

			<hr>
		</details>`;

		return surfaceTypeAreas;


	}



	NUM.getAreaByOpeningType = function() {

		// !! numbers differ with GBP.openings !!

		NUM.SurfacesWithOpenings = GBP.surfaceJson.filter( element => element.Opening );
		//console.log( 'NUM.SurfacesWithOpenings', NUM.SurfacesWithOpenings );

		NUM.openingsJson = [];

		for ( surface of NUM.SurfacesWithOpenings ) {

			if ( surface.Opening.length ) {

				NUM.openingsJson.push ( ...surface.Opening );

			} else {

				NUM.openingsJson.push ( surface.Opening );

			}

			//if ( surface.Opening.length ) { console.log( 'surface.Opening.length', surface.Opening.length ); }

		}

		//console.log( 'NUM.openingsJson', NUM.openingsJson );


		let txt = '';
		const types = [];
		const typesCount = [];

		for ( let opening of GBP.surfaceOpenings.children ) {

			index = types.indexOf( opening.openingType );

			if ( index < 0 ) {

				types.push( opening.openingType );
				typesCount[ types.length - 1 ] = 1;

			} else {

				typesCount[ index ] ++;

			}

		}

		let areaTotal = 0;
		let countTotal = 0;

		for ( let i = 0; i < types.length; i++ ) {

			const area = NUM.getAreaOpeningTypes( types[ i ] )
			txt +=
				` <button style=width:8rem; class=toggle onclick=GBI.setOpeningTypeVisible(this.innerText); >` +
					types[ i ] +
					`</button> area: ` + Math.round( area ).toLocaleString() +
					` count: ` + typesCount[ i ] +
				`<br>`;

			areaTotal += area;
			countTotal += typesCount[ i ];

		}

		const openingAreas =

		`<details>
			<summary >Areas by Opening Type</summary>
			<p>`+
				txt +
			`</p>
			<div><button style=width:8rem; onclick=GBI.setOpeningTypeVisible(); >
				Total openings</button> area: ` + Math.round( areaTotal ).toLocaleString() +
				` count: ` + countTotal +
				`<br>
			<div>
			<hr>
		</details>`;

		return openingAreas;

	}



	NUM.getAreaOpeningTypes = function( type ) {

		let areaTotal = 0;

		const openings = NUM.openingsJson.filter( element => element.openingType === type );

		for ( opening of openings ) {
			//console.log( 'undergroundWall', undergroundWall.PlanarGeometry.PolyLoop );

			const points = opening.PlanarGeometry.PolyLoop.CartesianPoint.map( CartesianPoint => new THREE.Vector3().fromArray( CartesianPoint.Coordinate ) )
			//console.log( 'points', points );

			//const triangle = NUM.getTriangle( points );
			const triangle = GBP.getPlane( points );
			//console.log( 'triangle', triangle );
			if ( !triangle ) { console.log( 'opening error', opening ); continue; };

			//console.log( 'triangle,normal', triangle.normal() );

			const obj = new THREE.Object3D();
			obj.lookAt( triangle.normal );  // copy the rotation of the triangle
			obj.quaternion.conjugate();
			obj.updateMatrixWorld();

			points.map( point => obj.localToWorld( point ) );
			//console.log( 'points', points );

			area = THREE.ShapeUtils.area( points );
			areaTotal += area
			//console.log( 'area', THREE.ShapeUtils.area( points ) );

			//surface.area = area;

		}

		NUM[ 'openings' + type + 'Area' ] = areaTotal;
		return areaTotal;

	}



	NUM.getAreaByExteriorSurfaces = function() {

		const tesa = NUM.surfacesExteriorWallArea + NUM.surfacesRoofArea +
			NUM.surfacesExposedFloorArea + NUM.surfacesSlabOnGradeArea + NUM.surfacesUndergroundSlabArea +
			NUM.surfacesUndergroundWallArea;

		// array of types must be embedded , use double quotes and have no spaces
		exteriorAreas =

		`<details>
			<summary >Areas by Exterior Surface</summary>
			<p>
				<button style=width:8rem;
					onclick=NUM.showBySurfaceTypeArray(["ExteriorWall","Roof","ExposedFloor","SlabOnGrade","UndergroundSlab","UndergroundWall"]); >
					Exterior surfaces</button> area: ` +
					Math.round( tesa ).toLocaleString() +
			`</p>

			<p>
				<button class=toggle onclick=GBI.setExposedToSunVisible(); >Exposed to Sun</button>
			</p>

			<hr>
		</details>`;

		return exteriorAreas;

	}



	NUM.getSurfacesArea = function( type ) {

		let areaTotal = 0;
		const surfaces = GBP.surfaceJson.filter( element => element.surfaceType === type );

		for ( let surface of surfaces ) {
			//console.log( 'undergroundWall', undergroundWall.PlanarGeometry.PolyLoop );

			const points = surface.PlanarGeometry.PolyLoop.CartesianPoint.map( CartesianPoint => new THREE.Vector3().fromArray( CartesianPoint.Coordinate ) )
			//console.log( 'points', points );

			// // Move to getTriangle??

			//const triangle = NUM.getTriangle( points );
			const triangle = GBP.getPlane( points );
			//console.log( 'triangle', triangle );
			if ( !triangle ) { console.log( 'surface error', surface ); continue; };

			//console.log( 'triangle,normal', triangle.normal() );

			const obj = new THREE.Object3D();
			obj.lookAt( triangle.normal );  // copy the rotation of the triangle
			obj.quaternion.conjugate();
			obj.updateMatrixWorld();

			points.map( point => obj.localToWorld( point ) );
			//console.log( 'points', points );

			area = THREE.ShapeUtils.area( points );
			areaTotal += area
			//console.log( 'area', THREE.ShapeUtils.area( points ) );

			//surface.area = area;
			NUM[ 'surfaces' + type + 'Area' ] = areaTotal;

		}

		return NUM[ 'surfaces' + type + 'Area' ];

	}



	NUM.getSurfacesAreaByArrayOfSurfaces = function( surfaces ) {
		// console.log( '', surfaces );

		let area = 0;

		for ( surface of surfaces ) {
			//console.log( 'undergroundWall', undergroundWall.PlanarGeometry.PolyLoop );

			const points = surface.userData.data.PlanarGeometry.PolyLoop.CartesianPoint.map( CartesianPoint => new THREE.Vector3().fromArray( CartesianPoint.Coordinate ) )
			//console.log( 'points', points );

			//const triangle = NUM.getTriangle( points );
			const triangle = GBP.getPlane( points );
			//console.log( 'triangle', triangle );

			if ( !triangle ) { console.log( 'surface error', surface ); continue; };

			//console.log( 'triangle,normal', triangle.normal() );

			const obj = new THREE.Object3D();
			obj.lookAt( triangle.normal );  // copy the rotation of the triangle
			obj.quaternion.conjugate();
			obj.updateMatrixWorld();

			points.map( point => obj.localToWorld( point ) );
			//console.log( 'points', points );

			area += THREE.ShapeUtils.area( points );
			//console.log( 'area', THREE.ShapeUtils.area( points ) );

			//NUM[ 'surfaces' + type + 'Area' ] = area;

		}

		return area;

	}



	NUM.getOrientationAreas = function(){

		const surfaces = GBP.surfaceJson.filter( element => element.surfaceType === 'ExteriorWall' );

		oriented = {
			North: { items: [], openings: [], color: 'Blue' },
			NorthEast: { items:[], openings: [], color: 'Magenta' },
			East: { items:[], openings: [], color: 'DarkOrange' },
			SouthEast: { items:[], openings: [], color: 'OrangeRed' },
			South: { items:[], openings: [], color: 'Red' },
			SouthWest: { items:[], openings: [], color: 'Salmon' },
			West: { items:[], openings: [], color: 'Chocolate' },
			NorthWest: { items:[], openings: [], color: 'Gold' }
		};

		keys = Object.keys( oriented );
		//console.log( 'keys', keys );

		for ( let key of keys ) {

			oriented[ key ].material = new THREE.MeshBasicMaterial( { color: oriented[ key ].color.toLowerCase(), side: 2 } );

		}

		for ( surface of surfaces ) {
			//console.log( 'undergroundWall', undergroundWall.PlanarGeometry.PolyLoop );

			const points = surface.PlanarGeometry.PolyLoop.CartesianPoint.map( CartesianPoint => new THREE.Vector3().fromArray( CartesianPoint.Coordinate ) )
			//console.log( 'points', points );

			//const triangle = NUM.getTriangle( points );
			const triangle = GBP.getPlane( points );
			//console.log( 'normal', triangle.normal );

			if ( !triangle ) { console.log( 'error', surface ); continue; }
			angle = Math.atan2( triangle.normal.y, triangle.normal.x) * 180 / Math.PI + 180;
			//console.log( 'angle', angle );


			const wall = GBP.surfaceMeshes.children.find( ( element ) => element.userData.data.id === surface.id );

			if ( angle < 22.5 && angle >= 0 || angle > 337.5 && angle < 360 ) {

				wall.material = oriented.East.material
				oriented.East.items.push( wall );

			} else if ( angle >= 22.5 && angle < 67.5) {

				wall.material = oriented.SouthEast.material
				oriented.SouthEast.items.push( wall );

			} else if ( angle >= 67.7 && angle < 112.5 ) {

				wall.material = oriented.South.material
				oriented.South.items.push( wall );

			} else if ( angle >= 112.5 && angle < 157.5 ) {

				wall.material = oriented.SouthWest.material
				oriented.SouthWest.items.push( wall );

			} else if ( angle >= 157.5 && angle < 202.5 ) {

				wall.material = oriented.West.material
				oriented.West.items.push( wall );

			} else if ( angle >= 202.5 && angle < 247.5 ) {

				wall.material = oriented.NorthWest.material
				oriented.NorthWest.items.push( wall );

			}	else if ( angle >= 247.5 && angle < 292.5 ) {

				wall.material = oriented.North.material
				oriented.North.items.push( wall );

			} else {  // > 292 && < 337.5

				wall.material = oriented.NorthEast.material
				oriented.NorthEast.items.push( wall );

			}

		}

		for ( opening of NUM.openingsJson ) {
			//console.log( 'opening', opening );

			const points = opening.PlanarGeometry.PolyLoop.CartesianPoint.map( CartesianPoint => new THREE.Vector3().fromArray( CartesianPoint.Coordinate ) )
			//console.log( 'points', points );

			//const triangle = NUM.getTriangle( points );
			const triangle = GBP.getPlane( points );
			//console.log( 'normal', triangle.normal );
			if ( !triangle ) { console.log( 'error', surface ); continue; }

			angle = Math.atan2( triangle.normal.y, triangle.normal.x) * 180 / Math.PI + 180;
			//console.log( 'angle', angle );

			const openingMesh = GBP.surfaceOpenings.children.find( ( element ) => element.userData.data.id === opening.id );

			if ( !openingMesh ) {
				//console.log( 'no mesh', opening );
				continue;
			}

			if ( angle < 22.5 && angle >= 0 || angle > 337.5 && angle < 360 ) {

				oriented.East.openings.push( openingMesh );

			} else if ( angle >= 22.5 && angle < 67.5) {

				oriented.SouthEast.openings.push( openingMesh );

			} else if ( angle >= 67.7 && angle < 112.5 ) {

				oriented.South.openings.push( openingMesh );

			} else if ( angle >= 112.5 && angle < 157.5 ) {

				oriented.SouthWest.openings.push( openingMesh );

			} else if ( angle >= 157.5 && angle < 202.5 ) {

				oriented.West.openings.push( openingMesh );

			} else if ( angle >= 202.5 && angle < 247.5 ) {

				oriented.NorthWest.openings.push( openingMesh );

			}	else if ( angle >= 247.5 && angle < 292.5 ) {

				oriented.North.openings.push( openingMesh );

			} else if ( angle >= 292 && angle < 337.5 ) {  // > 292 && < 337.5

				oriented.NorthEast.openings.push( openingMesh );

			} else {

				console.log( 'oops', openingMesh );

			}

		}


		txt = '';

		for ( let key of keys ) {

			oriented[ key ].areaWalls = NUM.getSurfacesAreaByArrayOfSurfaces( oriented[ key ].items );
			oriented[ key ].areaOpenings = NUM.getSurfacesAreaByArrayOfSurfaces( oriented[ key ].openings );

			if ( oriented[ key ].openings.length > 0 ) {

				num = 'wwr:' + Math.round( 100 * oriented[ key ].areaOpenings / oriented[ key ].areaWalls ).toLocaleString() + '%';

			} else {

				num = '';

			}

			txt += '<button onclick=NUM.showSurfacesInArray("' + key + '"); style="width:5rem;background-color:' + oriented[ key ].color + ' !important;" >' + key +
			'</button> wall:' + Math.round(oriented[ key ].areaWalls).toLocaleString() +
			' open:' + Math.round(oriented[ key ].areaOpenings).toLocaleString() +
			' ' + num + '<br>';

		}

		const orientationAreas =
			`<details>
				<summary >Areas & Ratios by Orientation</summary>
				<p >` +
				txt +
				`</p>
			</details>`;

		return orientationAreas;

	}


	////////// Show ? Hide

	NUM.showSurfacesInArray = function ( key ) {

		surfaces = oriented[ key ].items
		GBP.surfaceMeshes.children.forEach( element => element.visible = false );
		surfaces.forEach( element => element.visible = true );

	};


	//combine with by array

	NUM.showBySurfaceTypeArray = function( types ) {

		//console.log( 'types', types );

		const spaces = GBP.gbjson.Campus.Building.Space;

		GBP.surfaceMeshes.visible = true;

		GBP.surfaceMeshes.children.forEach( element => element.visible = false );

		for ( let child of GBP.surfaceMeshes.children ) {

			//adjacentSpaceId = child.userData.data.AdjacentSpaceId

			//if ( !adjacentSpaceId ) { continue; }

			//spaceIdRef = Array.isArray( adjacentSpaceId ) ? adjacentSpaceId[ 1 ].spaceIdRef : adjacentSpaceId.spaceIdRef

			spaces.forEach( element => { child.visible = types.includes( child.userData.data.surfaceType )  ? true : child.visible;

			} );

		}

		GBP.floorSlabs = GBP.surfaceMeshes.children.filter( child => child.visible === true );
		//console.log( 'GBV.floorSlabs', GBV.floorSlabs);

	};



	NUM.showFloorSlabs = function( id ) {

		//console.log( 'id', id );

		GBP.surfaceEdges.visible = true;
		GBP.surfaceMeshes.visible = true;
		GBP.openingMeshes.visible = false;

		const spaces = GBP.gbjson.Campus.Building.Space;

		const types = ['InteriorFloor', 'SlabOnGrade', 'RaisedFloor', 'UndergroundSlab']

		GBP.surfaceMeshes.children.forEach( element => element.visible = false );

		for ( let child of GBP.surfaceMeshes.children ) {

			adjacentSpaceId = child.userData.data.AdjacentSpaceId

			if ( !adjacentSpaceId ) { continue; }

			spaceIdRef = Array.isArray( adjacentSpaceId ) ? adjacentSpaceId[ 1 ].spaceIdRef : adjacentSpaceId.spaceIdRef

			spaces.forEach( element => { child.visible = element.id === spaceIdRef
				&& element.buildingStoreyIdRef === id  && types.includes( child.userData.data.surfaceType )  ? true : child.visible;

			} );

		}

		NUM.floorSlabs = GBP.surfaceMeshes.children.filter( child => child.visible === true );
		//console.log( 'GBV.floorSlabs', GBV.floorSlabs);

	};



	NUM.traverseGbjson = function traverseGbjson( obj ) {

		const elements = [];
		let attributes = '';

		for ( let property in obj ) {

			if ( obj[ property ] !== null && typeof( obj[ property ] ) === 'object' ) {

				if ( elements.indexOf( property ) < 0 ) { elements.push( property ); }

			} else {

				attributes += '<div>' + property + ': <i>' + obj[ property ] + '</i></div>';

			}

		};

		return { elements: elements, attributes: attributes };

	};



	NUM.initNumbers();