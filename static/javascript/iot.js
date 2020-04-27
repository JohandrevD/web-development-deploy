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

document.addEventListener('DOMContentLoaded', check_pi());

function check_pi(){
    console.log('test')
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
            console.log(window.location.href);
            // if(users.includes('Raspberry_Pi')){
            //     window.location.href = window.location.href.split('/')[0] + 'iot';
            // }
            // else{
            //     // alert('Controller is not running');
            //     // window.location.href = window.location.href.split('/')[0] + 'index';
            //     console.log(window.location.href);
            //     // document.querySelector('h5').innerHTML = 'Controller is not running';
            //     // document.getElementById('enter-btn').innerHTML = 'No access';
            // }              
        }
    );
};