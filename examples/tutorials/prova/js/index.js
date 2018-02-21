require.config({
    baseUrl: "./",
    paths: { d3: "./lib", text: "./lib/text" }
});

require([
    "widgets/TouchscreenButton",
    "widgets/BasicDisplay",
    "websockets/FMIClient"
], function (TouchscreenButton, BasicDisplay, FMIClient) {
    "use strict";
    // callback function
    var PVSioStateParser = require("util/PVSioStateParser");
    var system = {};
    // input widget
    
    system.accelerate = new TouchscreenButton("accelerate", {
        top: 493, 
        left: 168,
        height: 54, 
        width: 54 
    }, {
        
        
		
		
		callback: onMessageReceived 
    }, {
            parent: "image"
	});
    
    system.accelerate.render();
    
    system.brake = new TouchscreenButton("brake", {
        top: 293, 
        left: 168,
        height: 54, 
        width: 54 
    }, {
        
        
		
		 backgroundColor: "Red", 
		callback: onMessageReceived 
    }, {
            parent: "image"
	});
    
    system.brake.render();
    
	
	
	
		system.servoLeftVal = new BasicDisplay("servoLeftVal",{
		top: 20 
	
	
	},{},{parent:"image"});
	system.servoLeftVal.render(); 
		system.servoRightVal = new BasicDisplay("servoRightVal",{
		top: 120 
	
	
	},{},{parent:"image"});
	system.servoRightVal.render(); 
	
    
    function onMessageReceived(err, res) {
		var state = {};
		state = PVSioStateParser.parse(res);
        
	
	
		system.servoLeftVal.render(state.servoLeftVal); 
		system.servoRightVal.render(state.servoRightVal); 
	
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
});
