var mqtt;
var reconnectTimeout = 2000;
var host = "test.mosquitto.org";
var port = 8080;
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
    out_msg = JSON.parse(r_message);
    console.log(out_msg);
    document.getElementById('msc_info').innerHTML = out_msg.payloadString;
}

function onFailure(message) {
    console.log("Failed");
    setTimeout(MQTTconnect(), reconnectTimeout);
}

function onConnectionLost(){
    console.log("connection lost");
    MQTTconnect();
}

