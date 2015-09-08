RED <- hardware.pin9;
YELLOW <- hardware.pin8;
GREEN <- hardware.pin7;

colors <- {"red": RED, "yellow": YELLOW, "green": GREEN}

foreach (color in colors){
    color.configure(DIGITAL_OUT, 0);
}

function turnOnLight(colorCode){
    // function turn on light and turn other off

    // get state of all lights
    foreach(color, pin in colors){

        if (color == colorCode){
            if (pin.read() != 1){
                pin.write(1);
            }
        }
        else {
            pin.write(0);
        }
    }
}

function askAgentToCheckData(){
    local data = "";
    server.log("Ping agent to get color data...");
    agent.send("getColor", data);
    server.log("Wake up in 5 minutes to pull data again");
    imp.wakeup(300, askAgentToCheckData);
}

agent.on("setColor", turnOnLight);
askAgentToCheckData();