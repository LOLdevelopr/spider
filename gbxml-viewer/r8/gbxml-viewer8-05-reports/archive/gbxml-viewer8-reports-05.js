// Copyright 2018 Ladybug Tools authors. MIT License

//	var divAppMenu = divAppMenu || undefined;

	var icw = icw || undefined;
	var gbjson, gbxml;
	var THREE;
	var surfaceGroup;
	var surfaceMeshes;
	var surfaceEdges;

	var surfaceAdjacencies;
	var telltale;
	var b = '<br>';

	initReport();



	function initReport() {

		if ( !divAppMenu ) {

			divAppMenu= document.body.appendChild( document.createElement( 'div' ) );
			divAppMenu.style.cssText = 'background-color: white; border: 1px solid red; max-height: 90%; ' +
				'max-width: 350px; opacity: 0.85; overflow: auto;' +
				' padding: 10px; position: fixed; right: 30px; top: 20px; z-index:100000; ';

		}

		createReport();

	}



	function createReport() {

		icw = ifrThree.contentWindow;
		gbjson = icw.gbjson;
		THREE = icw.THREE;
		scene = icw.scene;

		surfaceGroup = icw.scene.getObjectByName( 'surfaceMeshes' );
		surfaceMeshes = surfaceGroup.children;
		surfaceEdges = icw.scene.getObjectByName( 'surfaceEdges' );

		surfaceAdjacencies = [];

		divAppMenu.innerHTML =

			'<p>' +
				'<button onclick=surfaceGroup.visible=!surfaceGroup.visible; >surfaces</button>' +
				' <button onclick=surfaceEdges.visible=!surfaceEdges.visible; >edges</button>' +
				' <button onclick=icw.setAllVisible();icw.zoomObjectBoundingSphere(surfaceGroup); >reset view</button>' +
			'</p>' +

			'<div id = divReport ></div>';

		gbxml = traversGbjson( gbjson );
//console.log( 'gbxml', gbxml );

		divReport.innerHTML = addDetails( 'gbXML', gbxml.attributes );

		const campus = traversGbjson( gbjson.Campus );
		divReport.innerHTML += addDetails( 'Campus', campus.attributes );

		const locate = traversGbjson( gbjson.Campus.Location );
		const mapLink = getGoogleMap();
		divReport.innerHTML += addDetails( 'Campus Location' + mapLink, locate.attributes );


		const building = traversGbjson( gbjson.Campus.Building );
		divReport.innerHTML += addDetails( 'Building', building.attributes );

		const spaces = getSpaces();
		divReport.innerHTML += addDetails( spaces.summary, spaces.flowContent );

		const spacesTiny = getSpacesTiny();
		divReport.innerHTML += addDetails( spacesTiny.summary, spacesTiny.flowContent );

		const zones = traversGbjson( gbjson.Zone );
		divReport.innerHTML += addDetails( 'Zones', zones.attributes );

		const documents = traversGbjson( gbjson.DocumentHistory );
		divReport.innerHTML += addDetails( 'Documents', documents.attributes );

//		const surfaces = traversGbjson( gbjson.Campus.Surface );
		const surfaces = getSurfaces();
		divReport.innerHTML += addDetails( surfaces.summary, surfaces.flowContent );

//		examineGbjson( gbjson );

		const surfaceDuplicateCoordinates = getSurfaceDuplicatesCoordinates();
		divReport.innerHTML += addDetails( surfaceDuplicateCoordinates.summary, surfaceDuplicateCoordinates.flowContent );

		const surfaceDuplicateCadIds = getSurfaceDuplicateCadIds();
		divReport.innerHTML += addDetails( surfaceDuplicateCadIds.summary, surfaceDuplicateCadIds.flowContent );

		const surfaceDuplicateAdjacencies = getSurfaceDuplicateAdjacencies();
		divReport.innerHTML += addDetails( surfaceDuplicateAdjacencies.summary, surfaceDuplicateAdjacencies.flowContent );

		const surfaceTinies = getSurfacesTinies();
		divReport.innerHTML += addDetails( surfaceTinies.summary, surfaceTinies.flowContent );

	}



	function traversGbjson( obj ) {

		const elements = [];
		let attributes = '';

		for ( let i in obj ) {

			if ( obj[ i ] !== null && typeof( obj[ i ] ) === 'object' ) {

				if ( elements.indexOf( i ) < 0 ) { elements.push( i ); }

			} else {

				attributes += '<div><div id=ib >' + i + '</div>: ' + obj[ i ] + '</div>';

			}

		};

		return { elements: elements, attributes: attributes };

	}



	function addDetails( summary, text, open = '' ) {

		flowContent = text ? text : 'no attributes';

		const details =
			'<details ' + open + ' >' +
				'<summary>' + summary + '</summary>' +
				flowContent +
			'</details>' +
		'';

		return details;

	}



	function getGoogleMap() {

		const locate = gbjson.Campus.Location;  // remember that location is a reserved word in your browser
		let linkToMap;

		if ( locate && locate.Latitude && locate.Longitude ) {

			const link = 'https://www.google.com/maps/@' + locate.Latitude + ',' + locate.Longitude + ',17z';

			linkToMap = ' &raquo; <a href="'+ link + '" style=background-color:lightblue; target=_blank > &#x1f5fa; </a>';

		} else {

			linkToMap = '';

		}

		return linkToMap;

	}



	function getSpaces() {

		const spaces = gbjson.Campus.Building.Space;
		let flowContent = '';
		let count = 1;
//console.log( '', spaces  );

		if ( spaces.length ) {

			for ( let space of spaces ) {
//console.log( 'space', space );

				flowContent += '<div style=margin-bottom:10px; > ' +
					( count ++ ) +
					'. id: ' + space.id + b +
					' name: <button onclick=toggleSpace("' + space.id + '"); >' + space.Name + '</button>' + b +
					' area: ' + Number( space.Area ).toFixed( 1 ) + b +
				'</div>';

			}

		}

		return { summary: 'Spaces &raquo; ' + count, flowContent: flowContent };

	}



	function getSpacesTiny() {

		const spaces = gbjson.Campus.Building.Space;
		const b = '<br>';
		let flowContent = '';
		let count = 0;
//console.log( '', spaces  );

		if ( spaces.length ) {

			for ( let space of spaces ) {
//console.log( 'space', space );

				if ( parseFloat( space.Area ) < 2 ) {

					flowContent += '<div style=margin-bottom:10px; > ' +
						( count ++ ) +
						'. id: ' + space.id + b +
						' name: <button onclick=toggleSpace("' + space.id + '"); >' + space.Name + '</button>' + b +
						' area: ' + Number( space.Area ).toFixed( 1 ) + b +
					'</div>';

				}


			}

		}

		return { summary: 'Tiny Spaces &raquo; ' + count, flowContent: flowContent };

	}



	function getSurfaces() {

		surfaces = gbjson.Campus.Surface;

		let txt = '';

//console.log( 'surfaces', surfaces );

		types = [];
		typesCount = [];

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

			txt += '<button class=toggle onclick=toggleSurfaceType(this); >' + types[ i ] + '</button>: ' + typesCount[ i ] + ' - ' + Math.round( 100 * typesCount[ i ] / surfaces.length ) + '%<br>';

		}

		txt += '<button class=toggle onclick=icw.setAllVisible(); >all visible</button>: '

		const summary = 'Surfaces: ' + surfaces.length;

		return { summary: summary, flowContent: txt };

	}



	function getSurfaceDuplicatesCoordinates() {

		const surfacePolyLoops = [];
		const surfaceIds = [];
		const surfaces = gbjson.Campus.Surface;
		let count = 0;
		let flowContent = '';

		for ( let i = 0; i <  surfaces.length; i++ ) {

			surface = surfaces[ i ]
			points = JSON.stringify( surface.PlanarGeometry.PolyLoop.CartesianPoint );
			index = surfacePolyLoops.indexOf( points );

			if ( index < 0 ) {

				surfacePolyLoops.push( points );
				surfaceIds.push( i );

			} else {

				surfOther = surfaces[ surfaceIds[ index ] ];

//console.log( 'surface', surface );
//console.log( 'surfOther', surfOther );

				flowContent +=
					'<p>' + count +
						'. id: <button onclick=toggleSurface("' + surface.id + '"); >' + surface.id + '</button>' + b +
						'surfaceType: ' + surface.surfaceType + b +
						( surface.Name ? 'Name: ' + surface.Name + b : '' ) +
						( surface.CADObjectId ? 'CADObjectId: ' + surface.CADObjectId + b : '' ) +
						'<hr>' +
						'id of duplicate: <button onclick=toggleSurface("' + surface.id + '"); >' + surface.id + '</button>' + b +
						'surfaceType: ' + surfOther.surfaceType + b +
						( surfOther.Name ? 'Name: ' + surfOther.Name + b : '' ) +
						( surfOther.CADObjectId ? 'CADObjectId: ' + surfOther.CADObjectId + b : '' ) +

					'</p><hr>' + b;

				count ++;

			}

		}

		return { summary: 'Duplicate Coordinates &raquo; ' + count, flowContent: flowContent };

	}



	function getSurfaceDuplicateCadIds() {

		const surfacesIds = [];
		const surfaces = gbjson.Campus.Surface;
		let count = 0;
		let flowContent = '';

		for ( let surface of surfaces ) {

			const id = surface.CADObjectId;

			if ( !surfacesIds.includes( id ) ) {

				surfacesIds.push( id );

			} else {

				flowContent +=
					'<p>' + count +
						'. id: ' + '<button onclick=toggleSurface("' + surface.id + '"); >' + surface.id + '</button>' + b +
						'surfaceType: ' + surface.surfaceType + b +
						( surface.Name ? 'Name: ' + surface.Name + b : '' ) +
						( surface.CADObjectId ? 'CADObjectId: ' + surface.CADObjectId + b : '' ) +
					'</p>';

				count ++;

			}

		}

console.log( 'getSurfaceDuplicateCadIds', surfacesIds.length );

		count = surfacesIds.length === 1 ? 0 : count;
		return { summary: 'Duplicate CADObjectId &raquo; ' + count, flowContent: flowContent };

	}



	function getSurfaceDuplicateAdjacencies() {

		const surfaces = gbjson.Campus.Surface;
		let count = 0;
		let flowContent = '';

		for ( let surface of surfaces ) {

			adjacencies = surface.AdjacentSpaceId;

			if ( Array.isArray( adjacencies ) === true && JSON.stringify( adjacencies[ 0 ] ) === JSON.stringify( adjacencies[ 1 ] ) ) {

				surfaceAdjacencies.push( surface.Name );

//console.log( 'adjacencies', adjacencies  );

				flowContent +=
					'<p>' + count +
						'. id: ' + '<button onclick=toggleSurface("' + surface.id + '"); >' + surface.id + '</button>' + b +
						'surfaceType: ' + surface.surfaceType + b +
						( surface.Name ? 'Name: ' + surface.Name + b : '' ) +
						( surface.CADObjectId ? 'CADObjectId: ' + surface.CADObjectId + b : '' ) +
						'Space:  <button onclick=toggleSpace("' + adjacencies[ 0 ].spaceIdRef + '"); >' + adjacencies[ 0 ].spaceIdRef + '</button>' + b +
					'</p><hr>';

				count ++;

			}

		}

		return { summary: 'Duplicate Adjacencies &raquo; ' + count, flowContent: flowContent };

	}



	function getSurfacesTinies() {

		surfaces = gbjson.Campus.Surface;
		const b = '<br>';
		let flowContent = '';
		let count = 0;

//console.log( 'surfaces', surfaces );

		for ( let surface of surfaces ) {


			height = parseFloat( surface.RectangularGeometry.Height );
			width = parseFloat( surface.RectangularGeometry.Width );
			surfaceArea = height * width;

			if ( parseFloat( surfaceArea ) < 1 ) {

//console.log( 'surface', surface );

				adjacency = surface.AdjacentSpaceId ? surface.AdjacentSpaceId : '';

				if ( adjacency ) {

					spaceId = Array.isArray( surface.AdjacentSpaceId ) === true ? surface.AdjacentSpaceId[ 1 ].spaceIdRef : surface.AdjacentSpaceId.spaceIdRef

				}

				flowContent += '<div style=margin-bottom:10px; > ' +
					( ++ count ) +
					'. id: <button onclick=toggleSurface("' + surface.id + '"); >' + surface.id + '</button>' + b +
					'surfaceType: ' + surface.surfaceType + b +
					( surface.Name ? 'Name: ' + surface.Name + b : '' ) +
					( surface.CADObjectId ? 'CADObjectId: ' + surface.CADObjectId + b : '' ) +
					' area: ' + Number( surfaceArea ).toFixed( 1 ) + b +
					( spaceId ? 'Space:  <button onclick=toggleSpace("' + spaceId + '"); >' + spaceId + '</button>' + b : '' ) +

				'</div>';

			}

		}

		return { summary: 'Tiny Surfaces &raquo; ' + count, flowContent: flowContent };

	}



	function toggleSurface( id ) {

		surfaceGroup.visible = true;

		for ( let child of surfaceMeshes ) {

			if ( child.userData.data.id === id ) {

				child.visible = true;

//console.log( '', child );

				zoomIntoSurface( child );

			} else {

				child.visible = false;

			}

		};

	}



	function zoomIntoSurface( surface ){

//console.log( 'surface', surface );
		center = surface.localToWorld( surface.geometry.boundingSphere.center.clone() );

		radius = surface.geometry.boundingSphere.radius > 1 ? surface.geometry.boundingSphere.radius : 1;

		scene.remove( telltale );
		const geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
		const material = new THREE.MeshNormalMaterial( { opacity: 0.7, transparent: true } );
		telltale = new THREE.Mesh( geometry, material );
		telltale.position.copy( center );
		scene.add( telltale );


		icw.controls.target.copy( center );
		icw.camera.position.copy( center.clone().add( new THREE.Vector3( 3.0 * radius, - 3.0 * radius, 3.0 * radius ) ) );

//console.log( 'bbb', center, radius );

	}



	function toggleSurfaceType( that ) {

		surfaceGroup.visible = true;
//console.log( '', surfaceAdjacencies );

		for ( let child of surfaceMeshes ) {

			if ( child.userData.data.surfaceType !== that.innerText ) {

				child.visible = false;

			} else {

				if ( surfaceAdjacencies.includes( child.userData.data.Name ) ) { child.material.color.set( 'crimson' ); }

				child.visible = true;

			}

		};

	}



	function toggleSpace( id ) {

//console.log( 'id', id );

		surfaceGroup.visible = true;

		for ( let child of surfaceMeshes ) {

			child.visible = false;
			adjacentSpaceId = child.userData.data.AdjacentSpaceId;

			if ( adjacentSpaceId && adjacentSpaceId.spaceIdRef && id === adjacentSpaceId.spaceIdRef ) {

				child.visible = true;

			} else if ( Array.isArray( adjacentSpaceId ) === true ) {

				if ( id === adjacentSpaceId[ 0 ].spaceIdRef || id === adjacentSpaceId[ 1 ].spaceIdRef ) {

					child.visible = true;

				}

			}

		}

	}



	function xxxexamineGbjson( gbjson ) {

		surfaces = [];

		const b = '<br>';
		let txt =
			'File: ' + gbjson.name + b +
			'Number of surfaces: ' + gbjson.Campus.Surface.length +
		'';

		let t$ = '';

		let surfacesCount = 0;

		for ( let surface of gbjson.Campus.Surface ) {

			points = JSON.stringify( surface.PlanarGeometry.PolyLoop.CartesianPoint );

			if ( !surfaces.includes( points ) ) {

				surfaces.push( points );

			} else {

console.log( 'duplicate surface', surface );

				t$ +=
					'<p>' + surfacesCount +
						'. id: ' + surface.id + b +
						'surfaceType: ' + surface.surfaceType + b +
						'Name: ' + surface.Name + b +
						'CADObjectId: ' + surface.CADObjectId + b +
					'</p>';

				surfacesCount ++;

			}

		}



		divReport.innerHTML += addDetails( 'Duplicate Surfaces: ' + surfacesCount, t$ );
//		txt += '<h3>' + surfacesCount + ' Duplicate Surfaces</h3>' + t$;


		t$ = '<button class=toggle onclick=toggleAllVisible(); >all visible</button> '


		adjacenciesCount = 0;

		for ( let surface of gbjson.Campus.Surface ) {

			adjacencies = surface.AdjacentSpaceId;

			if ( Array.isArray( adjacencies ) && JSON.stringify( adjacencies[ 0 ] ) === JSON.stringify( adjacencies[ 1 ] ) ) {

//console.log( 'surface', surface );
//console.log( 'duplicate adjacencies', adjacencies );

				t$ +=
					'<p>' +
						( adjacenciesCount + 1 ) + '. id: ' + surface.id + b +
						'surfaceType: ' + surface.surfaceType + b +
						'Name: <button onclick=toggleDuplicateAdjacency(this); style=width:200px >' + surface.Name + '</button>' + b +
						'CADObjectId: ' + surface.CADObjectId + b +
						'Adjacencies : ' + adjacencies[ 0 ].spaceIdRef + b +
					'</p>';

				adjacenciesCount ++;

			}

		}


//		txt += '<h3>' + adjacenciesCount + ' Duplicate Adjacencies</h3>' + t$;

		divReport.innerHTML += addDetails( 'Duplicate Adjacencies: ' + adjacenciesCount, t$ );


		coordinatesCount = 0;
		verticesModelDuplicates = 0
		verticesModel = [];
		t$ = ''


		for ( let surface of gbjson.Campus.Surface ) {

			points = surface.PlanarGeometry.PolyLoop.CartesianPoint;

			verticesSurface = [];

			for ( point of points ) {

				vertex = JSON.stringify( point );

				if ( !verticesSurface.includes( vertex ) ) {

					verticesSurface.push( vertex );

				} else {

console.log( 'dup', vertex );

				t$ +=
					'<p>' +
						'id: ' + surface.id + b +
						'surfaceType: ' + surface.surfaceType + b +
						'Name: ' + surface.Name + b +
						'CADObjectId: ' + surface.CADObjectId + b +
//						'Adjacencies : ' + adjacencies[ 0 ].spaceIdRef + b +
					'</p>';

				}


				if ( !verticesModel.includes( vertex ) ) {

					verticesModel.push( vertex );

				} else {

//console.log( 'dup in model', vertex );

					verticesModelDuplicates ++;

				}

				coordinatesCount ++;

			}

//console.log( '', vertices );

		}

		t$ = '' +
			'Coordinates checked: ' + coordinatesCount + b +
			'Unique coordinates in model: ' + verticesModel.length + b +
			'Duplicate coordinates in model: ' + verticesModelDuplicates + b +
		'';


		divReport.innerHTML += addDetails( 'Duplicate Coordinates', t$ );

//		divMenuItems.innerHTML = txt;


	}



	function toggleDuplicateAdjacency( that ) {

//console.log( '', that.innerText );

		let thatChild;

		surfaceGroup.visible = true;

		for ( let child of surfaceMeshes ) {

			if ( child instanceof THREE.Mesh && child.userData.data.Name !== that.innerText ) {

				child.visible = false;

			} else if ( child.material ) {

				child.visible = true;
				thatChild = child;

			}

		}

		space = thatChild.userData.data.AdjacentSpaceId[ 0 ].spaceIdRef;

		for ( let child of surfaceMeshes ) {


			if ( Array.isArray( child.userData.data.AdjacentSpaceId ) === true &&
				( space === child.userData.data.AdjacentSpaceId[ 0 ].spaceIdRef || space === child.userData.data.AdjacentSpaceId[ 1 ].spaceIdRef )
				&& child !== thatChild
			) {

				child.visible = true;
console.log( 'space', space );


			} else {

			}

		}

	}




