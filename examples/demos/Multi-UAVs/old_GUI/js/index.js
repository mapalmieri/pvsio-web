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
    	
    	
    	//creo 5 oggetti navigatore, uno per ogni drone, tutti uno sopra l'altro e tutti trasparenti
    	// in modo da avere l'effetto di un navigatore solo con 5 elementi che si muovono
	 system.navigator = new Navigator("nav-display",
                {
                    top: 0,
                    left: 0,
                    width: 900,
                    height: 900
                }, {
                    // autoscale: true,
                    
		            maxX: 11,
                    maxY: 11,
                   
         		    arrowStartName:"start-arrow",
        		    arrowStartUrl:"url(#start-arrow)",                  
                    arrowEndUrl: "url(#end-arrow)",
                    lineColor: "blue",
                    arrowColor: "blue",
                    backgroundColor: "transparent"
                },{
					parent: "image"});
    //system.navigator.reveal();
    
                
    system.navigator2 = new Navigator("nav-display",
                {
                    top: 0,
                    left: 0,
                    width: 900,
                    height: 900
                }, {
                    // autoscale: true,
                    
		            maxX: 11,
                    maxY: 11,
                    
        		    arrowStartName:"start-arrow2",
        		    arrowStartUrl:"url(#start-arrow2)",                    
                    arrowEndName: "end-arrow2",
        		    arrowEndUrl: "url(#end-arrow2)",
        		    backgroundColor: "transparent",
        		    arrowColor: "orange",
                    lineColor: "orange"
                },{
					parent: "image"});
   // system.navigator2.reveal();
    system.navigator3 = new Navigator("nav-display",
                {
                    top: 0,
                    left: 0,
                    width: 900,
                    height: 900
                }, {
                    // autoscale: true,
                    
		            maxX: 11,
                    maxY: 11,
                    
        		    arrowStartName:"start-arrow3",
        		    arrowStartUrl:"url(#start-arrow3)",                    
        		    arrowEndName: "end-arrow3",
        		    arrowEndUrl: "url(#end-arrow3)",
        		    backgroundColor: "transparent",
        		    arrowColor: "green",
                    lineColor: "green"
                },{
					parent: "image"});
    // system.navigator3.reveal();           
     system.navigator4 = new Navigator("nav-display",
                {
                    top: 0,
                    left: 0,
                    width: 900,
                    height: 900
                }, {
                    // autoscale: true,
                    
		            maxX: 11,
                    maxY: 11,
                   
                    arrowStartName:"start-arrow4",
        		    arrowStartUrl:"url(#start-arrow4)",
        		    arrowEndName: "end-arrow4",
        		    arrowEndUrl: "url(#end-arrow4)",
        		    backgroundColor: "transparent",
        		    arrowColor: "red",
                    lineColor: "red"
                },{
					parent: "image"});
     //system.navigator4.reveal();
     system.navigator5 = new Navigator("nav-display",
                {
                    top: 0,
                    left: 0,
                    width: 900,
                    height: 900
                }, {
                    // autoscale: true,
                    
		            maxX: 11,
                    maxY: 11,
                   
        		    arrowEndName: "end-arrow5",
        		    arrowEndUrl: "url(#end-arrow5)",
        		    arrowStartName:"start-arrow5",
        		    arrowStartUrl:"url(#start-arrow5)",
        		    backgroundColor: "transparent",
        		    arrowColor: "purple",
                    lineColor: "purple"
                },{
					parent: "image"});
    //system.navigator5.reveal();
        
    
    function onMessageReceived(err, res) {
		var state = {};
		state = PVSioStateParser.parse(res);
        // c'e' scritto y, ma la uso come z
        // ad ogni messaggio che ricevo faccio la render di tutti i 5 navigatori con le nuove posizioni
	
		
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
