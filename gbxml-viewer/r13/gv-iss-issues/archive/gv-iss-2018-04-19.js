/*global

THR, THREE, GBP, ISS, window, document,butSettings, detSettings,divMenuItems,rngOpacity,rngViewExplodeVertical

*/

// Copyright 2018 Ladybug Tools authors. MIT License

	//GBP.defaultURL = '../../gbxml-sample-files/columbia-sc-two-story-education-trane.xml';

	var ISS = {};

	var spaceId1;
	var spaceId2;

	// call at bottom of file

	ISS.initIssues = function () {

		if ( window.butMenuLoad ) {

			ISS.butMenuIssues = butMenuLoad;

			ISS.title = 'gv-ISS - gbXML Viewer Issues';;
			document.title = ISS.title;
			aDocumentTitle.innerHTML = ISS.title;
			ISS.butMenuIssues.innerHTML = ISS.title;


		} else {

			divPopUp.style.display = 'none';
			ISS.butMenuIssues = butIssues;

		}

		THR.controls.autoRotate = false;
		THR.controls.keys = false;

		if ( ISS.butMenuIssues.style.fontStyle !== 'italic' ) {

			ISS.getMenuItems();

			ISS.butMenuIssues.style.cssText = 'background-color: pink !important; font-style: italic; font-weight: bold';

		} else {

			divMenuItems.innerHTML = '';

			ISS.butMenuIssues.style.backgroundColor = '';
			ISS.butMenuIssues.style.fontStyle = '';
			ISS.butMenuIssues.style.fontWeight = '';

		}

	};


	ISS.getMenuItems = function() {

		divMenuItems.innerHTML =

		`<details id = ISSdetIssues  class=app-menu open >

			<summary>Issues</summary>

			<div id=ISSdetPanelVisibilityToggle ></div>

			<div id=ISSdetPanelSurfacesDuplicateAdjacentSpaces ></div>

			<div id=ISSdetPanelSurfacesDuplicateCoordinates ></div>

			<div id=ISSdetPanelSurfacesUndefinedCadId ></div>

			<div id=ISSdetPanelSurfacesTiny ></div>

			<div id=ISSdetPanelSurfacesVertexClose ></div>

			<div id=ISSdetPanelOpeningVertices4Plus ></div>

			<div id=ISSdetPanelSurfaceTypeInvalid ></div>

			<div id=ISSdetPanelOpeningTypeInvalid ></div>

			<!--

			<details>

				<summary id = "ISSsumSurfacesXXX" >Surfaces XXX</summary>

				<div >Surfaces that are XXX</div>
				Minimum size <output id=ISSoutMinSize >0.5</output>
				<input id=ISSinpMinSize type=range min=0 max=100 value=50 step=1 onchange=ISSoutMinSize.value=this.value*0.01;ISS.getSurfacesTiny(); >
				<div class=flex-container2 >
					<div class=flex-div1 >
						<input oninput=GBI.setSelectedIndex(this,ISSselSurfaceXXX); size=6 placeholder="surface id" ><br>
						<select id = "ISSselSurfaceXXX"
						onclick=GBI.setSurfaceVisible(this.value);ISS.updateSurfaceXXXAttributes();
						onchange=GBI.setSurfaceVisible(this.value);ISS.updateSurfaceXXXAttributes(); size=10 ></select><br>
						<button onclick=GBI.setSurfaceZoom(ISSselSurfaceXXX.value); title="zoom into just this surface" >zoom</button>
					</div>
					<div id = "ISSdivSurfacesXXXAttributes" class=flex-left-div2 ></div>
				</div>

				<div id=ISSdivSurfacesTiny ></div>

			</details>

			<details>

				<summary id = "ISSsumSurfacesInside" >Surfaces Inside Surfaces</summary>

				<div >Surfaces that are inside another surface</div>

				<div class=flex-container2 >
					<div class=flex-div1 >
						<input oninput=GBI.setSelectedIndex(this,ISSselSurfaceInside); size=6 placeholder="surface id" ><br>
						<select id = "ISSselSurfaceInside"
						onclick=GBI.setSurfaceVisible(this.value);ISS.updateSurfaceInsideAttributes(); onchange=GBI.setSurfaceVisible(this.value);ISS.updateSurfaceInsideAttributes(); size=10 ><option>none found</option></select><br>
						<button onclick=GBI.setSurfaceZoom(ISSselSurfaceTiny.value); title="zoom into just this surface" >zoom</button>
					</div>
					<div id = "ISSdivSurfacesInsideAttributes" class=flex-left-div2 ></div>
				</div>

				<div id=ISSdivSurfacesInside ></div>

			</details>
			-->

			<hr>

		</details>`;

		//` + divMenuItems.innerHTML;

		ISSdetPanelVisibilityToggle.innerHTML = GBI.getPanelShowHide(); //ISS.getPanelVisibilityToggle();

		ISSdetPanelSurfacesDuplicateAdjacentSpaces.innerHTML = ISS.getPanelSurfacesDuplicateAdjacentSpaces();

		ISSdetPanelSurfacesDuplicateCoordinates.innerHTML = ISS.getPanelSurfacesDuplicateCoordinates();

		ISSdetPanelSurfacesUndefinedCadId.innerHTML = ISS.getPanelSurfacesUndefinedCadId();

		ISS.setPanelSurfacesTiny();

		ISS.setPanelSurfacesVertexClose();

		ISSdetPanelOpeningVertices4Plus.innerHTML = ISS.getPanelOpeningVertices4Plus();

		ISS.setPanelSurfaceTypeInvalid( ISSdetPanelSurfaceTypeInvalid );

		ISS.setPanelOpeningTypeInvalid( ISSdetPanelOpeningTypeInvalid );

	};



	ISS.getPanelSurfacesDuplicateAdjacentSpaces = function() {

		surfaces = GBP.gbjson.Campus.Surface;
		let count = 0;
		let contents = '';
		ISS.surfaceAdjacentsDuplicates = [];

		for ( let surface of surfaces ) {

			const adjacencies = surface.AdjacentSpaceId;

			if ( Array.isArray( adjacencies ) === true && JSON.stringify( adjacencies[ 0 ] ) === JSON.stringify( adjacencies[ 1 ] ) ) {

				ISS.surfaceAdjacentsDuplicates.push( { id: surface.id, cadId: surface.CADObjectId } );

			}

		}

		ISS.surfaceAdjacentsDuplicates.sort( ( aSurf, bSurf ) => {
			const a = aSurf.cadId;
			const b = bSurf.cadId;
			if ( a < b ) {
				return -1;
			}
			if ( a > b ) {
				return 1;
			}
			// items must be equal
			return 0;
		} );


		for ( let item of ISS.surfaceAdjacentsDuplicates ) {
			//console.log( 'item', item );

			const surface = surfaces.find( element => element.CADObjectId === item.cadId && element.id === item.id );
			//console.log( 'surface', surface );

			const height = parseFloat( surface.RectangularGeometry.Height );
			const width = parseFloat( surface.RectangularGeometry.Width );
			const surfaceArea = height * width;

			contents +=
			`<div style=margin-bottom:15px; >` +
				( ++ count ) +
				` <button onclick=GBI.setSurfaceVisible(this.innerText); >` + surface.id + `</button>
				<button onclick=GBI.setSurfaceZoom("` + surface.id + `"); >zoom</button>
				<button class=toggle onclick=GBI.setSurfaceTypeVisible(this.innerText); >` + surface.surfaceType + `</button><br>`
				+ ( surface.Name ? `name <i>` + surface.Name + `</i><br>` : `` )
				+ ( surface.CADObjectId ? `cad object id <button onclick=ISS.setCadIdVisible(` + ( count - 1 ) + `); >` + surface.CADObjectId + `</button><br>` : `` ) +
				`area <i>` + Number( surfaceArea ).toFixed( 1 ) + `</i>` +
				` length <i>` + height.toFixed( 3 ) + `</i> width <i>` + width.toFixed( 3 ) + `</i>
			</div>`;

			surfaceMesh = GBP.surfaceMeshes.children.find( element => element.userData.data.id === item.id );
			surfaceMesh.material.color.set( '#c080ff' );
		}

		const txt =
		`<details>

			<summary >Duplicate Adjacent Space &raquo; ` + count + ` found</summary>

			<p>
				Surfaces with two adjacent spaces pointing to identical space id. Use with heads-up display.
			</p>

			<p>
				<button id=ISSbutDuplicateAdjacent onclick=ISS.setDuplicateAdjacentSpaceVisibleToggle(); >toggle all duplicate adjacent spaces</button>
			</p>
			<hr>

			<div >` + contents + `</div>

		</details>`;

		return txt;

	};



	ISS.getPanelSurfacesDuplicateCoordinates = function() {

		const surfacePolyLoops = [];
		const surfaceIds = [];
		surfaceCoordinateDuplicates = [];

		let spaceIdOther1;
		let spaceIdOther2;

		const surfaces = GBP.surfaceJson;
		const b = '<br>';

		let count = 0;
		let flowContent =
			'<p>' +

				'<button id=butDuplicatesCoordinates onclick=ISS.setSurfaceArrayVisibleToggle(butDuplicatesCoordinates,surfaceCoordinateDuplicates); >toggle all duplicates</button>' +

				'<button onclick=ISS.saveFile(); title="creates a new file with the changes" >save edits</button>' +

				'</p>' +
				'<hr>';

		let spaceId;

		for ( let i = 0; i <  surfaces.length; i++ ) {

			surface = surfaces[ i ]
			points = JSON.stringify( surface.PlanarGeometry.PolyLoop.CartesianPoint );
			index = surfacePolyLoops.indexOf( points );

			if ( index < 0 ) {

				surfacePolyLoops.push( points );
				surfaceIds.push( i );

			} else {

				surfaceOther = surfaces[ surfaceIds[ index ] ];
				surfaceCoordinateDuplicates.push( surface.Name );

				//console.log( 'surface', surface );
				//console.log( 'surfaceOther', surfaceOther );

				adjacency = surface.AdjacentSpaceId ? surface.AdjacentSpaceId : '';

				if ( adjacency ) {

					if ( Array.isArray( adjacency ) === true ) {

						spaceId1 = surface.AdjacentSpaceId[ 0 ].spaceIdRef;
						spaceId2 = surface.AdjacentSpaceId[ 1 ].spaceIdRef;

					} else {

						spaceId1 = surface.AdjacentSpaceId.spaceIdRef;

					}

				}

				adjacencyOther = surfaceOther.AdjacentSpaceId ? surfaceOther.AdjacentSpaceId : '';

				if ( adjacencyOther ) {

					if ( Array.isArray( adjacencyOther ) === true ) {

						spaceIdOther1 = surfaceOther.AdjacentSpaceId[ 0 ].spaceIdRef;
						spaceIdOther2 = surfaceOther.AdjacentSpaceId[ 1 ].spaceIdRef;


					} else {

						spaceIdOther1 = surfaceOther.AdjacentSpaceId.spaceIdRef;

					}

				}

				flowContent +=
					'<div id= "divSurface' + surface.id +'" >' +
						count + '. id: <button onclick=GBI.setSurfaceVisible(this.innerText); >' + surface.id + '</button>' +
							'<button onclick=GBI.setSurfaceZoom("' + surface.id + '"); >zoom</button>' + b +
						'surface type: <button class=toggle onclick=GBI.setSurfaceTypeVisible(this.innerText); >' + surface.surfaceType + '</button>: ' + b +
						( surface.Name ? 'name: ' + surface.Name + b : '' ) +
						( surface.constructionIdRef ? 'construction id ref: ' + surface.constructionIdRef + b : '' ) +
						( spaceId1 ? 'space:  <button onclick=ISS.showSpace(spaceId1); >' + spaceId1 + '</button>' + b : '' ) +
						( spaceId2 ? 'space:  <button onclick=ISS.showSpace(spaceId2); >' + spaceId2 + '</button>' + b : '' ) +
						( surface.CADObjectId ?
							'<button onclick=ISS.setCadIdVisible2("' + encodeURI( surface.CADObjectId ) + '"); >cad object id: ' + surface.CADObjectId + '</button>' + b
							: ''
						) +
						'delete: <button onclick=ISS.deleteSurface(this.innerText) >' + surface.id + '</button>' +
						'</div>' +
						'<hr>' +
						'<div id= "divSurface' + surfaceOther.id +'" >' +
						'id of duplicate: <button onclick=GBI.setSurfaceVisible(this.innerText); >' + surfaceOther.id + '</button>' +
							'<button onclick=GBI.setSurfaceZoom("' + surfaceOther.id + '"); >zoom</button>' + b +
						'surface type: <button class=toggle onclick=GBI.setSurfaceTypeVisible(this.innerText); >' + surfaceOther.surfaceType + '</button>: ' + b +
						( surfaceOther.Name ? 'name: ' + surfaceOther.Name + b : '' ) +
						( surfaceOther.constructionIdRef ? 'construction id ref: ' + surfaceOther.constructionIdRef + b : '' ) +
						( spaceIdOther1 ? 'space:  <button onclick=ISS.showSpace(spaceIdOther1); >' + spaceIdOther1 + '</button>' + b : '' ) +
						( spaceIdOther2 ? 'space:  <button onclick=ISS.showSpace(spaceIdOther2); >' + spaceIdOther2 + '</button>' + b : '' ) +
						( surfaceOther.CADObjectId ?
							'<button onclick=ISS.setCadIdVisible2("' + encodeURI( surfaceOther.CADObjectId ) + '"); >cad object id: ' + surfaceOther.CADObjectId + '</button>' + b
							: ''
						) +
						'delete: <button onclick=ISS.deleteSurface(this.innerText); >' + surfaceOther.id + '</button>' +

					'</div>' +
					'<hr style="border:none;border-top: medium double #333;" >' + b;

				count ++;

			}

		}

		for ( let child of GBP.surfaceMeshes.children ) {

			if ( !child.userData.data ) { continue; }

			if ( surfaceCoordinateDuplicates.includes( child.userData.data.Name ) && child.material.color ) { child.material.color.set( '#ffff00' ); }

		}

		//ISSsumDuplicateSurfaces.innerHTML= '';
		//divCRDInfo.innerHTML =
		//ISSdivDuplicateSurfaces.innerHTML= flowContent;

		const txt =

		`<details>

			<summary id = "ISSsumDuplicateSurfaces" >Duplicate Coordinates &raquo; ` + count + `</summary>

			<div >Two surfaces with identical coordinates</div>

			<divs >` + flowContent + `</div>

		</details>`;

		return txt;

	};



	ISS.getPanelSurfacesUndefinedCadId = function() {

		ISS.surfacesUndefinedId = GBP.surfaceJson.filter( element => element.CADObjectId === undefined || element.CADObjectId === '' );

		let options = '';
		ISS.surfacesUndefinedId.forEach( function( element ) { options += '<option>' + element.id + '</option>'; } );
		options = options ? options : '<option>none found</option>';

		const details =
		`<details>

			<summary id = "ISSsumSurfacesUndefinedCadId" >Undefined CAD Object IDs &raquo; ` + ISS.surfacesUndefinedId.length + ` found</summary>

			<div >Surfaces with undefined ID</div>

			<div class=flex-container2 >
				<div class=flex-div1 >
					<input oninput=GBI.setSelectedIndex(this,ISSselSurfaceUndefined); size=6 placeholder="surface id" ><br>
					<select id = "ISSselSurfaceUndefined"
						onclick=GBI.setSurfaceVisible(this.value);ISS.updateSurfaceUndefinedCadIdAttributes();
						onchange=GBI.setSurfaceVisible(this.value);ISS.updateSurfaceUndefinedCadIdAttributes(); size=10 >` +
						options + `
						</select><br>
					<button onclick=GBI.setSurfaceZoom(ISSselSurfaceUndefined.value); title="zoom into just this surface" >zoom</button>
					</div>
				<div id = "ISSdivSurfacesUndefinedAttributes" class=flex-left-div2 ></div>
			</div>

			<div id=ISSdivSurfacesUndefinedCadId ></div>

			<hr>

		</details>`;

		return details;

	};



	ISS.setPanelSurfacesTiny = function() {

		const sizeDefault = window.ISSinpMinSize ? parseFloat( ISSinpMinSize.value ) : 50;

		const size = 0.01 * sizeDefault; // parseFloat( ISSinpMinSize.value );
		ISS.surfacesTiny = GBP.surfaceJson.filter( surface =>
			parseFloat( surface.RectangularGeometry.Height ) * parseFloat( surface.RectangularGeometry.Width  ) < size );

		//let options = '';
		//ISS.surfacesTiny.forEach( function( element ) { options += '<option>' + element.id + '</option>'; } );
		//options = options ? options : '<option>none found</option>';

		ISSdetPanelSurfacesTiny.innerHTML =

		`<details>

			<summary id = "ISSsumSurfacesTiny" >Tiny Surfaces &raquo; ` + ISS.surfacesTiny.length + ` found</summary>

			<div ><small>Surfaces with area smaller than a set minimum</small></div>

			<p>
				Set minimum area: <output id=ISSoutMinSize >` + size + `</output>
				<input id=ISSinpMinSize type=range min=0 max=100 value=50 step=1
				onchange=ISSoutMinSize.value=this.value*0.01;ISS.getPanelSurfacesTiny(); >
			</p>

			<div id=ISSdivSurfacesTiny ></div>

			<button onclick=GBI.setSurfaceZoom(ISSselSurfacesTiny.value); title="zoom into just this surface" >zoom</button>

			<hr>

		</details>`;

		let data = {};
		data.attribute = 'IdTiny';
		data.gbjson = ISS.surfacesTiny.map ( item => item.id );
		data.selItem = 'ISSselSurfacesTiny';

		ISSdivSurfacesTiny.innerHTML = GBI.getElementPanel( data );
		ISSselSurfacesTiny.selectedIndex = 0;
		ISSselSurfacesTiny.click();


		//return details;

	};



	ISS.setPanelSurfacesVertexClose = function() {

		distanceDefault = window.ISSinpMinDistance ? parseFloat( ISSinpMinDistance.value ) : 50;

		const distance = 0.01 * distanceDefault;
		//console.log( 'distance', distance );

		ISS.surfacesVertexClose = [];

		//GBP.surfaceMeshes.children.forEach( child => child.visible = false );

		for ( let surface of GBP.surfaceMeshes.children ) {

			vertices = surface.geometry.vertices;

			if ( vertices.length > 4 ) {

				for ( i = 1; i <  vertices.length; i++ ) {

					if ( vertices[ i ].distanceTo( vertices[ i - 1 ] ) < distance ) {

						if ( ISS.surfacesVertexClose.indexOf( surface ) === -1 ) {

							ISS.surfacesVertexClose.push( surface )
							//surface.visible = true;
							//console.log( 'vertex', vertex );
						}

					}

				}

			}

		}

		//console.log( ISS.surfacesVertexClose.length , ISS.surfacesVertexClose );
		//let options = '';
		//ISS.surfacesVertexClose.forEach( function( element ) { options += '<option>' + element.userData.data.id + '</option>'; } );
		//options = options ? options : '<option>none found</option>';

		data = {};
		data.attribute = 'Id';
		data.gbjson = ISS.surfacesVertexClose.map ( item => item.userData.data.id );
		data.selItem = 'ISSselVertexClose';

		ISSdetPanelSurfacesVertexClose.innerHTML =

		`<details>

			<summary>Very Close Vertices by Id &raquo; ` + data.gbjson.length + ` items</summary>
			<div><small>Surfaces that have vertices closer to a set distance. Use telltales in right menu to identify the vertices.</small></div>

			<p>
				Set minimum distance: <output id=ISSoutMinDistance >` + distance + `</output><br>
				<input id=ISSinpMinDistance type=range min=0 max=100 value=` + distanceDefault + ` step=1
				onchange=ISS.setPanelSurfacesVertexClose(); >
			</p>

			<div id=ISSdivVertexClose ></div>

			<hr>

		<details>`


		ISSdivVertexClose.innerHTML = GBI.getElementPanel( data );

		ISSselVertexClose.selectedIndex = 0;
		ISSselVertexClose.click();

		/*
		const details =

		`<details ontoggle=ISSselSurfaceVertexClose.selectedIndex=0;ISSselSurfaceVertexClose.click(); >

			<summary>Very Close Vertices &raquo; ` + ISS.surfacesVertexClose.length + ` found</summary>

			<div >Surfaces that have close vertices. Use telltales in right menu to identify the vertices.</div>
			Test distance <output id=ISSoutMinDistance >` + distance + `</output>
			<input id=ISSinpMinDistance type=range min=0 max=100 value=` + distanceDefault + ` step=1
				onchange=ISSdetPanelSurfacesVertexClose.innerHTML=ISS.getPanelSurfacesVertexClose(); >
			<div class=flex-container2 >
				<div class=flex-div1 >
					<input oninput=GBI.setSelectedIndex(this,ISSselSurfaceVertexClose); size=6 placeholder="surface id" ><br>
					<select id = "ISSselSurfaceVertexClose"
						onclick=GBI.setSurfaceVisible(this.value);ISS.updateSurfaceVertexCloseAttributes();
						onchange=GBI.setSurfaceVisible(this.value);ISS.updateSurfaceVertexCloseAttributes(); size=10 >` +
						options +
					`</select><br>
					<button onclick=GBI.setSurfaceZoom(ISSselSurfaceVertexClose.value); title="zoom into just this surface" >zoom</button>
				</div>
				<div id = "ISSdivSurfacesVertexCloseAttributes" class=flex-left-div2 ></div>
			</div>

			<div id=xxxISSdivSurfacesVertexClose ></div>

		</details>`;

		return details;
		*/





	};



	ISS.getPanelOpeningVertices4Plus = function() {

		//console.log( 'GBP.openings', GBP.openings );

		let items = [];

		ISS.OpeningVertices4Plus  = items;

		for ( opening of GBP.openings ) {

			if ( opening.PlanarGeometry.PolyLoop.CartesianPoint.length > 4 ) {
				opening.Vertices = opening.PlanarGeometry.PolyLoop.CartesianPoint.length;
				items.push( opening );

			}
		}

		let options = '';
		items.forEach( element => options += '<option value=' + element.id + ' >' + element.Name + '</option>' );
		options = options ? options : '<option>none found</option>';

		const details =

		`<details id = "ISSdetOpeningVertices4Plus" >

			<summary >Opening Vertices > 4 &raquo; ` + items.length + ` found </summary>

			<div class=flex-container2 >

				<div class=flex-div1 >
					<select id=ISSselOpen size=` + ( items.length < 10 ? items.length : 10 ) +
						` onclick=GBI.setOpeningVisible(this.value);ISS.setPanelOpeningAttributes();
						onchange=GBI.setOpeningVisible(this.value);ISS.setPanelOpeningAttributes(); >` +
						options +
						`</select>
				</div>
				<div id = "ISSdivAttributes" class=flex-left-div2 ></div>

			</div>

		</details>`;

		return details;

	};



	ISS.setPanelSurfaceTypeInvalid = function( target ) {

		ISS.surfaceTypeInvalid = GBP.surfaceJson.filter( element => element.CADObjectId === undefined );

		let options = '';
		ISS.surfaceTypeInvalid.forEach( function( element ) { options += '<option>' + element.id + '</option>'; } );
		options = options ? options : '<option>none found</option>';

		target.innerHTML =
		`<details>

			<summary id = "ISSsumSurfaceTypeInvalid" >Surface Type Invalid &raquo; ` + ISS.surfaceTypeInvalid.length + ` found</summary>

			<div >Surfaces with undefined ID</div>

			<div class=flex-container2 >
				<div class=flex-div1 >
					<input oninput=GBI.setSelectedIndex(this,ISSselSurfaceUndefined); size=6 placeholder="surface id" ><br>
					<select id = "ISSselSurfaceUndefined"
						onclick=GBI.setSurfaceVisible(this.value);ISS.updateSurfaceTypeInvalid();
						onchange=GBI.setSurfaceVisible(this.value);ISS.updateSurfaceTypeInvalid(); size=10 >` +
						options + `
						</select><br>
					<button onclick=GBI.setSurfaceZoom(ISSselSurfaceTypeInvalid.value); title="zoom into just this surface" >zoom</button>
					</div>
				<div id = "ISSdivSurfaceTypeInvalid" class=flex-left-div2 ></div>
			</div>

			<div id=ISSdivSurfaceTypeInvalid ></div>

			<hr>

		</details>`;

	};



	ISS.setPanelOpeningTypeInvalid = function( target ) {

		ISS.surfaceTypeInvalid = GBP.surfaceJson.filter( element => element.CADObjectId === undefined );

		let options = '';
		ISS.surfaceTypeInvalid.forEach( function( element ) { options += '<option>' + element.id + '</option>'; } );
		options = options ? options : '<option>none found</option>';

		target.innerHTML =
		`<details>

			<summary id = "ISSsumOpeningTypeInvalid" >Opening Type Invalid &raquo; ` + ISS.surfaceTypeInvalid.length + ` found</summary>

			<div >Openings with undefined ID</div>

			<div class=flex-container2 >
				<div class=flex-div1 >
					<input oninput=GBI.setSelectedIndex(this,ISSselOpeningUndefined); size=6 placeholder="surface id" ><br>
					<select id = "ISSselOpeningUndefined"
						onclick=GBI.setOpeningVisible(this.value);ISS.updateOpeningTypeInvalid();
						onchange=GBI.setOpeningVisible(this.value);ISS.updateOpeningTypeInvalid(); size=10 >` +
						options + `
						</select><br>
					<button onclick=GBI.setOpeningZoom(ISSselOpeningTypeInvalid.value); title="zoom into just this surface" >zoom</button>
					</div>
				<div id = "ISSdivOpeningTypeInvalid" class=flex-left-div2 ></div>
			</div>

			<div id=ISSdivOpeningTypeInvalid ></div>

			<hr>

		</details>`;

	};


	///////// test not needed / never found any

	ISS.getSurfacesInside = function() {

		ISS.surfacesInside = [];

		GBP.surfaceMeshes.children.forEach( child => child.visible = false );

		for ( let surface of GBP.surfaceMeshes.children ) {

			surface.geometry.computeBoundingBox();

			for ( let surface2 of GBP.surfaceMeshes.children ) {

				surface2.geometry.computeBoundingBox();

				if ( surface.userData.data.id !== surface2.userData.data.id && surface.position === surface2.position &&
					surface.geometry.boundingBox.containsBox( surface2.geometry.boundingBox ) ) {

					ISS.surfacesInside.push( [ surface, surface2 ])
					surface2.visible = true;
				}

			}

		}

		console.log( ISS.surfacesInside.length , ISS.surfacesInside );

		ISSsumSurfacesInside.innerHTML= 'Surfaces Inside Surfaces &raquo;  <span style=background-color:var(--highlight-color); >&nbsp;' + ISS.surfacesInside.length + ' found&nbsp;</span>';

		let txt = '';
		ISS.surfacesInside.forEach( function( element ) { txt += '<option>' + element.userData.data.id + '</option>'; } );
		console.log( 'txt', txt );
		ISSselSurfaceInside.innerHTML = txt ? txt : '<option>none found</option>';
		ISSselSurfaceInside.selectedIndex = 0;

	};



	////////// set Visible

	ISS.setSurfaceArrayVisibleToggle = function( button, surfaceArray ) {

		if ( button.style.backgroundColor !== 'var( --but-bg-color )' ) {
			count = 0;
			GBP.surfaceMeshes.children.forEach( element =>
				{ element.visible = surfaceArray.includes( element.userData.data.Name ) ? true : false; count = element.visible ? count++ : count;} );
				console.log( '', count );

			button.style.backgroundColor = 'var( --but-bg-color )';

		} else {

			GBP.setAllVisible();

			button.style.backgroundColor = '';

		}

	};



	ISS.setCadIdVisible = function( index ) {

		GBP.surfaceMeshes.children.forEach( element =>
			element.visible = element.userData.data.CADObjectId === ISS.surfaceAdjacentsDuplicates[ index ].cadId ? true : false );

	};



	ISS.setCadIdVisible2 = function( CADObjectId ) {

		const id = decodeURI( CADObjectId );
		GBP.surfaceMeshes.children.forEach( element =>
			element.visible = element.userData.data.CADObjectId === id ? true : false );

	};



	ISS.setDuplicateAdjacentSpaceVisibleToggle = function() {

		if ( ISSbutDuplicateAdjacent.style.backgroundColor !== 'var( --but-bg-color )' ) {

			GBP.surfaceMeshes.children.forEach( child => child.visible = false );

			for ( let item of ISS.surfaceAdjacentsDuplicates ) {

				const surfaceMesh = GBP.surfaceMeshes.children.find( element => element.userData.data.id === item.id );
				surfaceMesh.visible = true;

			}

			ISSbutDuplicateAdjacent.style.backgroundColor = 'var( --but-bg-color )';

		} else {

			GBP.setAllVisible();

			ISSbutDuplicateAdjacent.style.backgroundColor = '';

		}

	};



	/////////


	ISS.updateSurfaceUndefinedCadIdAttributes = function() {

		ISSdivSurfacesUndefinedAttributes.innerHTML = ISS.getGbjsonAttributes( ISS.surfacesUndefinedId[ ISSselSurfaceUndefined.selectedIndex ] );

		if ( window.HUD ) {
			HUD.updateSurface( ISSselSurfaceUndefined.value );
			HUD.setHeadsUp();
		}
	};



	ISS.updateSurfaceTinyAttributes = function() {

		const surface = ISS.surfacesTiny[ ISSselSurfaceTiny.selectedIndex ];
		height = parseFloat( surface.RectangularGeometry.Height );
		width = parseFloat( surface.RectangularGeometry.Width );
		area =  height * width;
		txt = ISS.getGbjsonAttributes( surface );

		ISSdivSurfacesTinyAttributes2.innerHTML =
			txt + '<br>' +
			'height: ' + height.toLocaleString() + '<br>' +
			'width: ' + width.toLocaleString() + '<br>' +
			'area: ' + area.toLocaleString() + '<br>' +
		'';

		if ( window.HUD != undefined ) {

			HUD.updateSurface( ISSselSurfaceTiny.value );
			HUD.setHeadsUp();

		}

	};



	ISS.updateSurfaceVertexCloseAttributes = function() {

		const surface = ISS.surfacesVertexClose[ ISSselSurfaceVertexClose.selectedIndex ];
		const vertices = surface.geometry.vertices;
		const distance = 0.01 * parseFloat( ISSinpMinDistance.value );

		let txt = ISS.getGbjsonAttributes( surface.userData.data ) + '<br>';

		for ( i = 1; i <  vertices.length; i++ ) {

			if ( vertices[ i ].distanceTo( vertices[ i - 1 ] ) < distance ) {
				//console.log( 'vv', vertices[ i ], vertices[ i ].distanceTo( vertices[ i - 1 ] ) );

				txt += 'Close coordinates: ' + ( i - 1 ) + ' and ' + i + ': ' +
				vertices[ i ].distanceTo( vertices[ i - 1 ] ) + '<br>';

			}

		}

		ISSdivSurfacesVertexCloseAttributes.innerHTML =
			txt + '<br>' +

		'';

		if ( window.HUD ) {

			HUD.updateSurface( ISSselSurfaceVertexClose.value );
			HUD.setHeadsUp();

		}

	};



	ISS.setPanelOpeningAttributes = function() {

		let item = GBP.openings.find( element => element.id === ISSselOpen.value );
		const attributes = ISS.getGbjsonAttributes( item );
		ISSdivAttributes.innerHTML = ( ISSselOpen.selectedIndex + 1 ) + '.<br>' + attributes;

	};


	//////////


	ISS.getGbjsonAttributes = function( obj ) {

		let attributes = '';

		for ( property in obj ) {

			if ( obj[ property ] !== null && typeof( obj[ property ] ) === 'object' ) {

				if ( property === 'AdjacentSpaceId' ) {

					//console.log( 'property', obj[ property ].length );

					if ( Array.isArray( obj[ property ] ) ) {

						attributes += '<div>' + property + ': <i>' + obj[ property ][ 0 ].spaceIdRef + '</i></div>';
						attributes += '<div>' + property + ': <i>' + obj[ property ][ 1 ].spaceIdRef + '</i></div>';

					} else {

						attributes += '<div>' + property + ': <i>' + obj[ property ].spaceIdRef + '</i></div>';

					}

				}

			} else {

				attributes += '<div>' + property + ': <i>' + obj[ property ] + '</i></div>';

			}

		};

		return attributes;

	};



	ISS.initIssues();