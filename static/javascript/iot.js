if(!!window.performance && window.performance.navigation.type === 2)
{
    console.log('Reloading');
    window.location.reload();
}

var t_day=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var t_month=["January","February","March","April","May","June","July","August","September","October","November","December"];

var lamp_status = true;
var lamp_button = document.getElementById('lamp_icon');

//  Function to get and display the server status
function GetServerStatus()
{
    //Setup server status server sent event endpoint
    var ServerStatusSource = new EventSource('/server_status/');

    ServerStatusSource.onmessage = function(e)
    {
        document.getElementById('server_status_value').innerHTML = e.data;
    }
}

//  Function to get and display the current time and date
function GetClock()
{
    var d = new Date();
    var n_day = d.getDay(), n_month = d.getMonth(), n_date = d.getDate(), n_year = d.getFullYear();
    var n_hour = d.getHours(), n_min = d.getMinutes(), n_sec = d.getSeconds();

    if(n_min<=9) n_min = "0" + n_min;
    if(n_sec<=9) n_sec = "0" + n_sec;

    var time_text = "" + n_hour + ":" + n_min + ":" + n_sec + "";
    var date_text = "" + t_day[n_day] + ", " + n_date + " " + t_month[n_month] + " " + n_year;
    document.getElementById('time_display').innerHTML = time_text;
    document.getElementById('date_display').innerHTML = date_text;
}

GetClock();
setInterval(GetClock,1000);

// ----- PubNub control starts here ----- //
const clientUUID = 'Website_IoT_HTML';
const theChannel = 'Web_Control';

const pubnub = new PubNub({
    publishKey: 'pub-c-723918b5-9e0d-4820-a277-3dda21d465cb',
    subscribeKey: 'sub-c-3e28b73e-8348-11ea-881d-66486515f06e',
    uuid: clientUUID,
    heartbeatInterval: 1,
    keepAlive: true
});

pubnub.subscribe({
    channels: [theChannel],
    withPresence: true
});

pubnub.hereNow(
    {
        channels: [theChannel], 
        includeUUIDs: true
    },
    function (status, response) {
        var connected_channel = response.channels['Web_Control']['occupants'];
        var users = [];
        for(let val in connected_channel){
            users.push(connected_channel[val].uuid);
        }
        if(!users.includes('Raspberry_Pi')){
            window.location = window.location.href.split('/iot')[0];
        }
        else{
            var PassWord = prompt("Please enter the password:");

            if(PassWord == null || PassWord == ''){
                PassWord = prompt("Please enter valid text:");
            }
            else{
                // console.log(PassWord);
                pubnub.publish({
                    message: {
                        'password': PassWord},
                    channel: theChannel
                });
            }
        }          
    }
);

pubnub.addListener({
    message: function(m) {
        controlMessages(m);
    },
    presence: function(p) {
        controlPresence(p)
    }
});

function controlMessages(m){
    if(m.publisher == 'Raspberry_Pi'){
        if(m.message['access'] == 'Access'){
            document.querySelector('body').style.visibility = 'visible';
        }
        else if(m.message['access'] == 'No Access'){
            alert('Incorrect password!');
            window.location = window.location.href.split('/iot')[0];
        }
    }
};

function controlPresence(p){  
    console.log(p.uuid + ' - ' + p.action)

    if(p.uuid == 'Raspberry_Pi' && p.action == 'leave'){
        alert('Controller is now offline');
        pubnub.unsubscribeAll();
        window.location = window.location.href.split('/iot')[0];
    }
};

// // function arm_checkbox(){
// //     var arm_disarm_checkbox = document.getElementById('armed-button')

// //     if(arm_disarm_checkbox.checked == true){
// //         pubnub.publish({message: {alarm: 'Armed'}, channel: theChannel});
// //     }
// //     else{
// //         pubnub.publish({message: {alarm: 'Disarmed'}, channel: theChannel});
// //     }
// // }
