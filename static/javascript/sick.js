var mqtt;
var reconnectTimeout = 2000;
var host = "192.168.8.104";
var port = 9001;
var topic = 'TDC_E_Comms';

MQTTconnect();

function MQTTconnect(){
    mqtt = new Paho.MQTT.Client(host, port, 'Johandre');

    var options = {
        timeout: 3,
        onSuccess: onConnect,
        onFailure: onFailure
    };

    mqtt.onMessageArrived = onMessageArrived;

    mqtt.connect(options);
    return false;
}

function onConnect(){
    console.log('Connectedsssss');
    console.log("Subscribing to topic ="+topic);
    mqtt.subscribe(topic);
    message = new Paho.MQTT.Message("Hello");
    message.destinationName = "World";
    mqtt.send(message);
}

function onMessageArrived(r_message)
{	    
    out_msg = r_message.payloadString;
    console.log(out_msg);
}

function onFailure(message) {
    console.log("Failed");
    setTimeout(MQTTconnect(), reconnectTimeout);
}

function onConnectionLost(){
    console.log("connection lost");
    MQTTconnect();
}

