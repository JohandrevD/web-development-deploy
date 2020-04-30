function DropDown() {
    document.getElementById("DropdownContent").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown_content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

var a = document.getElementById("test_wrapper_id");
var b = document.getElementById("msc_wrapper_id");
var c = document.getElementById("software_wrapper_id");
var d = document.getElementById("error_wrapper_id");

function drop_output(){    
    console.log(a.style.display)
    a.style.display = "grid";
    b.style.display = "none";
    c.style.display = "none";
    d.style.display = "none";

    a.classList.add('section_wrapper')
    b.classList.remove('section_wrapper')
    c.classList.remove('section_wrapper')
    d.classList.remove('section_wrapper')
};

function drop_msc(){    
    console.log(a.style.display)
    a.style.display = "none";
    b.style.display = "grid";
    c.style.display = "none";
    d.style.display = "none";

    a.classList.remove('section_wrapper')
    b.classList.add('section_wrapper')
    c.classList.remove('section_wrapper')
    d.classList.remove('section_wrapper')
};

function drop_software(){    
    console.log(a.style.display)
    a.style.display = "none";
    b.style.display = "none";
    c.style.display = "grid";
    d.style.display = "none";

    a.classList.remove('section_wrapper')
    b.classList.remove('section_wrapper')
    c.classList.add('section_wrapper')
    d.classList.remove('section_wrapper')
};

function drop_errors(){    
    console.log(a.style.display)
    a.style.display = "none";
    b.style.display = "none";
    c.style.display = "none";
    d.style.display = "grid";

    a.classList.remove('section_wrapper')
    b.classList.remove('section_wrapper')
    c.classList.remove('section_wrapper')
    d.classList.add('section_wrapper')
};

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
    out_msg = JSON.parse(r_message.payloadString);
    // out_msg = r_message.payloadString
    if('device' in out_msg){
        console.log(out_msg)
        if(out_msg.device == 'MSC_800'){
            MscController(out_msg.info);
        }
        if(out_msg.device == 'Software'){
            SoftwareControler(out_msg.info);
        }
    }
    if('event' in out_msg){
        if(out_msg.event == 'errors'){
            ErrorController(out_msg.info);
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
    var msc_device_id = document.getElementById('msc_device_id_info')
    var msc_system_ready = document.getElementById('msc_system_ready_info')
    var msc_dio_1 = document.getElementById('msc_dio_1_info')

    msc_device_name.innerHTML = msg.device_name;
    msc_device_id.innerHTML = msg.device_id;
    msc_system_ready.innerHTML = msg.system_ready;
    msc_dio_1.innerHTML = msg.dio_a;

    if(msg.system_ready == '0'){msc_dio_1.classList.add('triggered');}
    else{msc_dio_1.classList.remove('triggered');}
    if(msg.dio_a == '1'){msc_dio_1.classList.add('triggered');}
    else{msc_dio_1.classList.remove('triggered');}
}

function SoftwareControler(msg){
    var software_number = document.getElementById('software_number_info')
    var software_date = document.getElementById('software_date_info')
    var software_time = document.getElementById('software_time_info')
    var software_barcode = document.getElementById('software_barcode_info')
    var software_length = document.getElementById('software_length_info')
    var software_width = document.getElementById('software_width_info')
    var software_height = document.getElementById('software_height_info')
    var software_volume = document.getElementById('software_volume_info')
    var software_weight = document.getElementById('software_weight_info')

    software_number.innerHTML = msg.number;
    software_date.innerHTML = msg.date;
    software_time.innerHTML = msg.time;
    software_barcode.innerHTML = msg.barcode;
    software_length.innerHTML = msg.length;
    software_width.innerHTML = msg.width;
    software_height.innerHTML = msg.height;
    software_volume.innerHTML = msg.volume;
    software_weight.innerHTML = msg.weight;

    if(msg.barcode == 'NoRead'){software_barcode.classList.add('triggered');}
    else{software_barcode.classList.remove('triggered');}
    if(msg.length == '0.00'){software_length.classList.add('triggered');}
    else{software_length.classList.remove('triggered');}
    if(msg.width == '0.00'){software_width.classList.add('triggered');}
    else{software_width.classList.remove('triggered');}
    if(msg.height == '0.00'){software_height.classList.add('triggered');}
    else{software_height.classList.remove('triggered');}
    if(msg.volume == '0.00'){software_volume.classList.add('triggered');}
    else{software_volume.classList.remove('triggered');}
    if(msg.weight == '0.00'){software_weight.classList.add('triggered');}
    else{software_weight.classList.remove('triggered');}
}

function ErrorController(msg){
    var icr890_1_error = document.getElementById('icr890_1_error_info')
    var scale_error = document.getElementById('scale_error_info')

    icr890_1_error.innerHTML = msg.ICR890_1;
    scale_error.innerHTML = msg.Scale;

    if(msg.ICR890_1 == 'Fault'){icr890_1_error.classList.add('triggered');}
    else{icr890_1_error.classList.remove('triggered');}
    if(msg.Scale == 'Fault'){scale_error.classList.add('triggered');}
    else{scale_error.classList.remove('triggered');}
}
var out_val = 0;

function changeOutput(){
    if(out_val == 0){
        // message = new Paho.MQTT.Message("Hello");
        // message.destinationName = "World";
        // mqtt.send(message);
    }
    else{
        // message = new Paho.MQTT.Message("Hello");
        // message.destinationName = "World";
        // mqtt.send(message);
    }
}

function SendMessage(){
    var message_value = JSON.stringify({'message': document.getElementById('txt_message').value});

    console.log(message_value)

    message = new Paho.MQTT.Message(message_value);
    message.destinationName = topic;
    mqtt.send(message);
}

var btn_val = 0

function changeOutput(){

    if(btn_val == 0){
        send_btn_val = 1;
        btn_val = 1
    }
    else if(btn_val == 1){
        send_btn_val = 0
        btn_val = 0
    }
    var message_value = JSON.stringify({'button': 'sMN mDOSetOutput 1 ' + send_btn_val});

    console.log(message_value)

    message = new Paho.MQTT.Message(message_value);
    message.destinationName = topic;
    mqtt.send(message);
}

