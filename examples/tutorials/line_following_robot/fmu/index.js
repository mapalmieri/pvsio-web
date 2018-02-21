require.config({
    baseUrl: "../../client/app",
    paths: { d3: "../lib/d3", text: "../lib/text" }
});

require([
    "widgets/core/BasicDisplayEVO",
    "widgets/core/ButtonEVO",
    "PVSioWebClient"
], function (BasicDisplay, Button, PVSioWebClient) {
    "use strict";
    // callback function
    function onMessageReceived(err, res) {
        toggle_disp_color();
    }
    // input widget
    
    var accelerate = new Button("accelerate", {
        top: 493, left: 168, height: 54, width: 54
    }, {
        borderRadius: 8,
        callback: onMessageReceived
    });
    accelerate.render();
    

    
    // auxiliary variable and function used by onMessageReceived for toggling screen color
    var color = "steelblue";
    function toggle_disp_color() {
        color = (color === "steelblue") ? "olive" : "steelblue";
    }

    // web socket client
    var client = PVSioWebClient.getInstance();
    client.port("8084");
    client.addListener("WebSocketConnectionOpened", function (res) {
        console.log("Connection opened!");
    }).addListener("WebSocketConnectionClosed", function (evt) {
        console.log("Connection closed :((");
    });
    client.connectToServer();
});
