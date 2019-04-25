require.config({
    baseUrl: "./",
       paths: {
        d3: "lib/d3",
        "pvsioweb": "plugins/prototypebuilder",
        "imagemapper": "lib/imagemapper",
        "text": "lib/text",
        "lib": "lib",
        "cm": "lib/cm",
        stateParser: 'util/PVSioStateParser',
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
    
   system.btn_on = new Button("FMIbtn_on", {
            top: 112, left: 364
        }, { callback: onMessageReceived });
    
    system.btn_on.render();
	
        system.spo2_display = new PatientMonitorDisplay("spo2_display",
            {top: 56, left: 150, height: 34, width: 160},{label: "#SpO2"},
            {parent: "image" });
        system.HR_display = new PatientMonitorDisplay("HR_display",
            {top: 102, left: 150, height: 34, width: 160},{label: "HR", fontColor: "aqua"},
            {parent: "image" });
            
        
        
        // utility function
        function evaluate(str) {
            var v = +str;
            if (str.indexOf("/") >= 0) {
                var args = str.split("/");
                v = +args[0] / +args[1];
            }
            return (v <= 0) ? "--" : ((v < 10) ? v.toFixed(1).toString() : v.toFixed(0).toString());
        }

        // spo2
        function render_spo2(res) {
            if (res.isOn === "TRUE") {
                system.spo2_display.set_alarm({min: parseFloat(res.spo2_min), max: parseFloat(res.spo2_max)});
                system.spo2_display.set_range({min: 0, max: 120});
                if (res.spo2_fail === "FALSE") {
                    if (res.spo2_alarm === "off") {
                        system.spo2_display.render(evaluate(res.spo2));
                    } else {
                        system.spo2_display.render(evaluate(res.spo2), {fontColor: "red"});
                    }
                } else {
                    system.spo2_display.fail("FAIL");
                }
                
            } else {
                system.spo2_display.hide();
                //stop_tick();
            }
        }

        // HR
        function render_HR(res) {
            if (res.isOn === "TRUE") {
                system.HR_display.set_alarm({min: parseFloat(res.HR_min), max: parseFloat(res.HR_max)});
                system.HR_display.set_range({min: 0, max: 120});
                if (res.HR_fail === "FALSE") {
                    if (res.HR_alarm === "off") {
                        system.HR_display.render(evaluate(res.HR));
                    } else {
                        system.HR_display.render(evaluate(res.HR), {fontColor: "red"});
                    }
                } else {
                    system.HR_display.fail("FAIL");
                }
               
            } else {
                system.HR_display.hide();
                //stop_tick();
            }
        }
	
	
	function render_alarms(res) {
            if (res.isOn === "TRUE") {
                if (res.spo2_alarm === "off") {
                    system.spo2_display.alarm("off");
                } else if (res.spo2_alarm === "alarm") {
                    system.spo2_display.alarm("glyphicon-bell");
                } else if (res.spo2_alarm === "mute") {
                    system.spo2_display.alarm("glyphicon-mute");
                }
                if (res.HR_alarm === "off") {
                    system.HR_display.alarm("off");
                } else if (res.HR_alarm === "alarm") {
                    system.HR_display.alarm("glyphicon-bell");
                } else if (res.HR_alarm === "mute") {
                    system.HR_display.alarm("glyphicon-mute");
                }
            } else {
                system.spo2_display.hide();
                system.HR_display.hide();
            }
        }
	
	
	
	
	
	
	
	
	
	
	
	
    
    function onMessageReceived(err, res) {
		var state = {};
		state = PVSioStateParser.parse(res);
        state = state.Radical7; 
	
	
		
		render_spo2(state);
		
        render_HR(state);
        
        render_alarms(state);
       
	
    }
    
         
     d3.select("#submit_HR_sensor_data").on("click", function () {
            var data = d3.select("#HR_sensor_data").node().value;
            if (data) {
                data = (isNaN(parseFloat(data))) ? -1 : parseFloat(data);
                stop_tick();
                ButtonActionsQueue.getInstance().queueGUIAction("FMI_HR_sensor_data(" + data + ")", onMessageReceived);
                
                start_tick(250,"FMI_HR_sensor_data("+ data+ ")"); 
            }
            else {stop_tick();start_tick(1000,"refresh");}
        });
	
    d3.select("#submit_spo2_sensor_data").on("click", function () {
            var data = d3.select("#spo2_sensor_data").node().value;
            if (data) {
                data = (isNaN(parseFloat(data))) ? -1 : parseFloat(data);
                stop_tick();
                ButtonActionsQueue.getInstance().queueGUIAction("FMI_spo2_sensor_data(" + data + ")", onMessageReceived);
                start_tick(250,"FMI_spo2_sensor_data(" + data + ")");
            }
            else {stop_tick();start_tick(1000,"refresh");}
        });

    // web socket client
    var client = FMIClient.getInstance();
    client.port("8086");
    client.addListener("WebSocketConnectionOpened", function (res) {
        console.log("Connection opened!");
    }).addListener("WebSocketConnectionClosed", function (evt) {
        console.log("Connection closed :((");
    });
    //client.connectToServer();
     var tick;
    
        function start_tick(interval,string) {
            if (!tick) {
                tick = setInterval(function () {
					console.log(ButtonActionsQueue.getInstance().buffer.length);
					if(ButtonActionsQueue.getInstance().buffer.length==0)
                    ButtonActionsQueue.getInstance().queueGUIAction(string, onMessageReceived);
                }, interval);
            }
        }
        function stop_tick() {
            if (tick) {
                clearInterval(tick);
                tick = null;
            }
        }
        start_tick(1000,"refresh");
});
