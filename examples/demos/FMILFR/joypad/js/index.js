/**
 *
 * @author Paolo Masci, Patrick Oladimeji
 * @date 27/03/15 20:30:33 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
require.config({
    baseUrl: "./",
    paths: {
	       d3: './lib'
    }
});

require([
        "widgets/TouchscreenButton",
        "widgets/BasicDisplay",
        "widgets/TextSpeaker",
        "widgets/car/Gauge",
        "widgets/LED2",
        "widgets/car/Navigator",
        "widgets/ButtonActionsQueue",
        "websockets/FMIClient"
    ], function (
        TouchscreenButton,
        BasicDisplay,
        Speaker,
        Gauge,
        LED2,
        Navigator,
        ButtonActionsQueue,
        FMIClient
    ) {
        "use strict";
        var client = FMIClient.getInstance();
        var PVSioStateParser = require("util/PVSioStateParser");

        var DBG = false;
        var previous_mode; // this is used to keep track of mode changes, useful for voice feedback

        // Function automatically invoked by PVSio-web when the back-end sends states updates
        function onMessageReceived(err, res) {
			//stop_tick;
            //console.log(res);
            render(res);
            //start_tick(250);		
        }
        
        var car = {};
        // ----------------------------- DASHBOARD INTERACTION -----------------------------
        car.left = new TouchscreenButton("left", {  width: 40, height: 25, top: 390, left: 250 }, {
            callback: onMessageReceived,
            backgroundColor: "transparent",
            evts: ['press/release'],
            keyCode: 37 // left key
        }, {
            parent: "joypad"
        });
        car.up = new TouchscreenButton("accelerate", { width: 25, height: 40, top: 350, left: 290 }, {
            callback: onMessageReceived,
            backgroundColor: "transparent",
            evts: ['press/release'],
            keyCode: 38 // up key
        }, {
            parent: "joypad"
        });
        car.right = new TouchscreenButton("right", {  width: 40, height: 25, top: 390, left: 310 }, {
            callback: onMessageReceived,
            backgroundColor: "transparent",
            evts: ['press/release'],
            keyCode: 39 // right key
        }, {
            parent: "joypad"
        });
        car.down = new TouchscreenButton("brake", { width: 25, height: 40, top: 410, left: 290 }, {
            callback: onMessageReceived,
            backgroundColor: "transparent",
            evts: ['press/release'],
            keyCode: 40 // down key
        }, {
            parent: "joypad"
        });
        car.neutral = new TouchscreenButton("neutral", {  width: 40, height: 25, top: 388, left: 630 }, {
            callback: onMessageReceived,
            backgroundColor: "transparent",
            evts: ['click'],
            keyCode: 66 // b
        }, {
            parent: "joypad"
        });
        car.drive = new TouchscreenButton("drive", {  width: 40, height: 25, top: 350, left: 585 }, {
            callback: onMessageReceived,
            backgroundColor: "transparent",
            evts: ['click'],
            keyCode: 89 // y
        }, {
            parent: "joypad"
        });
        car.reverse = new TouchscreenButton("reverse", {  width: 40, height: 25, top: 425, left: 588 }, {
            callback: onMessageReceived,
            backgroundColor: "transparent",
            evts: ['click'],
            keyCode: 65 // a
        }, {
            parent: "joypad"
        });
        car.autopilot = new TouchscreenButton("autopilot", {  width: 40, height: 25, top: 386, left: 542 }, {
            callback: onMessageReceived,
            backgroundColor: "transparent",
            evts: ['click'],
            keyCode: 88 // x
        }, {
            parent: "joypad"
        });
        car.speed_left = new Gauge('speedometer-gauge-left',
                {
                    top: 450,
                    left: 330,
                    width: 90
                },
                {
                    parent: "joypad",
                    max: 5.18,
                    min: -5.18,
                    initial: 0,
                    label: 'LEFT',
                    redZones: [{ from: 3.45, to: 5.18 }, { from: -3.45, to: -5.18 }],
                    style: "powergauge"
                });
        car.speed_right = new Gauge('speedometer-gauge-right',
                {
                    top: 450,
                    left: 500,
                    width: 90
                },
                {
                    parent: "joypad",
                    size: 90,
                    max: 5.18,
                    min: -5.18,
                    initial: 0,
                    label: 'RIGHT',
                    redZones: [{ from: 3.45, to: 5.18 }, { from: -3.45, to: -5.18 }],
                    style: "powergauge"
                });
        car.speed = new Gauge('speedometer-gauge-main',
                {
                    top: 70,
                    left: 240,
                    width: 220
                },
                {
                    parent: "joypad",
                    size: 220,
                    max: 0.18,
                    min: 0,
                    initial: 0,
                    label: 'MPS',
                    majorTicks: 8,
                    redZones: [{ from: 0.154, to: 0.18 }],
                    style: "powergauge"
                });
        car.navigator = new Navigator("nav-display",
                {
                    top: 80,
                    left: 460,
                    width: 180,
                    height: 180
                }, {
                    // autoscale: true,
                    parent: "joypad",
		            maxX: 0.296,
                    maxY: 0.4914,
        		    x0: 0.138,
        		    y0: -0.08,
                    lineColor: "red"
                });
        car.gear = new BasicDisplay("gear",
            { top: 154, left: 380, width: 24, height: 26 },
            {
                parent: "joypad",
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: "black",
                fontsize: 22,
                backgroundColor: "gray"
            });
        car.position = new BasicDisplay("position",
            { top: 246, left: 462, width: 176, height: 12 },
            {
                parent: "joypad",
                fontsize: 10,
                backgroundColor: "gray"
            });
        car.autopilot_display = new BasicDisplay("cc",
            { top: 18, left: 386, width: 134, height: 26 },
            {
                parent: "joypad",
                fontsize: 16,
                fontColor: "white",
                backgroundColor: "transparent"
            });
        car.manual_LED = new LED2("manual_LED",
            { top: 350, left: 426, width: 56, height: 56 },
            {
                parent: "joypad",
                color: "orange",
                blinking: true
            });
        car.autopilot_LED = new LED2("autopilot_LED",
            { top: 350, left: 426, width: 56, height: 56 },
            {
                parent: "joypad",
                color: "cyan"
            });

        function speak(txt) {
            // if (responsiveVoice && typeof responsiveVoice.speak === "function") {
            //     responsiveVoice.speak(txt);
            // }
        }

        // Render car dashboard components
        function render(res) {
            car.left.render(res);
            car.right.render(res);
            car.up.render(res);
            car.down.render(res);
            car.neutral.render(res);
            car.drive.render(res);
            car.reverse.render(res);
            car.autopilot.render(res);
            car.navigator.reveal();
            car.autopilot_display.render({ cc: "MANUAL" });
            car.gear.render({ gear: "N" });
            car.autopilot_LED.off();
            car.manual_LED.on();
            // gauges
            if (res) {
                var ans = res.split(";");
                var state = {};
                var state_aux = {};
                var left = 0;
                var right = 0;
                if (ans.length >= 2) {
                    state_aux = PVSioStateParser.parse(ans[1]);
                    if (state_aux) {
                        if (!DBG) {
                            left = PVSioStateParser.evaluate(state_aux["left_rotation"]);
                            car.speed_left.render(left);
                            right = PVSioStateParser.evaluate(state_aux["right_rotation"]);
                            car.speed_right.render(-right);
                        }
                        var pos_x = PVSioStateParser.evaluate(state_aux["posx"]);
                        var pos_y = PVSioStateParser.evaluate(state_aux["posy"]);
                        car.navigator.render([{ x: pos_x, y: pos_y }]);
                        car.position.render("(" + pos_x + ", " + pos_y + ")");
                        var linear = PVSioStateParser.evaluate(state_aux["linear"]);
			            linear = (linear < 0)? -linear : linear;
                        car.speed.render(linear);
                        var angular = PVSioStateParser.evaluate(state_aux["angular"]);
                        // we should use angular to rotate the arrow when the vehicle is spinning
                    }
                }
                if (ans.length >= 1) {
                    state = PVSioStateParser.parse(ans[0]);
                    if (state) {
                        if (DBG) {
                            left = PVSioStateParser.evaluate(state["motorSpeed"]["left"]);
                            car.speed_left.render(left);
                            right = PVSioStateParser.evaluate(state["motorSpeed"]["right"]);
                            car.speed_right.render(right);
                        }
                        // basic display supports automatic parsing of the state
                        var gear = (state["gear"] === "DRIVE")? "D"
                                     : (state["gear"] === "REVERSE")? "R"
                                     : (state["gear"] === "NEUTRAL")? "N"
                                     : "E";
                        car.gear.render(gear);
                        car.autopilot_display.render(state);
                        if (state.cc === "AUTO") {
                            car.manual_LED.off();
                            car.autopilot_LED.on();
                        } else {
                            car.autopilot_LED.off();
                            car.manual_LED.on();
                        }
                        //-- voice feedback for mode changes
                        if (state["cc"] !== previous_mode) {
                            (state["cc"] === "AUTO") ? speak("engaging autopilot!")
                                                        : speak("manual drive!");
                            // voice feedback for linear velocity, given after 2.5 seconds to avoid overlapping with "manual drive!"
                            if (state_aux["linear"]) {
                                setTimeout(function () {
                                    speak("vehicle speed is " + linear + "kilometers per hour" );
                                }, 2500);
                            }

                        }
                        previous_mode = state["cc"];
                        //console.log(previous_mode);
                    }
                }
            }
        }

        ButtonActionsQueue.getInstance().addListener("FMI_TRYING_TO_CONNECT", function (evt) {
            console.log("trying to connect...");
            car.navigator.resetDisplay({
                keepOldTrace: true,
                changeColor: true
            });
            previous_mode = null;
        });
        ButtonActionsQueue.getInstance().addListener("FMI_RECONNECTED", function (evt) {
            console.log("connected :)");
            speak("connected!");
        });
        ButtonActionsQueue.getInstance().addListener("FMI_CONNECTION_ERROR", function (evt) {
            console.log("connection error :((");
        });

        // Function used for polling the robot state at periodic intervals
        var tick;
        function start_tick(interval) {
            if (!tick) {
                tick = setInterval(function () {
					if(ButtonActionsQueue.getInstance().buffer.length==0)
                    ButtonActionsQueue.getInstance().queueGUIAction("refresh",onMessageReceived );
                }, interval);
            }
        }
        function stop_tick() {
            if (tick) {
                clearInterval(tick);
                tick = null;
            }
        }

        // -- dbg lines for testing
        // car.position.render("(0.138, -0.08)");
        // car.navigator.render([{ x:0, y:-.50 }, { x:-.100, y:-.50 }, { x:-.100, y:-.150 }, { x:.100, y:-.150 }, { x:.100, y:-.100 }, { x:.200, y:.50 }, { x:-.200, y:-.200 }]);
        // --

        // start the simulation
        render();
        start_tick(250); // tick interval is in milliseconds

        $(window).on("gamepad_up", function (evt) {
            car.up.click();
        });
        $(window).on("gamepad_down", function (evt) {
            car.down.click();
        });
        $(window).on("gamepad_left", function (evt) {
            car.left.click();
        });
        $(window).on("gamepad_right", function (evt) {
            car.right.click();
        });
        $(window).on("gamepad_Y", function (evt) {
            car.drive.click();
        });
        $(window).on("gamepad_A", function (evt) {
            car.reverse.click();
        });
        $(window).on("gamepad_B", function (evt) {
            car.neutral.click();
        });
        $(window).on("gamepad_X", function (evt) {
            car.autopilot.click();
        });
});
