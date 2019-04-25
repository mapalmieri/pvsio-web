require.config({
    baseUrl: "./",
    paths: { d3: "./lib", text: "./lib/text" }
});

require([
    "widgets/TouchscreenButton",
    "widgets/BasicDisplay",
    "widgets/ButtonActionsQueue",
    "websockets/FMIClient"
], function (TouchscreenButton, BasicDisplay, ButtonActionsQueue, FMIClient) {
    "use strict";
    // callback function
    var PVSioStateParser = require("util/PVSioStateParser");
    var system = {};
    // input widget
    
	
		system.x_d = new BasicDisplay("x_d",{
		
		
		
		top: 20 
	},{
		
	},{parent:"image"});
	system.x_d.render(); 
		system.y_d = new BasicDisplay("y_d",{
		
		
		
		top: 120 
	},{
		
	},{parent:"image"});
	system.y_d.render(); 
		system.z_d = new BasicDisplay("z_d",{
		
		
		
		top: 220 
	},{
		
	},{parent:"image"});
	system.z_d.render(); 
	
	
	
	
	
	
	
	
	
	
	
		system.x_ant = new BasicDisplay("x_ant",{
		
		
		
		top: 320 
	},{
		
	},{parent:"image"});
	system.x_ant.render(); 
		system.x_succ = new BasicDisplay("x_succ",{
		
		
		
		top: 420 
	},{
		
	},{parent:"image"});
	system.x_succ.render(); 
	
	
	
    
    function onMessageReceived(err, res) {
		var state = {};
		state = PVSioStateParser.parse(res);
        
		system.x_d.render(PVSioStateParser.evaluate(state.x_d)); 
	
		system.y_d.render(PVSioStateParser.evaluate(state.y_d)); 
	
		system.z_d.render(PVSioStateParser.evaluate(state.z_d)); 
	
	
		system.x_ant.render(PVSioStateParser.evaluate(state.x_ant)); 
	
		system.x_succ.render(PVSioStateParser.evaluate(state.x_succ)); 
	
	
	
	
	
	
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
