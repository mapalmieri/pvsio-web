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
    
    system.btn_on = new TouchscreenButton("btn_on", {
        top: 112, 
        left: 364,
        
        
    }, {
        
        
		
		 backgroundColor: "transparent", 
		callback: onMessageReceived 
    }, {
            parent: "image"
	});
    
    system.btn_on.render();
    
	
	
		system.spo2 = new BasicDisplay("spo2",{
		
		
		width: 300, 
		top: 120 
	},{
		
	},{parent:"image"});
	system.spo2.render(); 
		system.spo2_max = new BasicDisplay("spo2_max",{
		
		
		width: 300, 
		top: 220 
	},{
		
	},{parent:"image"});
	system.spo2_max.render(); 
		system.spo2_min = new BasicDisplay("spo2_min",{
		
		
		width: 300, 
		top: 320 
	},{
		
	},{parent:"image"});
	system.spo2_min.render(); 
		system.spo2_label = new BasicDisplay("spo2_label",{
		
		
		width: 300, 
		top: 420 
	},{
		
	},{parent:"image"});
	system.spo2_label.render(); 
		system.spo2_alarm = new BasicDisplay("spo2_alarm",{
		
		
		width: 300, 
		top: 520 
	},{
		
	},{parent:"image"});
	system.spo2_alarm.render(); 
		system.spo2_fail = new BasicDisplay("spo2_fail",{
		
		
		width: 300, 
		top: 620 
	},{
		
	},{parent:"image"});
	system.spo2_fail.render(); 
		system.rra = new BasicDisplay("rra",{
		
		
		width: 300, 
		top: 720 
	},{
		
	},{parent:"image"});
	system.rra.render(); 
		system.rra_max = new BasicDisplay("rra_max",{
		
		
		width: 300, 
		top: 820 
	},{
		
	},{parent:"image"});
	system.rra_max.render(); 
		system.rra_min = new BasicDisplay("rra_min",{
		
		
		width: 300, 
		top: 920 
	},{
		
	},{parent:"image"});
	system.rra_min.render(); 
		system.rra_label = new BasicDisplay("rra_label",{
		
		
		width: 300, 
		top: 1020 
	},{
		
	},{parent:"image"});
	system.rra_label.render(); 
		system.rra_alarm = new BasicDisplay("rra_alarm",{
		
		
		width: 300, 
		top: 1120 
	},{
		
	},{parent:"image"});
	system.rra_alarm.render(); 
		system.rra_fail = new BasicDisplay("rra_fail",{
		
		
		width: 300, 
		top: 1220 
	},{
		
	},{parent:"image"});
	system.rra_fail.render(); 
		system.isOn = new BasicDisplay("isOn",{
		
		
		width: 300, 
		top: 1320 
	},{
		
	},{parent:"image"});
	system.isOn.render(); 
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
    
    function onMessageReceived(err, res) {
		var state = {};
		state = PVSioStateParser.parse(res);
        
	
	
		system.spo2.render(PVSioStateParser.evaluate(state.spo2)); 
	
		system.spo2_max.render(PVSioStateParser.evaluate(state.spo2_max)); 
	
		system.spo2_min.render(PVSioStateParser.evaluate(state.spo2_min)); 
	
		system.spo2_label.render(PVSioStateParser.evaluate(state.spo2_label)); 
	
		system.spo2_alarm.render(PVSioStateParser.evaluate(state.spo2_alarm)); 
	
		system.spo2_fail.render(PVSioStateParser.evaluate(state.spo2_fail)); 
	
		system.rra.render(PVSioStateParser.evaluate(state.rra)); 
	
		system.rra_max.render(PVSioStateParser.evaluate(state.rra_max)); 
	
		system.rra_min.render(PVSioStateParser.evaluate(state.rra_min)); 
	
		system.rra_label.render(PVSioStateParser.evaluate(state.rra_label)); 
	
		system.rra_alarm.render(PVSioStateParser.evaluate(state.rra_alarm)); 
	
		system.rra_fail.render(PVSioStateParser.evaluate(state.rra_fail)); 
	
		system.isOn.render(PVSioStateParser.evaluate(state.isOn)); 
	
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
