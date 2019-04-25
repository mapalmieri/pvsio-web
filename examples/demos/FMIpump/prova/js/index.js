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
    "PVSioWebClient",
    "stateParser",
    "widgets/TracingsDisplay",
    "widgets/med/PatientMonitorDisplay",
    "websockets/FMIClient",
    "NCDevice"
], function (TouchscreenButton,
				BasicDisplay,
				SingleDisplay,
				DoubleDisplay,
				TripleDisplay,
				ButtonActionsQueue,
				Button,
				LED,
				PVSioWebClient,
				stateParser,
				TracingsDisplay,
				PatientMonitorDisplay,
				FMIClient,
				NCDevice) {
    "use strict";
    // callback function
    var PVSioStateParser = require("util/PVSioStateParser");

        var alaris = {}; // this variable collects references to buttons and displays
        var d3 = require("d3/d3");

        var deviceID = "Alaris";
        var deviceType = "Infusion Pump";
        var disableNC = true;


        function parseNCUpdate(event) { }

        function parseNCControl(event) {
            if (event.message === "click_btn_pause") {
                alaris.btn_pause.click();
            }
        }

        function errorMessage(event) {
            console.log("!!! " + event.message);
        }
        function notifyMessage(event) {
            console.log(">>> " + event.message);
        }

        function onConnect(event) {
            console.log(">>> CONNECTED");
        }

        function onDisconnect(event) {
            console.log(">>> DISCONNECTED");
        }

       

        var serverLogs = [], maxLogSize = 40;
        var client = PVSioWebClient.getInstance();
        //create a collapsible panel using the pvsiowebclient instance
        var imageHolder = client.createCollapsiblePanel({
            parent: "#content",
            headerText: "Simulation of the Alaris GP infusion pump.",
            showContent: true,
            isDemo: false
        }).style("position", "relative");
        //insert the html into the panel (note that this could have used templates or whatever)
        imageHolder.html('<img src="image.jpg" usemap="#prototypeMap"/>').attr("id", "prototype");

        var pause_simulation = false;
        var content = imageHolder.append("div").style("position", "absolute").style("top", "0px").style("left", "400px")
            .style("height", "40px").style("width", "800px").attr("class", "dbgbuttons");
        content.append("button").text("Pause Simulation").attr("id", "pause_simulation").attr("style", "margin:0 20px 0 20px;");
        content.append("span").attr("id", "simulation_status").text("Ready!");
        content.append("button").text("Resume Simulation").attr("id", "resume_simulation").attr("style", "margin:0 20px 0 20px;");

        content = imageHolder.append("div").style("position", "absolute").style("top", "40px").style("left", "400px")
            .style("height", "460px").style("width", "400px").attr("class", "dbg");

        content = imageHolder.append("div").style("position", "absolute").style("top", "40px").style("left", "850px")
            .style("height", "460px").style("width", "400px").attr("id", "monitor").attr("class", "dbg");


        //topline
        alaris.topline = new SingleDisplay("topline", {
            top: 112,
            left: 92,
            height: 10,
            width: 120
        }, {parent: "prototype"});

        //middisp
        alaris.middisp_drate = new TripleDisplay("middisp_drate", {top: 126, left: 94, height: 30, width: 118},
            {
                parent: "prototype",
                left_display: {height: 8, width: 28, align: "left"},
                center_display: {width: 64, align: "right"},
                right_display: {height: 12, top: +16}
            });
        alaris.middisp_dnewvtbi = new TripleDisplay("middisp_dnewvtbi", {top: 132, left: 94, height: 26, width: 118},
            {
                parent: "prototype",
                left_display: {height: 8, width: 28, align: "left"},
                center_display: {width: 64, align: "right"},
                right_display: {height: 12, top: +12}
            });
        alaris.middisp_dshowvol = new TripleDisplay("middisp_dshowvol", {top: 126, left: 94, height: 30, width: 118},
            {
                parent: "prototype",
                left_display: {height: 8, width: 118, align: "center"},
                center_display: {height: 22, width: 74, top: +14, align: "right", left: -4},
                right_display: {height: 12, width: 20, top: +22, left: +14}
            });
        alaris.middisp_dvtbi = new TripleDisplay("middisp_dvtbi", {top: 168, left: 94, height: 12, width: 118},
            {
                parent: "prototype",
                left_display: {height: 8, width: 34, align: "left"},
                center_display: {width: 62, align: "right"}
            });
        alaris.middisp_dvol = new TripleDisplay("middisp_dvol", {top: 186, left: 94, height: 12, width: 118},
            {
                parent: "prototype",
                left_display: {height: 8, width: 62, align: "left"},
                center_display: {width: 34, align: "right"}
            });
        alaris.middisp_dtime = new TripleDisplay("middisp_dtime", {top: 204, left: 94, height: 12, width: 118},
            {
                parent: "prototype",
                left_display: {height: 8, left: +16, width: 16, align: "left"},
                center_display: {width: 82, align: "right"}
            });
        //middisp_dbags
        alaris.middisp_dbags = new SingleDisplay("middisp_dbags", {top: 126, left: 94, height: 90, width: 118},
            {parent: "prototype"});

        //fndisp
        alaris.fndisp1 = new SingleDisplay("fndisp1", {top: 222, left: 96, height: 8, width: 38},
            {parent: "prototype", font: "Courier New"});
        alaris.fndisp2 = new SingleDisplay("fndisp2", {top: 222, left: 134, height: 8, width: 38},
            {parent: "prototype", font: "Courier New"});
        alaris.fndisp3 = new SingleDisplay("fndisp3", {top: 222, left: 172, height: 8, width: 38},
            {parent: "prototype", font: "Courier New"});

        //LEDs
        alaris.ac_light = new LED("ac_light", {top: 356, left: 138, height: 10, width: 10},
            {parent: "prototype"});
        alaris.battery_light = new LED("battery_light", {top: 356, left: 198, height: 10, width: 10},
            {parent: "prototype", color: "rgb(236, 149, 17)"}); // light orange
        alaris.pauselight = new LED("pauselight", {top: 323, left: 122, height: 10, width: 10},
            {parent: "prototype", color: "rgb(236, 149, 17)"}); // light orange
        alaris.runlight = new LED("runlight", {top: 297, left: 122, height: 10, width: 10},
            {parent: "prototype", blinking: true, blinkingRate: 1000});

        var render_LEDs = function (res) {
            if (res.ac_light === "TRUE") {
                alaris.ac_light.on();
            } else {
                alaris.ac_light.off();
            }
            if (res.battery_light === "TRUE") {
                alaris.battery_light.on();
            } else {
                alaris.battery_light.off();
            }
            if (res.pauselight === "TRUE") {
                alaris.pauselight.on();
            } else {
                alaris.pauselight.off();
            }
            if (res.runlight === "TRUE") {
                alaris.runlight.on();
            } else {
                alaris.runlight.off();
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
                alaris.middisp_dbags.renderMultiline(menu, {selected: res.bagscursor, direction: "inverted"});
            } else {
                alaris.middisp_dbags.hide();
            }
        }

        var tick;

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

            alaris.fndisp1.render(fn2string(res.fndisp1));
            alaris.fndisp2.render(fn2string(res.fndisp2));
            alaris.fndisp3.render(fn2string(res.fndisp3));
        }

        function evaluate(str) {
            var v = +str;
            if (str.indexOf("/") >= 0) {
                var args = str.split("/");
                v = +args[0] / +args[1];
            }
            return (v < 100) ? v.toFixed(1).toString() : v.toFixed(0).toString();
        }
        function evaluate2(str) {
            var v = +str;
            if (str.indexOf("/") >= 0) {
                var args = str.split("/");
                v = +args[0] / +args[1];
            }
            return v.toString();
        }

        function render_middisp_drate(res) {
            if (res.middisp_drate === "TRUE") {
                alaris.middisp_drate.renderLabel("RATE");
                alaris.middisp_drate.renderValue(evaluate(res.device.infusionrate));
                alaris.middisp_drate.renderUnits("ml/h");
            } else {
                alaris.middisp_drate.hide();
            }
        }

        function render_middisp_dvtbi(res) {
            if (res.middisp_dvtbi === "TRUE") {
                alaris.middisp_dnewvtbi.hide();
                alaris.middisp_dvtbi.renderLabel("VTBI");
                alaris.middisp_dvtbi.renderValue(evaluate(res.device.vtbi));
                alaris.middisp_dvtbi.renderUnits("ml");
            } else if (res.middisp_dnewvtbi === "TRUE") {
                alaris.middisp_dvtbi.hide();
                alaris.middisp_dnewvtbi.renderLabel("VTBI");
                alaris.middisp_dnewvtbi.renderValue(evaluate(res.newvtbi));
                alaris.middisp_dnewvtbi.renderUnits("ml");
            } else {
                alaris.middisp_dvtbi.hide();
                alaris.middisp_dnewvtbi.hide();
            }
        }

        function render_middisp_dvol(res) {
            if (res.middisp_dvol === "TRUE") {
                if (res.topline.toUpperCase() === "VOLUME") { //Note: in the the model we should have middisp_dshowvol
                    alaris.middisp_dvol.hide();
                    alaris.middisp_dshowvol.renderLabel("VOLUME INFUSED");
                    alaris.middisp_dshowvol.renderValue(evaluate(res.device.volumeinfused));
                    alaris.middisp_dshowvol.renderUnits("ml");
                } else {
                    alaris.middisp_dshowvol.hide();
                    alaris.middisp_dvol.renderLabel("VOLUME INFUSED");
                    alaris.middisp_dvol.renderValue(evaluate(res.device.volumeinfused));
                    alaris.middisp_dvol.renderUnits("ml");
                }
            } else {
                alaris.middisp_dvol.hide();
            }
        }

        function render_middisp_dtime(res) {
            function evaluateTime(str) {
                var x = evaluate2(str);
                var hour = parseInt(x);
                x = (x - hour) * 60;
                var min = parseInt(x);
                x = (x - min) * 60;
                var sec = Math.round(x);
                return hour + "h " + min + "m " + sec + "s";
            }
            if (res.middisp_dtime === "TRUE") {
                alaris.middisp_dtime.getLeftDisplay().renderGlyphicon("glyphicon-time");
                alaris.middisp_dtime.renderValue(evaluateTime(res.device.time));
            } else {
                alaris.middisp_dtime.hide();
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
                    alaris.topline.renderMultiline(["ON HOLD", "Set rate with chevron keys"], {fontSize: "10"});
                } else {
                    alaris.topline.render(topline2string(res.topline), topline2options(res.topline));
                }
            } else {
                alaris.topline.hide();
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
          

            if(event.toString().indexOf("(#") === 0) {


               

                if (!err) {
                   
                    var res = event.toString();
                    if (res.indexOf("(#") === 0) {
                        res = stateParser.parse(event.toString());
                        res=res.AlarisGP;
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
                            
                        }
                    }
                } else {
                    console.log(err);
                }
            }
            else{
                console.log(event.toString());
            }
        }

        // region button definitions
        alaris.btn_on = new Button("FMI_btn_on", {left: 149, top: 347+37}, {callback: onMessageReceived});
		alaris.btn_on.reveal();
        alaris.btn_fup = new Button("FMI_btn_fup", {left: 91, top: 265+37}, {
            callback: onMessageReceived
        });
        alaris.btn_fup.reveal();
        alaris.btn_fdown = new Button("FMI_btn_fdown", {left: 186, top: 265+37}, {
            callback: onMessageReceived
        });
        alaris.btn_fdown.reveal();
        alaris.btn_sup = new Button("FMI_btn_sup", {left: 121, top: 265+37}, {
            callback: onMessageReceived
        });
        alaris.btn_sup.reveal();
        alaris.btn_sdown = new Button("FMI_btn_sdown", {left: 158, top: 265+37}, {
            callback: onMessageReceived
        });
        alaris.btn_sdown.reveal();

        alaris.btn_key1 = new Button("FMI_btn_key1", {left: 95, top: 228+37}, {callback: onMessageReceived});
        alaris.btn_key2 = new Button("FMI_btn_key2", {left: 136, top: 228+37}, {callback: onMessageReceived});
        alaris.btn_key3 = new Button("FMI_btn_key3", {left: 172, top: 228+37}, {callback: onMessageReceived});
		alaris.btn_key1.reveal();
		alaris.btn_key2.reveal();
		alaris.btn_key3.reveal();
        alaris.btn_run = new Button("FMI_btn_run", {left: 89, top: 299+37}, {callback: onMessageReceived});
        alaris.btn_run.reveal();;
        alaris.btn_pause = new Button("FMI_btn_pause", {left: 89, top: 324+37}, {callback: onMessageReceived});
        alaris.btn_pause.reveal();
        alaris.btn_query = new Button("FMI_btn_query", {left: 136, top: 324+37}, {callback: onMessageReceived});
        alaris.btn_query.reveal();
        //endregion

        

     

        //register event listener for websocket connection from the client
       var client1 = FMIClient.getInstance();
    client1.port("8088");
    client1.addListener("WebSocketConnectionOpened", function (res) {
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

