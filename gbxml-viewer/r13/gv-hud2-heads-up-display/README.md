<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( http://www.ladybug.tools/spider/index.html#gbxml-viewer/r13/gv-hud-heads-up-display/README.md  "View file as a web page." ) </span>

<input type=button onclick="window.location.href='https://github.com/ladybug-tools/spider/blob/master/gbxml-viewer/r13/gv-hud2-heads-up-display/README.md'"
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' >

# 'Aragog' gbXML Viewer R13 Heads Up Display (HUD) Read Me


<iframe class=iframeReadMe src=http://rawgit.com/ladybug-tools/spider/master/gbxml-viewer/r13/gv-hud-heads-up-display/gv-hud.html width=100% height=400px >Iframes are not displayed on github.com</iframe>


## Full screen test: [gbXML Viewer Heads Up Display]( http://rawgit.com/ladybug-tools/spider/master/gbxml-viewer/r13/gv-hud-heads-up-display/gv-hud.html )


## Concept

Wikipedia: [Head-up display]( https://en.wikipedia.org/wiki/Head-up_display )

> A head-up display or heads-up display, also known as a HUD, is any transparent display that presents data without requiring users to look away from their usual viewpoints. The origin of the name stems from a pilot being able to view information with the head positioned "up" and looking forward, instead of angled down looking at lower instruments. A HUD also has the advantage that the pilot's eyes do not need to refocus to view the outside after looking at the optically nearer instruments.

> Although they were initially developed for military aviation, HUDs are now used in commercial aircraft, automobiles, and other (mostly professional) applications.

This feature could also be termed a '[context menu]( https://en.wikipedia.org/wiki/Context_menu )'.


## Features

* Toggle the display of 3D surfaces based on user input
* Highlight and toggle visibility of elements, surfaces, edges
	* Click menu items or use ALT + ZXCV keys
* Click on any surface in the model
	* View id, name, type CAD object id
	* View dimensions and area
	* Delete surface
* Select any surface from scrolling list to see it highlighted on screen and parameters displayed
* Reassign surface type and adjacent spaces for all surfaces
	* View adjacent space parameters
	* Toggle view of space and story
	* Select adjacent spaces from scrolling list
* Save edited data to a new gbXML file with updated document history


## Wish list

* 2018-03-06 ~ Add what you see upon open depends on current window inner height
	* 2018-03-05 ~ Goal: surface + two adjacent: all visible at once
* 2018-03-06 ~ Add 'match parameters of previously selected surface' buttons
* 2018-03-04 ~ Identify adjacent spaces
* 2018-01-02 ~ Multiple types of heads-up modules with different agendas
	* Show space names at cursor locations
* 2018-01-02 ~ Add in-world placard at cursor location




## Issues

Very occasionally the Three.js Shape function draws surfaces with openings incorrectly. This occurs when a border of an opening lies on top of a border of the surface. In other words the topology changes from an 'O' to a 'U'. Given that the Shape function handles the great majority of cases as anticipated, chasing down the cause and remedies of this issue loos like it may be a ongoing struggle.

The next steps may include
* Embedding a new shape drawing function that can be used to correct the errors

### Save File


### Surface type changes

The following cases need to be handled when changing the type of the surface

#### No adjacents

* From shade to shade: no change / OK
* From shade to single adjacent: display empty single adjacent space edit area / OK
* From shade to two adjacents: display two empty adjacent space areas / OK

#### Single adjacent

* From single to shade: remove adjacent / display none / OK
* From single to single: no change OK / OK
* From single to two adjacents: add adjacent space OK / display two empty adjacent space areas first with pre-existing adjacent OK /

#### Two adjacents

* From two to shade: remove both / display none OK /
* From two to single: remove 2nd OK / display 2nd OK /
* From two to two: no change OK / display two OK/


## Links of Interest


## Change Log

### 2018-05-14 ~ Theo

R13.19
* Add visible toggle to surface id

### 2018-05-13 ~ Theo

R13.18
* Add update cad object by group panel

Dealt with
* 2018-04-21 ~ CAD Objects by Type: what attribute info to add?
* 2018-03-04 ~ Use main style sheet? << there seem to be some curious issues with doing so

### 2018-04-21 ~ Theo

R13.6

### 2018-04-12 ~ Theo

R13.4
* Start HUD2
* baed on getting and setting
* Fingers crossed: simpler, more streamlined and easier t understand names


### 2018-04-02 ~ Theo

R13
* First commit
* Most everything appears to be working
* Add new style sheet theming
* Add new run html / mostly working in template test HTML file

***

<center title="hello!" >
# <a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > &#x1f578; </a>
</center>


