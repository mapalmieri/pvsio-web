require.config({
    baseUrl: "./",
    paths: { d3: "./lib", text: "./lib/text" }
});

require([
    "widgets/TouchscreenButton",
    "widgets/BasicDisplay",
    "widgets/car/Navigator",
    "widgets/ButtonActionsQueue",
    "websockets/FMIClient"
], function (TouchscreenButton, BasicDisplay,  Navigator, ButtonActionsQueue, FMIClient) {
    "use strict";
    // callback function
    var PVSioStateParser = require("util/PVSioStateParser");
    var system = {};
    // input widget
    
	
	
	
	
	
	
	
	
	
	
	
	
	
	
		//system.x1 = new BasicDisplay("x1",{
		
		
		//width: 300, 
		//top: 20 
	//},{
		
	//},{parent:"image"});
	//system.x1.render(); 
		//system.z1 = new BasicDisplay("z1",{
		
		//left: 500, 
		//width: 300, 
		//top: 20 
	//},{
		
	//},{parent:"image"});
	//system.z1.render(); 
		//system.x2 = new BasicDisplay("x2",{
		
		
		//width: 300, 
		//top: 120 
	//},{
		
	//},{parent:"image"});
	//system.x2.render(); 
		//system.z2 = new BasicDisplay("z2",{
		
		//left: 500, 
		//width: 300, 
		//top: 120 
	//},{
		
	//},{parent:"image"});
	//system.z2.render(); 
		//system.x3 = new BasicDisplay("x3",{
		
		
		//width: 300, 
		//top: 220 
	//},{
		
	//},{parent:"image"});
	//system.x3.render(); 
		//system.z3 = new BasicDisplay("z3",{
		
		//left: 500, 
		//width: 300, 
		//top: 220 
	//},{
		
	//},{parent:"image"});
	//system.z3.render(); 
		//system.x4 = new BasicDisplay("x4",{
		
		
		//width: 300, 
		//top: 320 
	//},{
		
	//},{parent:"image"});
	//system.x4.render(); 
		//system.z4 = new BasicDisplay("z4",{
		
		//left: 500, 
		//width: 300, 
		//top: 320 
	//},{
		
	//},{parent:"image"});
	//system.z4.render(); 
		//system.x5 = new BasicDisplay("x5",{
		
		
		//width: 300, 
		//top: 420 
	//},{
		
	//},{parent:"image"});
	//system.x5.render(); 
		//system.z5 = new BasicDisplay("z5",{
		
		//left: 500, 
		//width: 300, 
		//top: 420 
	//},{
		
	//},{parent:"image"});
	//system.z5.render(); 
	
	 system.navigator = new Navigator("nav-display",
                {
                    top: 0,
                    left: 0,
                    width: 900,
                    height: 900
                }, {
                    // autoscale: true,
                    
		            maxX: 10,
                    maxY: 10,
                   
                    lineColor: "blue",
                    arrowColor: "blue",
                    backgroundColor: "transparent"
                },{
					parent: "image"});
    system.navigator.reveal();
    
                
    system.navigator2 = new Navigator("nav-display",
                {
                    top: 0,
                    left: 0,
                    width: 900,
                    height: 900
                }, {
                    // autoscale: true,
                    
		            maxX: 10,
                    maxY: 10,
                    
        		    
        		    backgroundColor: "transparent",
        		    arrowColor: "blue",
                    lineColor: "blue"
                },{
					parent: "image"});
    system.navigator2.reveal();
    system.navigator3 = new Navigator("nav-display",
                {
                    top: 0,
                    left: 0,
                    width: 900,
                    height: 900
                }, {
                    // autoscale: true,
                    
		            maxX: 10,
                    maxY: 10,
                    
        		    
        		    backgroundColor: "transparent",
        		    arrowColor: "blue",
                    lineColor: "blue"
                },{
					parent: "image"});
     system.navigator3.reveal();           
     system.navigator4 = new Navigator("nav-display",
                {
                    top: 0,
                    left: 0,
                    width: 900,
                    height: 900
                }, {
                    // autoscale: true,
                    
		            maxX: 10,
                    maxY: 10,
                   
        		    
        		    backgroundColor: "transparent",
        		    arrowColor: "blue",
                    lineColor: "blue"
                },{
					parent: "image"});
     system.navigator4.reveal();
     system.navigator5 = new Navigator("nav-display",
                {
                    top: 0,
                    left: 0,
                    width: 900,
                    height: 900
                }, {
                    // autoscale: true,
                    
		            maxX: 10,
                    maxY: 10,
                   
        		    
        		    backgroundColor: "transparent",
        		    arrowColor: "blue",
                    lineColor: "blue"
                },{
					parent: "image"});
    system.navigator5.reveal();
        
    
    function onMessageReceived(err, res) {
		var state = {};
		state = PVSioStateParser.parse(res);
        
	
		//system.x1.render(PVSioStateParser.evaluate(state.x1)); 
	
		//system.z1.render(PVSioStateParser.evaluate(state.z1)); 
	
		//system.x2.render(PVSioStateParser.evaluate(state.x2)); 
	
		//system.z2.render(PVSioStateParser.evaluate(state.z2)); 
	
		//system.x3.render(PVSioStateParser.evaluate(state.x3)); 
	
		//system.z3.render(PVSioStateParser.evaluate(state.z3)); 
	
		//system.x4.render(PVSioStateParser.evaluate(state.x4)); 
	
		//system.z4.render(PVSioStateParser.evaluate(state.z4)); 
	
		//system.x5.render(PVSioStateParser.evaluate(state.x5)); 
	
		//system.z5.render(PVSioStateParser.evaluate(state.z5));
		
		system.navigator.render([{ x: PVSioStateParser.evaluate(state.x1) , y: PVSioStateParser.evaluate(state.z1)  }]);
		
		system.navigator2.render([{ x: PVSioStateParser.evaluate(state.x2) , y: PVSioStateParser.evaluate(state.z2)  }]);
		
		system.navigator3.render([{ x: PVSioStateParser.evaluate(state.x3) , y: PVSioStateParser.evaluate(state.z3)  }]);
		
		system.navigator4.render([{ x: PVSioStateParser.evaluate(state.x4) , y: PVSioStateParser.evaluate(state.z4)  }]);
		
		system.navigator5.render([{ x: PVSioStateParser.evaluate(state.x5) , y: PVSioStateParser.evaluate(state.z5)  }]);
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
