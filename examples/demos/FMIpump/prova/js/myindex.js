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
    "widgets/SingleDisplay",
    "widgets/DoubleDisplay",
    "widgets/TripleDisplay",
    "widgets/ButtonActionsQueue",
    "widgets/core/ButtonEVO",
    "widgets/LED",
    "stateParser",
    "widgets/TracingsDisplay",
    "widgets/med/PatientMonitorDisplay",
    "websockets/FMIClient"
], function (TouchscreenButton,
				BasicDisplay,
				SingleDisplay,
				DoubleDisplay,
				TripleDisplay,
				ButtonActionsQueue,
				Button,
				LED,
				stateParser,
				TracingsDisplay,
				PatientMonitorDisplay,
				FMIClient) {
    "use strict";
    // callback function
    var PVSioStateParser = require("util/PVSioStateParser");
    var system = {};
    // input widget
    
	
	
//topline
        system.topline = new SingleDisplay("topline", {
            top: 112,
            left: 92,
            height: 10,
            width: 120
        },{}, {parent: "prototype"});

        //middisp
        system.middisp_drate = new TripleDisplay("middisp_drate", {top: 126, left: 94, height: 30, width: 118},
            {	left_display: {height: 8, width: 28, align: "left"},
                center_display: {width: 64, align: "right"},
                right_display: {height: 12, top: +16}
            },{
                parent: "prototype"
                
            });
        system.middisp_dnewvtbi = new TripleDisplay("middisp_dnewvtbi", {top: 132, left: 94, height: 26, width: 118},
            {
			left_display: {height: 8, width: 28, align: "left"},
                center_display: {width: 64, align: "right"},
                right_display: {height: 12, top: +12}	
			},{
                parent: "prototype"
                
            });
        system.middisp_dshowvol = new TripleDisplay("middisp_dshowvol", {top: 126, left: 94, height: 30, width: 118},
            {
			left_display: {height: 8, width: 118, align: "center"},
                center_display: {height: 22, width: 74, top: +14, align: "right", left: -4},
                right_display: {height: 12, width: 20, top: +22, left: +14}	
			},{
                parent: "prototype"
                
            });
        system.middisp_dvtbi = new TripleDisplay("middisp_dvtbi", {top: 168, left: 94, height: 12, width: 118},
            {
				left_display: {height: 8, width: 34, align: "left"},
                center_display: {width: 62, align: "right"}},{
                parent: "prototype"
                
            });
        system.middisp_dvol = new TripleDisplay("middisp_dvol", {top: 186, left: 94, height: 12, width: 118},
            {
				left_display: {height: 8, width: 62, align: "left"},
                center_display: {width: 34, align: "right"}},
             {
                parent: "prototype"
                
            });
        system.middisp_dtime = new TripleDisplay("middisp_dtime", {top: 204, left: 94, height: 12, width: 118},
            {
			left_display: {height: 8, left: +16, width: 16, align: "left"},
                center_display: {width: 82, align: "right"}	
			},{
                parent: "prototype"
                
            });
        //middisp_dbags
        system.middisp_dbags = new SingleDisplay("middisp_dbags", {top: 126, left: 94, height: 90, width: 118},
            {},{parent: "prototype"});

        //fndisp
        system.fndisp1 = new SingleDisplay("fndisp1", {top: 222, left: 96, height: 8, width: 38},
            {},{parent: "prototype", font: "Courier New"});
            
        system.fndisp2 = new SingleDisplay("fndisp2", {top: 222, left: 134, height: 8, width: 38},
            {},{parent: "prototype", font: "Courier New"});
             
        system.fndisp3 = new SingleDisplay("fndisp3", {top: 222, left: 172, height: 8, width: 38},
            {},{parent: "prototype", font: "Courier New"});
             

        //LEDs
        system.ac_light = new LED("ac_light", {top: 356, left: 138, height: 10, width: 10},
            {},{parent: "prototype"});
        system.battery_light = new LED("battery_light", {top: 356, left: 198, height: 10, width: 10},
            {},{parent: "prototype", color: "rgb(236, 149, 17)"}); // light orange
        system.pauselight = new LED("pauselight", {top: 323, left: 122, height: 10, width: 10},
            {},{parent: "prototype", color: "rgb(236, 149, 17)"}); // light orange
        system.runlight = new LED("runlight", {top: 297, left: 122, height: 10, width: 10},
            {},{parent: "prototype", blinking: true, blinkingRate: 1000});

        var render_LEDs = function (res) {
            if (res.ac_light === "TRUE") {
                system.ac_light.on();
            } else {
                system.ac_light.off();
            }
            if (res.battery_light === "TRUE") {
                system.battery_light.on();
            } else {
                system.battery_light.off();
            }
            if (res.pauselight === "TRUE") {
                system.pauselight.on();
            } else {
                system.pauselight.off();
            }
            if (res.runlight === "TRUE") {
                system.runlight.on();
            } else {
                system.runlight.off();
            }
        };

        function render_middisp_dbags(res) {
            var menu = [
                res.bagsval0 + " ml",
                res.bagsval1 + " ml",
                res.bagsval2 + " ml",
                res.bagsval3 + " ml",
                res.bagsval4 + " ml",
                res.bagsval5 + " ml",
                res.bagsval6 + " ml",
                res.bagsval7 + " ml",
                res.bagsval8 + " ml",
                res.bagsval9 + " ml"
            ];
            if (res.middisp_dbags === "TRUE") {
                system.middisp_dbags.renderMultiline(menu, {selected: res.bagscursor, direction: "inverted"});
            } else {
                system.middisp_dbags.hide();
            }
        }

       

        function render_fndisp(res) {
            function fn2string(fn) {
                if (fn.toUpperCase() === "FVOL") {
                    return "VOLUME";
                } else if (fn.toUpperCase() === "FVTBI") {
                    return "VTBI";
                } else if (fn.toUpperCase() === "FCANCEL") {
                    return "CANCEL";
                } else if (fn.toUpperCase() === "FCLEAR") {
                    return "CLEAR";
                } else if (fn.toUpperCase() === "FNULL") {
                    return "";
                } else if (fn.toUpperCase() === "FBACK") {
                    return "BACK";
                } else if (fn.toUpperCase() === "FOK") {
                    return "OK";
                } else if (fn.toUpperCase() === "FBAGS") {
                    return "BAGS";
                } else if (fn.toUpperCase() === "FQUIT") {
                    return "QUIT";
                } else if (fn.toUpperCase() === "FKEEP") {
                    return "KEEP";
                } else if (fn.toUpperCase() === "FYES") {
                    return "YES";
                } else if (fn.toUpperCase() === "FNO") {
                    return "NO";
                }
                return fn;
            }

            system.fndisp1.render(fn2string(res.fndisp1));
            system.fndisp2.render(fn2string(res.fndisp2));
            system.fndisp3.render(fn2string(res.fndisp3));
        }
        
        
    // utility function
        function evaluate(str) {
            var v = +str;
            if (str.indexOf("/") >= 0) {
                var args = str.split("/");
                v = +args[0] / +args[1];
            }
            return (v <= 0) ? "--" : ((v < 10) ? v.toFixed(1).toString() : v.toFixed(0).toString());
        }
   function render_middisp_drate(res) {
            if (res.middisp_drate === "TRUE") {
                system.middisp_drate.renderLabel("RATE");
                system.middisp_drate.renderValue(evaluate(res.device.infusionrate));
                system.middisp_drate.renderUnits("ml/s");
            } else {
                system.middisp_drate.hide();
            }
        }

        function render_middisp_dvtbi(res) {
            if (res.middisp_dvtbi === "TRUE") {
                system.middisp_dnewvtbi.hide();
                system.middisp_dvtbi.renderLabel("VTBI");
                system.middisp_dvtbi.renderValue(evaluate(res.device.vtbi));
                system.middisp_dvtbi.renderUnits("ml");
            } else if (res.middisp_dnewvtbi === "TRUE") {
                system.middisp_dvtbi.hide();
                system.middisp_dnewvtbi.renderLabel("VTBI");
                system.middisp_dnewvtbi.renderValue(evaluate(res.newvtbi));
                system.middisp_dnewvtbi.renderUnits("ml");
            } else {
                system.middisp_dvtbi.hide();
                system.middisp_dnewvtbi.hide();
            }
        }

        function render_middisp_dvol(res) {
            if (res.middisp_dvol === "TRUE") {
                if (res.topline.toUpperCase() === "VOLUME") { //Note: in the the model we should have middisp_dshowvol
                    system.middisp_dvol.hide();
                    system.middisp_dshowvol.renderLabel("VOLUME INFUSED");
                    system.middisp_dshowvol.renderValue(evaluate(res.device.volumeinfused));
                    system.middisp_dshowvol.renderUnits("ml");
                } else {
                    system.middisp_dshowvol.hide();
                    system.middisp_dvol.renderLabel("VOLUME INFUSED");
                    system.middisp_dvol.renderValue(evaluate(res.device.volumeinfused));
                    system.middisp_dvol.renderUnits("ml");
                }
            } else {
                system.middisp_dvol.hide();
            }
        }

        function render_middisp_dtime(res) {
            function evaluateTime(str) {
                var x = evaluate(str);
                /*
                var hour = parseInt(x);
                x = (x - hour) * 60;
                var min = parseInt(x);
                x = (x - min) * 60;
                var sec = parseInt(x);*/
                var hour= parseInt(x/3600);
                var x = x - (hour*3600);
                var min = parseInt(x/60);
                var x = x - (min*60);
                return hour + "h " + min + "m " + x + "s";
            }
            if (res.middisp_dtime === "TRUE") {
                system.middisp_dtime.getLeftDisplay().renderGlyphicon("glyphicon-time");
                system.middisp_dtime.renderValue(evaluateTime(res.device.time));
            } else {
                system.middisp_dtime.hide();
            }
        }


        function render_topline(res) {
            function topline2string(msg) {
                msg = msg.toUpperCase();
                if (msg === "DISPVTBI") {
                    return "VTBI";
                } else if (msg === "DISPKVO") {
                    return "KVO";
                } else if (msg === "HOLDING") {
                    return "ON HOLD";
                } else if (msg === "SETRATE") {
                    return "ON HOLD - SET RATE";
                }
                return msg;
            }

            function topline2options(msg) {
                msg = msg.toUpperCase();
                if (msg === "HOLDING" || msg === "SETRATE" || msg === "ATTENTION") {
                    return {blinking: true};
                }
                return {};
            }

            if (res.device["powered_on?"] === "TRUE") {
                if (res.topline === "SETRATE") {
                    system.topline.renderMultiline(["ON HOLD", "Set rate with chevron keys"], {fontSize: "10"});
                } else {
                    system.topline.render(topline2string(res.topline), topline2options(res.topline));
                }
            } else {
                system.topline.hide();
            }
        }

        

    

        /**
         * @function logOnDiv
         * @description Utility function, sends messages to different div elements in the html page
         */
        function logOnDiv(msg, logger) {
            var newP = document.createElement("p");
            newP.innerHTML = msg;
            var node = document.getElementById(logger);
            node.appendChild(newP);
            node.scrollTop = node.scrollHeight;
            //$("#" + logger).animate({ scrollTop: $("#" + logger)[0].scrollHeight}, 500);
        }


        function render_infusion_set_status(res) {
            var state = (res.device.set_fitted === "TRUE") ? "FITTED" : "NOT inserted";
            document.getElementById("infusionset_status").innerHTML = state;
        }

        function render_mains_status(res) {
            var state = (res.device.ac_connect === "TRUE") ? "connected to MAINS" : "on BATTERY";
            document.getElementById("mains_status").innerHTML = state;
        }

        

        /**
         function to handle when an output has been received from the server after sending a guiAction
         if the first parameter is truthy, then an error occured in the process of evaluating the gui action sent
         */
         
            

        function onMessageReceived(err, event) {
            stop_tick();
             var ans = event.split(";");
               //console.log(event);
			var state = stateParser.parse(ans[0]);
			state=state.AlarisGP;
			
            


               
                d3.select(".content").style("display", "block");
                d3.select(".controls").style("display", "block");

                if (!err) {
                    
                    var date = new Date();
                    

                    

                    var res = state;
                    
                        if (res) {
							
                            render_infusion_set_status(res);
                            render_mains_status(res);
                            render_LEDs(res);
                            render_topline(res);
                            render_fndisp(res);
                            render_middisp_drate(res);
                            render_middisp_dvtbi(res);
                            render_middisp_dvol(res);
                            render_middisp_dtime(res);
                            render_middisp_dbags(res);
                            
                            if (res.device["powered_on?"] === "TRUE") {
                                //start_tick();
                            } else {
                                //stop_tick();
                            }
                        }
                    
                } else {
                    console.log(err);
                   
                }
            
            start_tick(1000);
        }

        // region button definitions
        system.btn_on = new Button("FMI_btn_on", {left: 149, top: 347}, {callback: onMessageReceived});
		system.btn_on.reveal();
        system.btn_fup = new Button("FMI_btn_fup", {left: 91, top: 265}, {
            callback: onMessageReceived,
            evts: ['press/release']
        });
         system.btn_fup.reveal();
        system.btn_fdown = new Button("FMI_btn_fdown", {left: 186, top: 265}, {
            callback: onMessageReceived,
            evts: ['press/release']
        });
        system.btn_fdown.reveal();
        system.btn_sup = new Button("FMI_btn_sup", {left: 121, top: 265}, {
            callback: onMessageReceived,
            evts: ['press/release']
        });
        system.btn_sup.reveal();
        system.btn_sdown = new Button("FMI_btn_sdown", {left: 158, top: 265}, {
            callback: onMessageReceived,
            evts: ['press/release']
        });
        system.btn_sdown.reveal();

        system.btn_key1 = new Button("FMI_btn_key1", {left: 95, top: 228}, {callback: onMessageReceived});
        system.btn_key2 = new Button("FMI_btn_key2", {left: 136, top: 228}, {callback: onMessageReceived});
        system.btn_key3 = new Button("FMI_btn_key3", {left: 172, top: 228}, {callback: onMessageReceived});

		system.btn_key1.reveal();
		system.btn_key2.reveal();
		system.btn_key3.reveal();

        system.btn_run = new Button("FMI_btn_run", {left: 89, top: 299}, {callback: onMessageReceived});
        system.btn_run.reveal();
        system.btn_pause = new Button("FMI_btn_pause", {left: 89, top: 324}, {callback: onMessageReceived});
        system.btn_pause.reveal();
        system.btn_query = new Button("FMI_btn_query", {left: 136, top: 324}, {callback: onMessageReceived});
        system.btn_query.reveal();
        //endregion

        var btn_click_id = 0;
        

        d3.select("#btn_insert_infusionset").on("click", function () {
            ButtonActionsQueue.getInstance().queueGUIAction("FMI_insert_infusion_set", onMessageReceived);
        });
        d3.select("#btn_remove_infusionset").on("click", function () {
            ButtonActionsQueue.getInstance().queueGUIAction("FMI_remove_infusion_set", onMessageReceived);
        });

        d3.select("#btn_plug_mains").on("click", function () {
            ButtonActionsQueue.getInstance().queueGUIAction("FMI_plug_mains", onMessageReceived);
        });
        d3.select("#btn_unplug_mains").on("click", function () {
            ButtonActionsQueue.getInstance().queueGUIAction("FMI_unplug_mains", onMessageReceived);
        });

        d3.select("#set_battery_level").on("click", function () {
            var data = d3.select("#battery_level").node().value;
            if (data) {
                data = (isNaN(parseFloat(data))) ? -1 : parseFloat(data);
                ButtonActionsQueue.getInstance().queueGUIAction("FMI_set_battery_level(" + data + ")", onMessageReceived);
            }
        });


        d3.select("#pause_simulation").on("click", function () {
            pause_simulation = true;
            stop_tick();
            d3.select("#simulation_status").text("Paused").attr("class", "blink");
        });
        d3.select("#resume_simulation").on("click", function () {
            pause_simulation = false;
            //start_tick();
            d3.select("#simulation_status").text("Ready!").attr("class", "ready");
        });

	
    // web socket client
    var client = FMIClient.getInstance();
    client.port("8088");
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
					if(ButtonActionsQueue.getInstance().buffer.length == 0)
                    ButtonActionsQueue.getInstance().queueGUIAction("refresh", onMessageReceived);
                }, interval);
            }
        }
        function stop_tick() {
            if (tick) {
                clearInterval(tick);
                tick = null;
            }
        }
        start_tick(1000);
});
