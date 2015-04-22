/**
 * @module Button
 * @desc Button Widget
 * @author Patrick Oladimeji
 * @date 10/31/13 11:26:16 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
define(function (require, exports, module) {
    "use strict";
    var Widget = require("pvsioweb/Widget"),
        d3 = require("d3/d3"),
        property = require("util/property"),
        Timer	= require("util/Timer"),
        Recorder    = require("util/ActionRecorder"),
        WSManager = require("websockets/pvs/WSManager");
    //define timer for sensing hold down actions on buttons
    var btnTimer = new Timer(250), timerTickFunction = null;
    var buttonActions = Promise.resolve();//This is a ptr to a sequence of promises that handle button action messages to the server
    //add event listener for timer's tick
    btnTimer.addListener('TimerTicked', function () {
        if (timerTickFunction) {
            timerTickFunction();
        }
    });

    function mouseup(e) {
        btnTimer.reset();
    }

    function Button(id, coords, opt) {
        opt = opt || {};
        opt.functionText = opt.functionText || id;
        opt.recallRate = opt.recallRate || 250;
        opt.evts = opt.evts || ["click"];
        this.evts = property.call(this, opt.evts);
        this.recallRate = property.call(this, opt.recallRate);
        this.functionText = property.call(this, opt.functionText);
        this.imageMap = property.call(this);

        Widget.call(this, id, "button");

        var parent = d3.select("map#prototypeMap");
        if (parent.empty()) {
            parent = d3.select("body").append("map").attr("id", "prototypeMap")
                .attr("name", "prototypeMap");
        }

        this.top = coords.top || 0;
        this.left = coords.left || 0;
        this.width = coords.width || 40;
        this.height = coords.height || 40;

        this.area = parent.append("area")
                        .attr("coords", this.left + "," + this.top + ","
                              + (this.left + this.width) + "," + (this.top + this.height))
                        .attr("id", id)
                        .attr("class", id);

        this.createImageMap({area: this.area, callback: opt.callback});
        return this;
    }


    Button.prototype = Object.create(Widget.prototype);
    Button.prototype.constructor = Button;
    Button.prototype.parentClass = Widget.prototype;
    /**
        Gets a comma separated string representing the functions that will be called in the
        pvs spec when interating with this button.
        @returns {string}
        @memberof Button
    */
    Button.prototype.boundFunctions = function () {
        var o = this;
        var res = o.evts().map(function (d) {
            if (d.indexOf("/") > -1) {
                return d.split("/").map(function (a) {
                    return a + "_" + o.functionText();
                }).join(", ");

            } else {
                return d + "_" + o.functionText();
            }
        }).join(", ");
        return res;
    };

    /**
        Returns a JSON object representation of this Button.
        @returns {object}
        @memberof Button
    */
    Button.prototype.toJSON = function () {
        return {
            evts: this.evts(),
            id: this.id(),
            type: this.type(),
            recallRate: this.recallRate(),
            functionText: this.functionText(),
            boundFunctions: this.boundFunctions()
        };
    };

    /**
     * @override
     * Create and image map area for this button and bind functions in the button's events property with appropriate
     * calls to function in the pvs specification. Whenever a response is returned from the pvs function call, the callback
     * function is invoked.
     * @param {!pvsWSClient} ws A websocket client to use for sending gui actions to the server process
     * @param {function} callback A callback function to invoke when the pvs function call on the server process is returned
     * @returns {d3.selection} The image map area created
       @memberof Button
     */
    Button.prototype.createImageMap = function (opt) {
        opt = opt || {};

        var ws = WSManager.getWebSocket();
        var callback = opt.callback || function () {};
        function getGUIActionPromise(action, cb) {
            return new Promise(function (resolve, reject) {
                ws.sendGuiAction(action, function (err, res) {
                    if (err) {
                        cb(err);
                        reject(err);
                    } else {
                        cb(err, res);
                        resolve(res);
                    }
                });
            });
        }

        /**
            Queue the next gui action onto the promise chain. This ensures that actions are
            executed on the server in the same order as they are sent on the client
            @param {string} action the concatenation of button action and function name to call in pvs on the server
                e.g., "click_bigUP"
        */
        function queueGUIAction(action) {
            buttonActions = buttonActions.then(function (res) {
                console.log("calling action " + action);
                var guiAction = action + "(" + ws.lastState().toString().replace(/,,/g, ",") + ");";
                var guiActionPromise = getGUIActionPromise(guiAction, callback);
                return guiActionPromise;
            }).catch(function (err) {
                console.log(err);
            });
            return buttonActions;
        }

        var area = opt.area || Button.prototype.parentClass.createImageMap.apply(this, arguments),
            widget = this,
            f,
            evts;

        var onmouseup = function () {
            var f = widget.functionText();
            if (evts && evts.indexOf('press/release') > -1) {
                queueGUIAction("release_" + f);
                Recorder.addAction({
                    id: widget.id(),
                    functionText: widget.functionText(),
                    action: "release",
                    ts: new Date().getTime()
                });
            }
            mouseup(d3.event);
            area.on("mouseup", null);
        };
        area.on("mousedown", function () {
            f = widget.functionText();
            evts = widget.evts();
            //perform the click event if there is one
            if (evts && evts.indexOf('click') > -1) {
                queueGUIAction("click_" + f);
                //record action
                Recorder.addAction({id: widget.id(), functionText: widget.functionText(), action: "click", ts: new Date().getTime()});
            } else if (evts && evts.indexOf("press/release") > -1) {
                queueGUIAction("press_" + f);
                Recorder.addAction({id: widget.id(), functionText: widget.functionText(), action: "press", ts: new Date().getTime()});

                timerTickFunction = function () {
                    console.log("timer ticked_" + f);
                    queueGUIAction("press_" + f);
                    //record action
                    Recorder.addAction({id: widget.id(), functionText: widget.functionText(), action: "press", ts: new Date().getTime()});
                };
                btnTimer.interval(widget.recallRate()).start();
            }
            //register mouseup/out events here
            area.on("mouseup", onmouseup);

        });
        widget.imageMap(area);
        return area;
    };

    module.exports = Button;
});
