/**
 * @module HelloWorld
 * @version 1.0
 * @author Paolo Masci
 * @date 14/01/2018
 * @description This tutorial introduces the basics for building interactive prototypes using the PVSio-web APIs.<br>
    You will learn:
    <li> The principles behind a PVSio-web prototype;</li>
    <li> How to create the visual appearance of an interactive prototype;</li>
    <li> How to load and execute the prototype in a web browser.</li>

    This tutorial assumes the reader is familiar with Javascript programming and HTML5 (see also <a href="https://www.w3schools.com/js" target=_blank>https://www.w3schools.com/js</a>).<br>
    Knowledge of Chrome DevTools (<a href="http://developer.chrome.com/devtools" target=_blank>http://developer.chrome.com/devtools</a>) or equivalent IDE is also recommended for building and debugging prototypes.

    <h4 style="margin-top:34px;margin-bottom:4px;font-weight:bold;">Principles</h4>
    All PVSio-web prototypes follow a Model-View-Controller (MVC) design pattern, which promotes clear separation between the behaviour of the prototype and
    its visual appearance:<br>
    <li>The behaviour of the prototype is defined using an executable formal model (e.g., a PVS model).
        A WebSocket server (the prototype back-end) hosts the environment for evaluating the formal model.</li>
    <li>The visual appearance is defined using Javascript/HTML5.
        A WebSocket client (the prototype front-end) executed within a web browser sends evaluation commands
        to the back-end based on user interactions with the widgets of the prototype.</li>
    This initial tutorial covers the definition of the visual appearance of the prototype.


    <h4 style="margin-top:34px;margin-bottom:4px;font-weight:bold;">Visual appearance of the prototype</h4>
    The visual appearance of the prototype builds on three elements:
    <li>a realistic picture of the device;</li>
    <li>a Javascript module, which captures user interactions with the prototype and renders the device state;</li>
    <li>an HTML file, for loading and executing the visual appearance of the prototype in a web browser.</li>

    <p>
    The prototype developed in this tutorial will be based on the following picture of a device with a screen and a home button:<br>
    <img src="device.png" style="width:100px;">
    </p>

    <p>
    The interactive widgets of the prototype are created in the Javascript module.<br>
    These widgets can be either <em>input widgets</em> (e.g., buttons, sliders), or <em>output widget</em> (e.g., digital displays).<br>
    In this tutorial, we will use a basic digital display, BasicDisplayEVO, from the <em>core</em> library of PVSio-web
    (see also <a href="../../../docs/widgets-library/core" target=_blank>docs/widgets-library/core</a>)
    </p>

    The steps for creating the display widget are as follows:<br>
    1. the widget library is imported programmatically in the Javascript file, using the <em>require</em> mechanism (see lines 1-5 in the code snippet below)<br>
    2. the widget is instantiated using the constructor method, which takes three arguments (lines 7-14 in the code snippet below):<br>
    <div style="padding-left: 20px;">
    <li>a unique identifier for the widget (in this case "disp")</li>
    <li>the position and size of the widget, given as an Object with four attributes:<br>
    <ol style="-webkit-margin-before:0px;-webkit-margin-after:0px;">
        - top (distance, in pixels, from the screen top);<br>
        - left (distance, in pixels, from the left side of the screen);<br>
        - height (height of the widget, in pixels);<br>
        - width (width of the widget, in pixels).
    </ol></li>
    <li>optional attributes for customising the visual aspect and functionalitied of the widget.</li></div>
    3. a <em>render</em> method is used to make the widget visible and render the string "Hello World!".<br>

    <p>
    The overall Javascript code is as follows (the code assumes the prototype files are stored in pvsio-web/examples/tutorials/HelloWorld):
    </p>

<pre class="prettyprint linenums"><code>require.config({
    baseUrl: "../../client/app",
    paths: { d3: "../lib/d3", text: "../lib/text" }
});
require([ "widgets/core/BasicDisplayEVO" ], function (BasicDisplay) {
    "use strict";
    var disp = new BasicDisplay("disp", {
        top: 62, left: 44, height: 410, width: 294
    }, {
        fontSize: 12, backgroundColor: "steelblue"
    });
    disp.render("Hello World!");
});</code></pre>

    <h4 style="margin-top:34px;margin-bottom:4px;font-weight:bold;">Loading and executing the prototype</h4>
    <p>
    The HTML code for loading the PVSio-web APIs and the Javascript file of the prototype in a web browser is as follows (the code assumes the prototype files are stored in pvsio-web/examples/tutorials/HelloWorld):
    </p>

    <pre class="prettyprint linenums"><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;meta charset="utf-8"&gt;
        &lt;meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"&gt;
        &lt;title&gt;&lt;/title&gt;
        &lt;meta name="description" content=""&gt;
        &lt;meta name="viewport" content="width=device-width"&gt;
        &lt;link href="../../client/lib/bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen"&gt;
        &lt;link href="../../client/css/style.css" rel="stylesheet" type="text/css"/&gt;
        &lt;link href="../../client/css/animate.css" rel="stylesheet" type="text/css"/&gt;
        &lt;link href="../../client/lib/jquery-toggles/css/toggles.css" rel="stylesheet"&gt;
        &lt;link href="../../client/lib/jquery-toggles/css/themes/toggles-modern.css" rel="stylesheet"&gt;
        &lt;link href="../../client/lib/bootstrap/css/bootstrap-slider.css" rel="stylesheet" type="text/css"/&gt;
    &lt;/head&gt;
    &lt;body class="noselect" style="background:#dedfdd;"&gt;
        &lt;div id="content" class="content"&gt;
            &lt;img src="device.png"&gt;
            &lt;div id="screen"&gt;
        &lt;/div&gt;
        &lt;script defer="true" src="../../client/lib/layout.js"&gt;&lt;/script&gt;
        &lt;script defer="true" src="../../client/lib/promise-0.1.1.js"&gt;&lt;/script&gt;
        &lt;script defer="true" src="../../client/lib/keys.js"&gt;&lt;/script&gt;
        &lt;script defer="true" src="../../client/lib/jquery.js"&gt;&lt;/script&gt;
        &lt;script defer="true" src="../../client/lib/underscore/underscore.js"&gt;&lt;/script&gt;
        &lt;script defer="true" src="../../client/lib/d3/d3.js"&gt;&lt;/script&gt;
        &lt;script defer="true" src="../../client/lib/backbone.js"&gt;&lt;/script&gt;
        &lt;script defer="true" src="../../client/lib/handlebars-v1.3.0.js"&gt;&lt;/script&gt;
        &lt;script defer="true" src="../../client/lib/bootstrap/js/bootstrap.min.js"&gt;&lt;/script&gt;
        &lt;script defer="true" src="../../client/lib/jquery-toggles/toggles.min.js"&gt;&lt;/script&gt;
        &lt;script defer="true" src="../../client/lib/bootstrap/js/bootstrap-slider.js"&gt;&lt;/script&gt;

        &lt;script defer="true" src="../../client/require.js" data-main="index.js"&gt;&lt;/script&gt;
    &lt;/body&gt;
&lt;/html&gt;</code></pre>

    To execute the prototype, start the PVSio-web back-end, and then open a web browser at the following page: <a href="http://www.pvsioweb.org/tutorials/HelloWorld" target=_blank>http://www.pvsioweb.org/tutorials/HelloWorld</a><br>
    The output rendered in the browser is as follows:<br>
    <img src="final-prototype.png" style="width:200px;"><br>

    <h4 style="margin-top:34px;margin-bottom:4px;font-weight:bold;">Final remarks</h4>
    The position and size of the widgets depend on the image of the prototype.
    To identify the values of attributes top, left, height and width necessary to set
    the correct position and size of the widgets, use the following pragmatic method:
    <li>set the initial position of the widget to the left-top corner of the screen (top: 0, left:0)</li>
    <li>use Chrome DevTools (or equivalent IDE) to inspect the HTML code (the widget can be easily found in the html code by searching the widget identifier) and adjust position and size interactively with DevTools Style editor.</li><br>
    <img src="dev-tools.png">

    <h4 style="margin-top:34px;margin-bottom:4px;font-weight:bold;">Coming next...</h4>
    In the next tutorial (<a href="../../Toggle/docs/index.html">Toggle</a>), you will learn how to make the prototype responsive to user actions.
 *
 */
/* jslint esnext:true */
require.config({
    baseUrl: "../../client/app",
    paths: { d3: "../lib/d3", text: "../lib/text" }
});

require([ "plugins/FMI/PBFMIPVSPrinter" ], function (PBFMIPVSPrinter) {
    "use strict";
    
    /*fino a value sono campi obbligatori, dopo sono facoltativi*/
    var statevariables = [
		
		{name:"id", type:"string",variability: "discrete", scope:"output", value:"0"},
		{name:"topline", type:"string",variability: "discrete", scope:"output", value:"0"},
		{name:"middisp ", type:"string",variability: "discrete", scope:"output", value:"0"},
		{name:"middisp_drate", type:"bool",variability: "discrete", scope:"output", value:"0"},
		{name:"middisp_dvtbi", type:"bool",variability: "discrete", scope:"output", value:"0"},
		{name:"middisp_dvol", type:"bool",variability: "discrete", scope:"output", value:"0"},
		{name:"middisp_dtime", type:"bool",variability: "discrete", scope:"output", value:"0"},
		{name:"middisp_dnewrate", type:"bool",variability: "discrete", scope:"output", value:"0"},
		{name:"middisp_dnewvtbi", type:"bool",variability: "discrete", scope:"output", value:"0"},
		{name:"middisp_dnewtime", type:"bool",variability: "discrete", scope:"output", value:"0"},
		{name:"middisp_dbags", type:"bool",variability: "discrete", scope:"output", value:"0"},
		{name:"optionsmenu", type:"string",variability: "discrete", scope:"output", value:"0"},
		{name:"bagscursor", type:"int",variability: "discrete", scope:"output", value:"0"},
		{name:"qcursor", type:"int",variability: "discrete", scope:"output", value:"0"},
		{name:"bagsval ", type:"string",variability: "discrete", scope:"output", value:"0"},
		{name:"bagsval0", type:"int",variability: "discrete", scope:"output", value:"0"},
		{name:"bagsval1", type:"int",variability: "discrete", scope:"output", value:"0"},
		{name:"bagsval2", type:"int",variability: "discrete", scope:"output", value:"0"},
		{name:"bagsval3", type:"int",variability: "discrete", scope:"output", value:"0"},
		{name:"bagsval4", type:"int",variability: "discrete", scope:"output", value:"0"},
		{name:"bagsval5", type:"int",variability: "discrete", scope:"output", value:"0"},
		{name:"bagsval6", type:"int",variability: "discrete", scope:"output", value:"0"},
		{name:"bagsval7", type:"int",variability: "discrete", scope:"output", value:"0"},
		{name:"bagsval8", type:"int",variability: "discrete", scope:"output", value:"0"},
		{name:"bagsval9", type:"int",variability: "discrete", scope:"output", value:"0"},
		{name:"fndisp1", type:"string",variability: "discrete", scope:"output", value:"0"},
		{name:"fndisp2", type:"string",variability: "discrete", scope:"output", value:"0"},
		{name:"fndisp3", type:"string",variability: "discrete", scope:"output", value:"0"},
		{name:"runlight", type:"bool",variability: "discrete", scope:"output", value:"0"},
		{name:"pauselight", type:"bool",variability: "discrete", scope:"output", value:"0"},
		{name:"ac_light", type:"bool",variability: "discrete", scope:"output", value:"0"},
		{name:"battery_light", type:"bool",variability: "discrete", scope:"output", value:"0"},
		{name:"entrymode", type:"string",variability: "discrete", scope:"output", value:"0"},
		{name:"rlock", type:"bool",variability: "discrete", scope:"output", value:"0"},
		{name:"rdisabled", type:"bool",variability: "discrete", scope:"output", value:"0"},
		{name:"newvtbi", type:"real",variability: "discrete", scope:"output", value:"0"},
		{name:"newrate", type:"real",variability: "discrete", scope:"output", value:"0"},
		{name:"newtime", type:"real",variability: "discrete", scope:"output", value:"0"},
		{name:"pressed", type:"bool",variability: "discrete", scope:"output", value:"0"},
		{name:"current_sr", type:"bool",variability: "discrete", scope:"output", value:"0"},
		{name:"current_sv", type:"bool",variability: "discrete", scope:"output", value:"0"},
		{name:"current_st", type:"bool",variability: "discrete", scope:"output", value:"0"},
		{name:"which_press", type:"string",variability: "discrete", scope:"output", value:"0"},
		{name:"supercmd", type:"string",variability: "discrete", scope:"input", value:"0"},		
				
	];
	
	
	var composedvariables = [
	{name: "ac_connect", parent:"device", type:"bool", variability: "discrete", scope: "output", value: "0"},
	{name: "battery",parent:"device", type:"real", variability: "discrete", scope: "output", value: "0"},
	{name: "elapse ", parent:"device", type:"real", variability: "discrete", scope: "output", value: "0"},
	{name: "elapsedtime",parent:"device", type:"real", variability: "discrete", scope: "output", value: "0"},
	{name: "infusing?", parent:"device", type:"bool", variability: "discrete", scope: "output", value: "0"},
	{name: "infusionrate",parent:"device", type:"real", variability: "discrete", scope: "output", value: "0"},
	{name: "kvoflag", parent:"device", type:"bool", variability: "discrete", scope: "output", value: "0"},
	{name: "kvorate",parent:"device", type:"real", variability: "discrete", scope: "output", value: "0"},
	{name: "powered_on?", parent:"device", type:"bool", variability: "discrete", scope: "output", value: "0"},
	{name: "set_fitted",parent:"device", type:"bool", variability: "discrete", scope: "output", value: "0"},
	{name: " time", parent:"device", type:"real", variability: "discrete", scope: "output", value: "0"},
	{name: "volumeinfused",parent:"device", type:"real", variability: "discrete", scope: "output", value: "0"},
	{name: "vtbi",parent:"device", type:"real", variability: "discrete", scope: "output", value: "0"},
	]
	
	var functionvariablesinput = [
		]
	
	var functionvariablesoutput = [
		]
	
	
    
	
    var printer = new PBFMIPVSPrinter();
    printer.create_FMU("AlarisGPFMI",{state_variables : {variables: statevariables},composed_variables : {variables: composedvariables}, function_variables_input : {variables: functionvariablesinput},function_variables_output : {variables: functionvariablesoutput}, init:"init(keep)", tick:"FMItick", port:"8088", max_memory:"2500", delay: "18000000"});
    //printer.print_front(fmi,null,null);
});
