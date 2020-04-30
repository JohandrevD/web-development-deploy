var mqtt;
var reconnectTimeout = 2000;
var host = "broker.hivemq.com";
var port = 8000;
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
    console.log('Testing')
    mqtt.subscribe(topic);
    // message = new Paho.MQTT.Message("Hello");
    // message.destinationName = "World";
    // mqtt.send(message);
}

function onMessageArrived(r_message)
{	    
    // out_msg = JSON.parse(r_message);
    out_msg = r_message.payloadString
    console.log(r_message.payloadString);
    if('device' in out_msg){
        if(out_msg.device == 'MSC_800'){
            MscController(out_msg.info);
        }
    }
    // console.log('Testing');
    // document.getElementById('msc_info').innerHTML = 'Running';
}

function onFailure(message) {
    console.log("Failed");
    setTimeout(MQTTconnect(), reconnectTimeout);
}

function onConnectionLost(){
    console.log("connection lost");
    MQTTconnect();
}

function MscController(msg){
    var msc_device_name = document.getElementById('msc_device_name_info')

    msc_device_name.innerHTML = msg.device_name;
}

// function SoftwareControler(msg){

// }

// function ErrorController(msg){

// }

