require.config({
    baseUrl: "./",
       paths: {
        d3: "./lib/d3",
        "pvsioweb": "plugins/prototypebuilder",
        "imagemapper": "./lib/imagemapper",
        "text": "./lib/text",
        "lib": "./lib",
        "cm": "./lib/cm",
        stateParser: './util/PVSioStateParser',
        NCDevice: 'plugins/networkController/NCDevice'
    }
});

require([
    "widgets/TouchscreenButton",
    "widgets/BasicDisplay",
    "widgets/ButtonActionsQueue",
    "widgets/core/ButtonEVO",
    "widgets/LED",
    "widgets/TracingsDisplay",
    "widgets/med/PatientMonitorDisplay",
    "websockets/FMIClient"
], function (TouchscreenButton, BasicDisplay, ButtonActionsQueue,Button,
              LED,
              TracingsDisplay,
              PatientMonitorDisplay, FMIClient) {
    "use strict";
    // callback function
    var PVSioStateParser = require("util/PVSioStateParser");
    var system = {};
    // input widget
    
    system.accelerate = new TouchscreenButton("accelerate", {
        top: 362, 
        left: 288,
        height: 30, 
        width: 25 
    }, {
        
        
		
		 backgroundColor: "transparent", 
		callback: onMessageReceived 
    }, {
            parent: "image"
	});
    
    system.accelerate.render();
    
    system.brake = new TouchscreenButton("brake", {
        top: 412, 
        left: 288,
        height: 30, 
        width: 25 
    }, {
        
        
		
		 backgroundColor: "transparent", 
		callback: onMessageReceived 
    }, {
            parent: "image"
	});
    
    system.brake.render();
    
	
	
	
		system.servoLeftVal = new BasicDisplay("servoLeftVal",{
		
		left: 250, 
		width: 100, 
		top: 160 
	},{
		 backgroundColor: "transparent", 
	},{parent:"image"});
	system.servoLeftVal.render(); 
		system.servoRightVal = new BasicDisplay("servoRightVal",{
		
		left: 450, 
		width: 100, 
		top: 160 
	},{
		 backgroundColor: "transparent", 
	},{parent:"image"});
	system.servoRightVal.render(); 
	
	
	
	
		system.lfLeftVal = new BasicDisplay("lfLeftVal",{
		
		left: 250, 
		width: 100, 
		top: 60 
	},{
		 backgroundColor: "transparent", 
	},{parent:"image"});
	system.lfLeftVal.render(); 
		system.lfRightVal = new BasicDisplay("lfRightVal",{
		
		left: 450, 
		width: 100, 
		top: 60 
	},{
		 backgroundColor: "transparent", 
	},{parent:"image"});
	system.lfRightVal.render(); 
	
	
	
    
    
    // utility function
        function evaluate(str) {
            var v = +str;
            if (str.indexOf("/") >= 0) {
                var args = str.split("/");
                v = +args[0] / +args[1];
            }
            return (v <= 0) ? "--" : ((v < 10) ? v.toFixed(1).toString() : v.toFixed(0).toString());
        }
    
    function onMessageReceived(err, res) {
		var state = {};
		state = PVSioStateParser.parse(res);
        
	
		system.lfLeftVal.render(PVSioStateParser.evaluate(state.lfLeftVal)); 
	
		system.lfRightVal.render(PVSioStateParser.evaluate(state.lfRightVal)); 
		system.servoLeftVal.render(PVSioStateParser.evaluate(state.servoLeftVal)); 
	
		system.servoRightVal.render(PVSioStateParser.evaluate(state.servoRightVal)); 
	
	
	
    }

	
    // web socket client
    var client = FMIClient.getInstance();
    client.port("8084");
    client.addListener("WebSocketConnectionOpened", function (res) {
        console.log("Connection opened!");
    }).addListener("WebSocketConnectionClosed", function (evt) {
        console.log("Connection closed :((");
    });
    //client.connectToServer();
     var tick;
        function start_tick(interval) {
            if (!tick) {
                tick = setInterval(function () {
                    ButtonActionsQueue.getInstance().queueGUIAction("tick", onMessageReceived);
                }, interval);
            }
        }
        function stop_tick() {
            if (tick) {
                clearInterval(tick);
                tick = null;
            }
        }
        start_tick(250);
});
