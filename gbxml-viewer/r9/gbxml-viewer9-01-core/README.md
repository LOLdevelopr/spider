<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( http://www.ladybug.tools/spider/index.html#gbxml-viewer/r9/gbxml-viewer9-01-core/README.md "View file as a web page." ) </span>


# gbXML Viewer9 Core Read Me

<iframe class=iframeReadMe src=http://www.ladybug.tools/spider/gbxml-viewer/r9/gbxml-viewer9-01-core/gbxml-viewer9-core.html width=100% height=600px;  >Iframes are not displayed on github.com</iframe>

## Full screen [gbXML Viewer9 Core]( http://www.ladybug.tools/spider/gbxml-viewer/r9/gbxml-viewer9-01-core/gbxml-viewer9-core.html )

## Full screen [gbXML Viewer9 Core Robust]( http://www.ladybug.tools/spider/gbxml-viewer/r9/gbxml-viewer9-01-core/gbxml-viewer9-core-robust.html )

* 'Robust' is a special version of gbXML Viewer for very large files
* Click 'choose file' to select a file. Then wait until all the bytes have been loaded - at least a full minute
* And then wait a bit more and then click 'parse gbXML'
* Also a good idea to refresh the page prior to loading file and to have the JavaScript console open

## Full screen test [Test gbXML Viewer9 Core]( http://www.ladybug.tools/spider/gbxml-viewer/r9/gbxml-viewer9-01-core/test-gbxml-viewer9-core.html )


## Concept

The core or template file to be used to read gbXML files and display them in 3D

* Built upon the [Three.js]( https://threejs.org ) 3D JavaScript library
* Under 600 lines of code
* Plan-vanilla JavaScript
	* 90% easy-peasy JavaScript and 10% gnarly, linear algebra JavaScript
* Accepts URLs of files to view via [location.hash]( https://www.w3schools.com/jsref/prop_loc_hash.asp )
	* useful in creating [permalinks]( https://en.wikipedia.org/wiki/Permalink )
* Accepts and displays XML text data via its parseFileXML function
	* May be data sent by an iframe parent
	* May be date acquired by the HTML5 file reader tag

## Sample files to load

* [golden-co-open-studio-seb.xml]( http://www.ladybug.tools/spider/gbxml-viewer/#https://rawgit.com/ladybug-tools/spider/master/gbxml-viewer/gbxml-sample-files/golden-co-open-studio-seb.xml )
* [london-office.xml]( http://www.ladybug.tools/spider/gbxml-viewer/#https://rawgit.com/ladybug-tools/spider/master/gbxml-viewer/gbxml-sample-files/london-office.xml )
* [omha-nb-zneth.xml]( http://www.ladybug.tools/spider/gbxml-viewer/#https://rawgit.com/ladybug-tools/spider/master/gbxml-viewer/gbxml-sample-files/omha-nb-zneth.xml )



## Running Files locally

With gbXML Viewer you may link to local files on your hard drive if you are running gbXML Viewer locally.

For example if you have both gbXML Viewer9 Core and a gbXML file in the root folder of drive D in a browser running on Microsoft Windows, then the URL might look like this:

* file:///D:/gbxml-viewer9-core-02.html#file:///D:/open-studio-seb.xml

Using a remotely hosted gbXML Viewer - such as hosted on GitHub - to load files off your hard drive is much more of an issue because of security concerns.


### Setting up a local file viewer

Go to this link:

* <https://raw.githubusercontent.com/ladybug-tools/spider/master/gbxml-viewer/r9/gbxml-viewer9-01-core/gbxml-viewer9-core.html>

Open the Context Menu ( right-click menu ) in your main browser window and click on 'Save As'

Once the file is saved to your hard disk, you should be able to open it just as you might do with any HTML file on your computer.

When you load the file, it will display a sample file from the sample folder.

Now you can edit the URL in the address bar: add a '#' followed by the URL for any local XML file on your device. BTW, the easiest method to obtain the URL for a local file is to drag the xml file into your browser. Your browser will creates local file URLs automatically.

Also, if you are careful, you can use a relative path such as: <viewer-script.html>#../../data-files/test.xml.

2017-12-02 ~ Currently the Core script seems to be working as desired and the App script is not working. Efforts will be made to get all the gbXML Viewer scripts runnable both from a server and locally on a computer or mobile device.

The ultimate goal is to be able to offer various analytical batch operations that run either locally or in the cloud.



## Change Log

See also main gbXML README.md

### 2018-02-08 ~

R9.8
* Add checks for duplicate extra vertices in gbXML file vertices data

### 2018-02-02 ~ Theo

R9.6
* Add global gbxml variable
* Clear divLog when view is reset

### 2018-01-27 ~ Theo

* R 9.5
* Core: drop createReport
* App: add onloadThreejs to update report with each new file load

### 2018-01-01 ~ Theo

* Update to R9

### 2017-12-16 ~ Theo

* Add 'Robust' version

### 2017-12-10 ~ Theo

* Add new test file
* Fix links in read me


### 2017-12-03 ~ Theo

Show different methods to load gbXML files anf display in 3D in an iframe
* Add test-gbxml-viewer9-template.html
* Add test-gbxml-viewer9-template.js


### 2017-12-02 ~ Theo

* Update Read Me
	* Add local file viewing info
* Update Core description
* Core R2
	* rename campusSurface to surfaceMeshes < used everyhere so needed new title so as not to break everything
* Rename and update window onload things
* Add: surfaceMeshes.name = 'surfaceMeshes';
* Add: uriGbxmlDefault =  location.protocol === 'file:' ? etc to load cload file when local and local (to cloud) file when in cloud. So there is always something to see


### 2017-12-01 ~ Theo

* Code clean-up
* Update readme

### 2017-11-29 ~ Theo

* Add sample links to read me
* Minor simplification to basic


### 2017-11-16 ~ Theo

* sam-live2.xml set as default file to view
* comment out even generators


### 2017-11-14 ~ Theo

* Renamed to 'gbXML Viewer7 Basic'
* Added ability display files from JavaScript file reader
* Added parent.onloadGbjson()
