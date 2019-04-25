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
    "widgets/med/PumpMonitorDisplay",
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
				PumpMonitorDisplay,
				stateParser,
				TracingsDisplay,
				PatientMonitorDisplay,
				FMIClient) {
    "use strict";
    // callback function
    var PVSioStateParser = require("util/PVSioStateParser");
    var app = {monitor: {spo2_display: null, HR_display: null}, pump: {rate: null}};
    app.monitor.spo2_display = new PatientMonitorDisplay("spo2_display",
        {top: 250, left: 140, height: 40, width: 160},{ font: "Times", label: "SpO2"},
        {parent: "prototype"});
    app.monitor.HR_display = new PatientMonitorDisplay("HR_display",
        {top: 300, left: 140, height: 40, width: 160},{font: "Times", label: "HR", fontColor: "aqua"},
        {parent: "prototype" });
    app.monitor.searching = new SingleDisplay("searching_patient_monitor",
        {top: 280, left: 140, height: 24, width: 190},{},
        {parent: "prototype"});

    app.alarm = new SingleDisplay("alarm",
        {top: 34, left: 133, height: 16, width: 16},{},
        {parent: "prototype", blinking: true, fontColor: "#FF0033"}); // bright red
    app.pump.topline = new SingleDisplay("topline",
        {top: 70, left: 160, height: 12, width: 130},{},
        {parent: "prototype"});
    app.pump.topline_back = new SingleDisplay("topline_back",
        {top: 70, left: 140, height: 16, width: 16},{},
        {parent: "prototype", touchscreen: {callback: onMessageReceived}});
    app.pump.rate = new TripleDisplay("rate",
        {top: 100, left: 140, height: 24, width: 190},
        {
            left_display: {height: 14, width: 56, align: "left", left: +2, top: +8},
            center_display: {width: 80, align: "right"},
            right_display: {height: 14, width: 44, align: "right", top: +10},
            backgroundColor: "black",
            touchscreen: {callback: onMessageReceived}
        },{parent: "prototype"});
    app.pump.vtbi = new TripleDisplay("vtbi",
        {top: 135, left: 140, height: 24, width: 190},
        {
            left_display: {height: 14, width: 56, align: "left", left: +2, top: +8},
            center_display: {width: 80, align: "right"},
            right_display: {height: 14, width: 44, align: "right", top: +10},
            backgroundColor: "black",
            touchscreen: {callback: onMessageReceived}
            
        },{parent: "prototype"});
    app.pump.volume = new TripleDisplay("volume",
        {top: 170, left: 140, height: 24, width: 190},
        {
            left_display: {height: 14, width: 56, align: "left", left: +2, top: +8},
            center_display: {width: 80, align: "right"},
            right_display: {height: 14, width: 44, align: "right", top: +10},
            backgroundColor: "black",
            touchscreen: {callback: onMessageReceived}
        },{parent: "prototype"});
    app.pump.time = new SingleDisplay("time",
        {top: 205, left: 140, height: 20, width: 190},{},
        {
            backgroundColor: "black",
            parent: "prototype"
        });
    app.pump.tracings = new PumpMonitorDisplay("tracings",
        {top: 112, left: 140, height: 34, width: 180},{range: {max: 1200, min: 0}},
        {parent: "prototype" });
    app.pump.searching = new SingleDisplay("searching_pump",
        {top: 112, left: 140, height: 24, width: 190},{},
        {parent: "prototype"});


    // utility function
    function evaluate(str) {
        var v = +str;
        if (str.indexOf("/") >= 0) {
            var args = str.split("/");
            v = +args[0] / +args[1];
        }
        return (v <= 0) ? "--" : ((v < 10) ? v.toFixed(1).toString() : v.toFixed(0).toString());
    }

    // monitor
    function render_patient_monitor(res) {
        // spo2
        function render_spo2(monitor) {
            app.monitor.spo2_display.set_alarm({min: parseFloat(monitor.spo2_min), max: parseFloat(monitor.spo2_max)});
            app.monitor.spo2_display.set_range({min: 0, max: 100});
            if (monitor.spo2_fail === "FALSE") {
                if (monitor.spo2_alarm === "off") {
                    app.monitor.spo2_display.render(evaluate(monitor.spo2));
                } else {
                    app.monitor.spo2_display.render(evaluate(monitor.spo2), {fontColor: "red"});
                }
            } else {
                app.monitor.spo2_display.fail("FAIL");
            }
        }

        // HR
        function render_HR(monitor) {
            app.monitor.HR_display.set_alarm({min: parseFloat(monitor.HR_min), max: parseFloat(monitor.HR_max)});
            app.monitor.HR_display.set_range({min: 0, max: 80});
            if (monitor.HR_fail === "FALSE") {
                if (monitor.HR_alarm === "off") {
                    app.monitor.HR_display.render(evaluate(monitor.HR));
                } else {
                    app.monitor.HR_display.render(evaluate(monitor.HR), {fontColor: "red"});
                }
            } else {
                app.monitor.HR_display.fail("FAIL");
            }
        }

        // alarms
        function render_alarms(monitor) {
            switch (monitor.spo2_alarm.trim()) {
                case "off"   :
                    app.monitor.spo2_display.alarm("off");
                    break;
                case "alarm" :
                    app.monitor.spo2_display.alarm("glyphicon-bell");
                    app.alarm.renderGlyphicon("glyphicon-bell");
                    break;
                case "mute"  :
                    app.monitor.spo2_display.alarm("glyphicon-mute");
                    app.alarm.renderGlyphicon("glyphicon-mute");
                    break;
            }
            switch (monitor.HR_alarm) {
                case "off"   :
                    app.monitor.HR_display.alarm("off");
                    break;
                case "alarm" :
                    app.monitor.HR_display.alarm("glyphicon-bell");
                    app.alarm.renderGlyphicon("glyphicon-bell");
                    break;
                case "mute"  :
                    app.monitor.HR_display.alarm("glyphicon-mute");
                    app.alarm.renderGlyphicon("glyphicon-mute");
                    break;
            }
            if ((monitor.HR_alarm.trim() === "alarm" || monitor.HR_alarm.trim() === "mute") &&
                (monitor.spo2_alarm.trim() === "alarm" || monitor.spo2_alarm.trim() === "mute")) {
                app.alarm.renderGlyphicon("glyphicon-bell");
            } else {
                app.alarm.hide();
            }
        }

        if (res.monitor_connected === "TRUE") {
            if (res.monitor.isOn.trim() === "TRUE") {
                render_spo2(res.monitor);
                render_HR(res.monitor);
                render_alarms(res.monitor);
                app.monitor.searching.hide();
            } else {
                app.alarm.hide();
                app.monitor.spo2_display.hide();
                app.monitor.HR_display.hide();
                app.monitor.spo2_display.hide();
                app.monitor.HR_display.hide();
                app.monitor.searching.renderMultiline(["ICE-Compatible monitor detected:", res.monitor.id]);
            }
        } else {
            app.alarm.hide();
            app.monitor.spo2_display.hide();
            app.monitor.HR_display.hide();
            app.monitor.spo2_display.hide();
            app.monitor.HR_display.hide();
            app.monitor.searching.renderMultiline(["ICE-compatible monitors", "Searching..."], {blinking: true});
        }
    }


    // pump
    function render_pump_monitor(res) {
        // topline
        function render_topline(res) {
            function topline2string(msg) {
                msg = msg.toUpperCase();
                switch (msg) {
                    case "DISPVTBI" :
                        return "VTBI";
                    case "DISPKVO"  :
                        return "KVO";
                    case "HOLDING"  :
                        return "ON HOLD";
                    case "SETRATE"  :
                        return "ON HOLD - SET RATE";
                    case "DISPBLANK":
                        return "";
                    default :
                        return msg;
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

            app.pump.topline.render(topline2string(res.topline.trim()), topline2options(res.topline.trim()));
        }
		
		
		function evaluate2(str) {
            var v = +str;
            if (str.indexOf("/") >= 0) {
                var args = str.split("/");
                v = +args[0] / +args[1];
            }
            return v.toString();
        }
        
        function render_pump_data(res) {
            function evaluate(str) {
                var v = +str;
                if (str.indexOf("/") >= 0) {
                    var args = str.split("/");
                    v = +args[0] / +args[1];
                }
                return parseInt(v * 100) / 100; // number truncated at the 2nd fractional digit
            }

            function evaluateTime(str) {
                var x = evaluate2(str);
                var hour = parseInt(x);
                x = (x - hour) * 60;
                var min = parseInt(x);
                x = (x - min) * 60;
                var sec = Math.round(x);
                return hour + "h " + min + "m " + sec + "s";
            }

            render_topline(res);
            app.pump.topline_back.hide();
            app.pump.rate.renderLabel("RATE");
            app.pump.rate.renderValue(evaluate(res.rate));
            app.pump.rate.renderUnits("mL/h");
            app.pump.vtbi.renderLabel("VTBI");
            app.pump.vtbi.renderValue(evaluate(res.vtbi));
            app.pump.vtbi.renderUnits("mL");
            app.pump.volume.renderLabel("VOLUME");
            app.pump.volume.renderValue(evaluate(res.volume));
            app.pump.volume.renderUnits("mL");
            app.pump.time.render(evaluateTime(res.time));
            app.pump.tracings.hide();
        }

        function render_pump_tracings(param, res) {
            function evaluate(str) {
                var v = +str;
                if (str.indexOf("/") >= 0) {
                    var args = str.split("/");
                    v = +args[0] / +args[1];
                }
                return v;
            }

            param = param.replace("show_", "");
            app.pump.rate.hide();
            app.pump.vtbi.hide();
            app.pump.volume.hide();
            app.pump.time.hide();
            render_topline(res);
            app.pump.topline_back.renderGlyphicon("glyphicon-list");
            var units = (param === "rate") ? "mL/h" : (param === "vtbi" || param === "volume") ? "mL" : "??";
            var range = (param === "rate") ? {max: 1200} : (param === "vtbi" || param === "volume") ? {max: 3000} : {max: 100};
            app.pump.tracings.render(evaluate(res[param]), {
                label: param.toString().toUpperCase(),
                units: units,
                range: range
            });
        }

        if (res.pump_connected.trim() === "TRUE") {
            if (res.pump.isOn.trim() === "TRUE") {
                if (res.mode.trim() === "monitoring") {
                    render_pump_data(res.pump);
                } else if (res.mode.indexOf("show_") === 0) {
                    render_pump_tracings(res.mode, res.pump);
                }
                app.pump.searching.hide();
            } else {
                app.pump.searching.renderMultiline(["ICE-Compatible pump detected:", res.pump.id]);
                app.pump.rate.hide();
                app.pump.vtbi.hide();
                app.pump.volume.hide();
                app.pump.time.hide();
                app.pump.topline.hide();
                app.pump.tracings.hide();
                app.pump.topline_back.hide();
            }
        } else {
            app.pump.rate.hide();
            app.pump.vtbi.hide();
            app.pump.volume.hide();
            app.pump.time.hide();
            app.pump.topline.hide();
            app.pump.tracings.hide();
            app.pump.topline_back.hide();
            app.pump.searching.renderMultiline(["ICE-compatible pumps", "Searching..."], {blinking: true});
        }
    }


        

        function stop_tick() {
            if (tick) {
                clearInterval(tick);
                tick = null;
            }
        }

	var client = FMIClient.getInstance();
    client.port("8084");
    client.addListener("WebSocketConnectionOpened", function (res) {
        console.log("Connection opened!");
    }).addListener("WebSocketConnectionClosed", function (evt) {
        console.log("Connection closed :((");
    });

	 function onMessageReceived(err, event) {
        if (!err && event ) {
          //  logOnDiv(event.toString(), "monitor");
            var res = event.toString();
            console.log(res);
            if (res && res.indexOf("(#") === 0) { // checking that the state is well-formed
                res = stateParser.parse(res);
                if (res.monitor_connected.trim() === "TRUE" &&
                    res.pump_connected.trim() === "TRUE") {
                    // safety interlock
                    if (res.monitor.isOn.trim() === "TRUE" && res.pump.isOn.trim() === "TRUE") {
                        if (res.pumpcmd.trim() === "pause") {
                            console.log("pause pump");
                            //ncDevice.sendControlData("Alaris", "click_btn_pause");
                            //ButtonActionsQueue.getInstance().queueGUIAction("function_var1###click_btn_pause",onMessageReceived)
                        }
                    }
                }
                // rendering
                if ( res.monitor.isOn === "TRUE" && res.monitor_connected === "FALSE"){
					ButtonActionsQueue.getInstance().queueGUIAction("on_connect_monitor",onMessageReceived)}
				if ( res.pump.isOn === "TRUE" && res.pump_connected === "FALSE"){
					ButtonActionsQueue.getInstance().queueGUIAction("on_connect_pump",onMessageReceived)}
                render_patient_monitor(res);
                render_pump_monitor(res);
                //start_tick();
            }
        } else {
            console.log(err);
        }
    }
	
    // web socket client
    
    //client.connectToServer();
     var tick;
        function start_tick(interval) {
            if (!tick) {
                tick = setInterval(function () {
					if(ButtonActionsQueue.getInstance().buffer.length==0)
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
