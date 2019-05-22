/**
 *
 * @author Paolo Masci, Patrick Oladimeji
 * @date 27/03/15 20:30:33 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
require.config({
    baseUrl: "../../client/app",
    paths: {
        d3: "../lib/d3",
        "pvsioweb": "plugins/prototypebuilder",
        "imagemapper": "../lib/imagemapper",
        "text": "../lib/text",
        "lib": "../lib",
        "cm": "../lib/cm",
        stateParser: './util/PVSioStateParser'
    }
});

require([
        "widgets/TouchscreenButton",
        "widgets/BasicDisplay",
        "widgets/med/Syringe/Syringe",
        "widgets/LED",
        "widgets/LED2",
        "widgets/ButtonActionsQueue",
        "stateParser",
        "PVSioWebClient"],
    function (TouchscreenButton,
              BasicDisplay,
              Syringe,
              LED,
              LED2,
              ButtonActionsQueue,
              stateParser,
              PVSioWebClient) {
        "use strict";
        var d3 = require("d3/d3");
        var client = PVSioWebClient.getInstance();
        
         var tick = {
            plunger: null,
            time: null
        };
        
        var device = {};
        
        device.contrast1 = new BasicDisplay("contrast1", {
            top: 138,
            left: 85,
            width: 103,
            height: 35
        }, {
            parent: "bracco",
            backgroundColor: "#191970", // darkblue
            fontSize: 13,
            align:"center",
            borderRadius: "5px",
            fontColor: "white"
        });
        
        device.elapsedtime = new BasicDisplay("elapsed_time", {
            top: 620,
            left: 300,
            width: 115,
            height: 40
        }, {
            parent: "content",
            backgroundColor: "lightcyan", // darkblue
            fontSize: 30,
            borderRadius: "5px",
            fontColor: "black"
        });
        
        device.contrast_volume1 = new BasicDisplay("contrast_volume1", {
            top: 174,
            left: 85,
            width: 103,
            height: 35
        }, {
            parent: "bracco",
            backgroundColor: "#191970", // darkblue
            fontSize: 20,
            align: "right",
            borderRadius: "5px",
            fontColor: "white"
        });
        
        device.contrast2 = new BasicDisplay("contrast2", {
            top: 138,
            left: 285,
            width: 103,
            height: 35
        }, {
            parent: "bracco",
            backgroundColor: "#B0E0E6", // darkblue
            fontSize: 13,
            borderRadius: "5px",
            fontColor: "white"
        });
        
        device.contrast_volume2 = new BasicDisplay("contrast_volume2", {
            top: 174,
            left: 285,
            width: 103,
            height: 35
        }, {
            parent: "bracco",
            backgroundColor: "#B0E0E6", // darkblue
            fontSize: 20,
            align: "right",
            borderRadius: "5px",
            fontColor: "white"
        });
        
        device.needle_size = new BasicDisplay("needle_size", {
            top: 530,
            left: 316,
            width: 70,
            height: 35
        }, {
            parent: "bracco",
            backgroundColor: "#B0E0E6", // darkblue
            fontSize: 20,
            align: "right",
            borderRadius: "5px",
            fontColor: "white"
        });
        
        device.saline_volume = new BasicDisplay("saline_volume", {
            top: 530,
            left: 84,
            width: 105,
            height: 35
        }, {
            parent: "bracco",
            backgroundColor: "#00BFFF", // darkblue
            fontSize: 23,
            borderRadius: "5px",
            align: "right",
            fontColor: "black"
        });
        
        device.check_RP = new TouchscreenButton("btn_check_RP", {
            top: 480,
            left: 316,
            width: 65,
            height: 35
        }, {
            parent: "bracco",
            backgroundColor: "transparent" 
            
        });
        
        device.btn_needle_size = new TouchscreenButton("btn_needle_size", {
           top: 530,
            left: 316,
            width: 70,
            height: 35
        }, {
            parent: "bracco",
            backgroundColor: "transparent" 
            
        });
        
        device.start_injection = new TouchscreenButton("start_injection", {
            top: 615,
            left: 250,
            width: 85,
            height: 42
        }, {
            parent: "bracco",
            backgroundColor: "transparent" 
            
        });
        
        device.protocol8 = new TouchscreenButton("btn_protocol_8", {
            top: 395,
            left: 415,
            width: 77,
            height: 34
        }, {
            parent: "bracco",
            backgroundColor: "transparent" 
            
        });
        
        device.btn_stop = new TouchscreenButton("btn_stop", {
            top: 620,
            left: 205,
            width: 160,
            height: 40
        }, {
            parent: "bracco",
            fontColor: "black",
            softLabel: "STOP",
            backgroundColor: "red" 
            
        });
        
        device.btn_start = new TouchscreenButton("btn_start", {
            top: 720,
            left: 365,
            width: 100,
            height: 60
        }, {
            parent: "bracco",
            backgroundColor: "transparent" 
            
        });
        
        device.first_row_volume = new BasicDisplay("first_row_volume", {
            top: 245,
            left: 134,
            width: 105,
            height: 35
        }, {
            parent: "injection",
            backgroundColor: "transparent", // darkblue
            fontSize: 23,
            borderRadius: "5px",
            align: "right",
            fontColor: "black"
        });
        
        device.first_row_rate = new BasicDisplay("first_row_rate", {
            top: 245,
            left: 204,
            width: 105,
            height: 35
        }, {
            parent: "injection",
            backgroundColor: "transparent", // darkblue
            fontSize: 23,
            borderRadius: "5px",
            align: "right",
            fontColor: "black"
        });
        
        device.first_row_time = new BasicDisplay("first_row_time", {
            top: 245,
            left: 264,
            width: 105,
            height: 35
        }, {
            parent: "injection",
            backgroundColor: "transparent", // darkblue
            fontSize: 23,
            borderRadius: "5px",
            align: "right",
            fontColor: "black"
        });
        device.second_row_volume = new BasicDisplay("second_row_volume", {
            top: 295,
            left: 134,
            width: 105,
            height: 35
        }, {
            parent: "injection",
            backgroundColor: "transparent", // darkblue
            fontSize: 23,
            borderRadius: "5px",
            align: "right",
            fontColor: "white"
        });
        
        device.second_row_rate = new BasicDisplay("second_row_rate", {
            top: 295,
            left: 204,
            width: 105,
            height: 35
        }, {
            parent: "injection",
            backgroundColor: "transparent", // darkblue
            fontSize: 23,
            borderRadius: "5px",
            align: "right",
            fontColor: "white"
        });
        
        device.second_row_time = new BasicDisplay("second_row_time", {
            top: 295,
            left: 264,
            width: 105,
            height: 35
        }, {
            parent: "injection",
            backgroundColor: "transparent", // darkblue
            fontSize: 23,
            borderRadius: "5px",
            align: "right",
            fontColor: "white"
        });
        
        device.third_row_volume = new BasicDisplay("third_row_volume", {
            top: 345,
            left: 134,
            width: 105,
            height: 35
        }, {
            parent: "injection",
            backgroundColor: "transparent", // darkblue
            fontSize: 23,
            borderRadius: "5px",
            align: "right",
            fontColor: "black"
        });
        
        device.third_row_rate = new BasicDisplay("third_row_rate", {
            top: 345,
            left: 204,
            width: 105,
            height: 35
        }, {
            parent: "injection",
            backgroundColor: "transparent", // darkblue
            fontSize: 23,
            borderRadius: "5px",
            align: "right",
            fontColor: "black"
        });
        
        device.third_row_time = new BasicDisplay("third_row_time", {
            top: 345,
            left: 264,
            width: 105,
            height: 35
        }, {
            parent: "injection",
            backgroundColor: "transparent", // darkblue
            fontSize: 23,
            borderRadius: "5px",
            align: "right",
            fontColor: "black"
        });
        
        device.injection_contrast_volume1 = new BasicDisplay("injection_contrast_volume1", {
            top: 443,
            left: 3,
            width: 35,
            height: 20
        }, {
            parent: "injection",
            backgroundColor: "#191970", // darkblue
            fontSize:15,
            align: "center",
            borderRadius: "5px",
            fontColor: "white"
        });
        
        device.injection_contrast_volume2 = new BasicDisplay("injection_contrast_volume2", {
            top: 443,
            left: 40,
            width: 35,
            height: 20
        }, {
            parent: "injection",
            backgroundColor: "#191970", // darkblue
            fontSize: 15,
            align: "center",
            borderRadius: "5px",
            fontColor: "white"
        });
        
        device.injection_saline_volume = new BasicDisplay("injection_saline_volume", {
            top: 505,
            left: 10,
            width: 60,
            height: 18
        }, {
            parent: "injection",
            backgroundColor: "lightcyan",
            fontSize: 20,
            align: "center",
            borderRadius: "5px",
            fontColor: "black"
        });
        
        device.check_RP.render();
        device.start_injection.render();
		device.protocol8.render();
		device.btn_needle_size.render();
		device.btn_start.render();
		
		
		function evaluate(str) {
            var v = +str;
            if (str.indexOf("/") >= 0) {
                var args = str.split("/");
                v = +args[0] / +args[1];
            }
            return (v < 100) ? v.toFixed(1).toString() : v.toFixed(0).toString();
        }
        
        function evaluateTime(str) {
                var x = evaluate(str);
                
                var min = parseInt(x/60);
                x = x - (min * 60)
                var sec = parseInt(x);
                if(sec<10)return  min + "'0" + sec;
                return  min + "'" + sec;
            }
		
		function onMessageReceived(err, event) {
	
			if (!err) {
					client.getWebSocket().lastState(event.data);
					// rendering
					var res = event.data.toString();
					if (res.indexOf("(#") === 0) {
						res = stateParser.parse(event.data.toString());
						if (res) {
							device.elapsedtime.render(evaluateTime(res.elapsed_time));
							device.contrast1.render(res.contrast1.replace(/_/g," "));
							device.contrast_volume1.render(res.contrast_volume1+"mL");
							device.contrast2.render(res.contrast2.replace(/_/g," "));
							device.contrast_volume2.render(res.contrast_volume2+"mL");
							device.saline_volume.render(res.saline_volume+"mL");
							device.first_row_volume.render(res.first_row_volume);
							device.first_row_rate.render(res.first_row_rate+".0");
							device.first_row_time.render(evaluateTime(res.first_row_time));
							device.second_row_volume.render(res.second_row_volume);
							device.second_row_rate.render(res.second_row_rate+".0");
							device.second_row_time.render(evaluateTime(res.second_row_time));
							device.third_row_volume.render(res.third_row_volume);
							device.third_row_rate.render(res.third_row_rate+".0");
							device.third_row_time.render(evaluateTime(res.third_row_time));
							device.injection_contrast_volume1.render(res.contrast_volume1);
							device.injection_contrast_volume2.render(res.contrast_volume2);
							device.injection_saline_volume.render(res.saline_volume);
							if(res.needle_size === "16") {device.needle_size.fontColor="gray";}
							if(res.needle_size === "18") {device.needle_size.fontColor="green";}
							if(res.needle_size === "20") {device.needle_size.fontColor="pink";}
							if(res.needle_size === "22") {device.needle_size.fontColor="blue";}
							if(res.needle_size === "24") {device.needle_size.fontColor="yellow";}
							if(res.needle_size === "0")  {
								device.needle_size.fontColor="yellow";
								res.needle_size="?";
								}
							if(res.mode === "INITIAL" || res.mode === "CONFIRM" || res.mode === "CHOOSE_PROTOCOL"){
								device.needle_size.backgroundColor="lightcyan";
								device.check_RP.render();
								device.needle_size.render(res.needle_size+"G");
							}
							else if(res.mode === "CHECKED_AIR"){
								device.needle_size.fontColor="yellow";
								device.needle_size.backgroundColor="cyan";
								device.needle_size.render("?"+"G");
							}
							else if(res.mode === "INSERT_NEEDLE_SIZE" ){
								device.needle_size.fontColor="gray";
								device.needle_size.backgroundColor="white";
								device.needle_size.render("?"+"G");
							}
							else {
								device.needle_size.hide();
								device.check_RP.hide();
							}
							if(res.mode === "CONFIRM"){
								d3.select("#confirm_substitution_patient_link").attr("style", "visibility:visible;")
							}
							if(res.mode === "CONFIRMED"){
								d3.select("#confirm_substitution_patient_link").attr("style", "visibility:hidden;");
								d3.select("#avvenutoRP").attr("style", "position:absolute; top:467px; left: 265px; z-index:0; visibility:visible;");
								device.elapsedtime.fontColor="lightcyan";
								
								setTimeout(function(){
									if( d3.select("#refill_saline")[0][0].style.visibility === "hidden")
									d3.select("#refill_RP").attr("style", "visibility:visible; ")},1000);
							}
							if(res.mode === "REFILL_SALINE"){
								d3.select("#refill_RP").attr("style", "visibility:hidden;");
								d3.select("#refill_saline").attr("style", "visibility:visible;")
								
							}
							if(res.mode === "START_REFILL"){
								d3.select("#refill_saline").attr("style", "visibility:hidden;")
								d3.select("#automatic_refil").attr("style", "visibility:visible;")
								device.btn_stop.render("STOP"); 
								setTimeout(function(){d3.select("#progress2").attr("style", "width:11%; background-color: black; border:solid 1px black;")},1000);
								setTimeout(function(){d3.select("#progress3").attr("style", "width:11%; background-color: black; border:solid 1px black;")},2000);
								setTimeout(function(){d3.select("#progress4").attr("style", "width:11%; background-color: black; border:solid 1px black;")},3000);
								setTimeout(function(){d3.select("#progress5").attr("style", "width:11%; background-color: black; border:solid 1px black;")},4000);
								setTimeout(function(){
									d3.select("#progress6").attr("style", "width:11%; background-color: black; border:solid 1px black;");
									ButtonActionsQueue.getInstance().queueGUIAction("automatic_saline_refill", null)},5000);
								/*setTimeout(function(){d3.select("#progress7").attr("style", "width:11%; background-color: black; border:solid 1px black;")},6000);
								setTimeout(function(){d3.select("#progress8").attr("style", "width:11%; background-color: black; border:solid 1px black;")},6000);
								setTimeout(function(){d3.select("#progress9").attr("style", "width:11%; background-color: black; border:solid 1px black;")},6000);*/
								setTimeout(function(){
									device.btn_stop.hide();
									d3.select("#automatic_refil").attr("style", "visibility:hidden");
									d3.select("#confirm_no_air").attr("style", "visibility:visible");
									},7000);
								ButtonActionsQueue.getInstance().queueGUIAction("STOP_REFILL", null);
							}	
							if(res.mode === "CHECKED_AIR"){
								d3.select("#confirm_no_air").attr("style", "visibility:hidden");
								d3.select("#avvenutoRP").attr("style", "position:absolute; top:467px; left: 265px; z-index:0; visibility:hidden;");
								d3.select("#change_needle_size").attr("style","visibility:visible");
							}
							if(res.mode === "INSERT_NEEDLE_SIZE"){
								d3.select("#change_needle_size").attr("style","visibility:hidden");
								d3.select("#select_needle_size").attr("style","visibility:visible");
								
							}
							if(res.mode === "CHOOSE_PROTOCOL"){
								d3.select("#select_needle_size").attr("style","visibility:hidden");
								d3.select("#choose_protocol").attr("style","visibility:visible");
								
							}
							if(res.mode === "PROTOCOL_8"){
								d3.select("#injection").attr("style","position:absolute; z-index:1; height:526px; width:417px; top:135px; left:80px;background:white;visibility:visible");
								d3.select("#total_body").attr("style","visibility:visible");
								device.elapsedtime.backgroundColor="white";
								device.elapsedtime.fontColor="white";
								d3.select("#top3").attr("style","background: url(backbutton.png); position:absolute; left:300px; border-radius:15px ; height:45px; width:55px;");
								d3.select("#top4").attr("style","background: url(toprightbutton.png);position:absolute; left:360px; border-radius:15px ; height:45px; width:55px;");
								d3.select("#bottom2").attr("style","background: url(bottom2.png);position:absolute; top:480px; left:75px; border-radius:15px ; height:45px; width:75px;");
								d3.select("#bottom3").attr("style","background: url(bottom3.png);position:absolute; top:480px; left:151px; border-radius:15px ; height:45px; width:75px;");// di questi 3 si perdono le informazioni in style
								d3.select("#bottom4").attr("style","position:absolute; top:480px; left:380px; border-radius:15px ; height:45px; width:35px;background:lightcyan;font-size: 16px;");
								
							}
							if(res.mode === "TOTAL_BODY"){
								d3.select("#total_body").attr("style","visibility:hidden");
																d3.select("#injection").attr("style","position:absolute; z-index:1; height:526px; width:417px; top:135px; left:80px;background:lightcyan;visibility:visible");
																device.elapsedtime.backgroundColor="lightcyan";
																device.elapsedtime.fontColor="lightcyan";
							}
							
							if(res.mode === "START_INJECTION"){
								
								d3.select("#injection").attr("style","position:absolute; z-index:1; height:526px; width:417px; top:135px; left:80px;background:lightgreen;visibility:visible");
								device.btn_stop.render("STOP");
								d3.select("#bottom2").attr("style","visibility:hidden");
								d3.select("#bottom3").attr("style","visibility:hidden");// di questi 3 si perdono le informazioni in style
								d3.select("#bottom4").attr("style","visibility:hidden");
								d3.select("#top3").attr("style","visibility:hidden");
								d3.select("#top4").attr("style","visibility:hidden");
								d3.select("#elapsed_time").attr("style","position: absolute;top: 620px;left: 340px;width: 115px;height: 40px;margin: 0px;padding: 0px;border-radius: 5px;display: block;cursor: default;border-width: 0px;border-color: inherit;border-style: none;z-index: 2;");
								device.elapsedtime.fontColor="black";
								device.elapsedtime.backgroundColor="transparent";
								if (res.third_row_volume === "0"){
									 d3.select("#injection-finished").attr("style", "visibility:visible");
									 
								 }
							}
							if(res.mode ==="INITIAL"){
								d3.select("#progress2").attr("style", "width:11%; background-color: white; border:solid 1px black;");
								d3.select("#progress3").attr("style", "width:11%; background-color: white; border:solid 1px black;");
								d3.select("#progress4").attr("style", "width:11%; background-color: white; border:solid 1px black;");
								d3.select("#progress5").attr("style", "width:11%; background-color: white; border:solid 1px black;");
								d3.select("#progress6").attr("style", "width:11%; background-color: white; border:solid 1px black;");
								d3.select("#injection").attr("style","position:absolute; z-index:1; height:526px; width:417px; top:135px; left:80px;background:white;visibility:hidden");
								d3.select("#injection-finished").attr("style", "visibility:hidden");
								d3.select("#choose_protocol").attr("style","visibility:hidden");
								device.btn_stop.hide();
								d3.select("#elapsed_time").attr("style","position: absolute;top: 620px;left: 340px;width: 115px;height: 40px;margin: 0px;padding: 0px;border-radius: 5px;display: block;cursor: default;border-width: 0px;border-color: inherit;border-style: none;z-index: 2;");
								device.elapsedtime.fontColor="black";
								device.elapsedtime.backgroundColor="lightcyan";
							}
						}
					}
			}
		}
		
		

		
		function start_tick_time() {
            if (!tick.time) {
                tick.time = setInterval(function () {
                    ButtonActionsQueue.getInstance().queueGUIAction("tick", onMessageReceived);
                },  1000);
            }
        }
        
        d3.select("#v1").on("click", function () {
            ButtonActionsQueue.getInstance().queueGUIAction("click_confirm_change_RP", onMessageReceived);
        });
        d3.select("#btn_refill_saline").on("click", function () {
            ButtonActionsQueue.getInstance().queueGUIAction("click_btn_refill_saline", onMessageReceived);
        });
        d3.select("#v3").on("click", function () {
            ButtonActionsQueue.getInstance().queueGUIAction("click_btn_start_refill", onMessageReceived);
        });
        d3.select("#protocol_btn8").on("click", function () {
            ButtonActionsQueue.getInstance().queueGUIAction("click_btn_protocol_8", onMessageReceived);
        });
        d3.select("#v4").on("click", function () {
            ButtonActionsQueue.getInstance().queueGUIAction("click_btn_checked_air", onMessageReceived);
        });
        d3.select("#g16").on("click", function () {
            ButtonActionsQueue.getInstance().queueGUIAction("set_needle_size(16)", onMessageReceived);
        });
        d3.select("#g18").on("click", function () {
            ButtonActionsQueue.getInstance().queueGUIAction("set_needle_size(18)", onMessageReceived);
        });
        d3.select("#g20").on("click", function () {
            ButtonActionsQueue.getInstance().queueGUIAction("set_needle_size(20)", onMessageReceived);
        });
        d3.select("#g22").on("click", function () {
            ButtonActionsQueue.getInstance().queueGUIAction("set_needle_size(22)", onMessageReceived);
        });
        d3.select("#g24").on("click", function () {
            ButtonActionsQueue.getInstance().queueGUIAction("set_needle_size(24)", onMessageReceived);
        });
        d3.select("#select_total_body").on("click", function () {
            ButtonActionsQueue.getInstance().queueGUIAction("click_btn_total_body", onMessageReceived);
        });
        d3.select("#bottom1").on("click", function () {
			ButtonActionsQueue.getInstance().queueGUIAction("start_new_procedure", onMessageReceived);

		});
        //d3.select("#middle_row1_col1")[0][0].textContent="65"
        
        start_tick_time();
        //register event listener for websocket connection from the client
        client.addListener('WebSocketConnectionOpened', function (e) {
            console.log("web socket connected");
            //start pvs process
            client.getWebSocket().startPVSProcess({name: "bracco.pvs", demoName: "braccoV0PISA/pvs"}, function (err, event) {
                client.getWebSocket().sendGuiAction("init(0);", onMessageReceived);
            });
        }).addListener("WebSocketConnectionClosed", function (e) {
            console.log("web socket closed");
        }).addListener("processExited", function (e) {
            var msg = "Warning!!!\r\nServer process exited. See console for details.";
            console.log(msg);
        });

        client.connectToServer();

    });
