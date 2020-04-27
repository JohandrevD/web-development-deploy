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

document.addEventListener('DOMContentLoaded', function(){
    pubnub.subscribe({
        channels: [theChannel],
        withPresence: true
    });
    console.log('Subscribed');
});

document.addEventListener('DOMContentLoaded', listen());

document.addEventListener('DOMContentLoaded', check_pi());

function listen(){
    pubnub.addListener({
        message: function(m) {
            controlMessages(m);
        },
        presence: function(p) {
            controlPresence(p)
        }
    });
};

function controlMessages(msg){
    if(msg.publisher == 'Raspberry_Pi'){
        if(msg.message == 'Access'){
            document.querySelector('body').style.visibility = 'visible';
        }
        if(msg.message == 'No Access'){
            alert('Incorrect password!');
            window.location = window.location.href.split('/iot')[0];
        }
    }
};

function controlPresence(p){  
    if(p.uuid == 'Raspberry_Pi' && p.action == 'leave'){
        alert('Controller is now offline');
        window.location = window.location.href.split('/iot')[0];
    }
};

function check_pi(){
    pubnub.hereNow(
        {
            channels: [theChannel], 
            includeUUIDs: true
        },
        function (status, response) {
            var connected_channel = response.channels['Web_Control']['occupants'];
            var users = [];
            for(let val in connected_channel){
                users.push(connected_channel[val].uuid)
            }
            if(!users.includes('Raspberry_Pi')){
                window.location = window.location.href.split('/iot')[0];
            }
            else{
                var PassWord = prompt("Please enter the password:")

                if(PassWord == null || PassWord == ''){
                    PassWord = prompt("Please enter valid text:")
                }
                else{
                    pubnub.publish({
                        message: PassWord,
                        channel: theChannel
                    });
                }
            }          
        }
    );
};