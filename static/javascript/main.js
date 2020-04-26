// PubNub control starts here
const clientUUID = 'Johandré-website';
const theChannel = 'web-control';

const pubnub = new PubNub({
    publishKey: 'pub-c-723918b5-9e0d-4820-a277-3dda21d465cb',
    subscribeKey: 'sub-c-3e28b73e-8348-11ea-881d-66486515f06e',
    uuid: clientUUID,
    heartbeatInterval: 1,
    keepAlive: true
});

function listen(){
    pubnub.addListener({
        message: function(m) {
            console.log('Message')
        },
        presence: function(p) {
            console.log('Presence')
        }
    });
};

function controlMessages(msg){
    console.log(msg);
};

function controlPresence(userID, userAction, date_time){  
    if(userID == 'Raspberry-pi') {
        getTimeFormat(date_time);
        if(userAction == "leave"){
            sendMail('Raspberry Pi', 'Disconnected')
        }
        else if(userAction == 'join'){
            sendMail('Raspberry Pi', 'Connected')
        }
    }
};


document.addEventListener('DOMContentLoaded', function(){
    pubnub.subscribe({
        channels: [theChannel],
        withPresence: true
    });
    console.log('Subscribed');
});

document.addEventListener('DOMContentLoaded', listen());