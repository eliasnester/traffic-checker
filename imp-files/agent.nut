local webServiceURL = "http://you_traffic_checker_api:8080/api/route/start_point/destination/"

function handleResponse(responseTable) {
    // Called when the imp receives a response from the remote service
    if (responseTable.statuscode == 200) {
        local response = http.jsondecode(responseTable.body);
        local color = response[0]["color"];
        server.log("Response: " + response);
        server.log("Traffic color: " + color);
        device.send("setColor", color);
    } else {
        // Log an error
        // TODO: add error handler on device
        // to indicate the problem e.g. flash red light or something
        server.log("Error response: " + responseTable.statuscode);
    }
}


function getData(data){
    // Send the request asynchronously. This will not block the imp CPU
    local request = http.get(webServiceURL)
    request.sendasync(handleResponse);   
}

device.on("getColor", getData);

