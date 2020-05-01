if(!!window.performance && window.performance.navigation.type === 2)
{
	window.location.reload();
	console.log('Reloading');
}

// Init on DOM load
document.addEventListener('DOMContentLoaded', init)

// ----- Typewriter code starts here ----- //
const TypeWriter = function(txtElement, words, wait = 3000){
	this.txtElement = txtElement;
	this.words = words;
	this.txt = '';
	this.wordIndex = 0;
	this.wait = parseInt(wait, 10);
	this.isDeleting = false;
	this.type();
}

// Type method
TypeWriter.prototype.type = function(){
	const currentIndex = this.wordIndex % this.words.length;                    // Current index of word
	const fullTxt = this.words[currentIndex];                                   // Get full text of current word

	if(this.isDeleting){
		this.txt = fullTxt.substring(0, this.txt.length - 1)                    // Remove char
	}else{
		this.txt = fullTxt.substring(0, this.txt.length + 1)                    // Add char
	}

	this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`          // Insert txt into element

	let typeSpeed = 300;                                                        // Initial type speed

	if(this.isDeleting){typeSpeed /= 2;}

	// Check if word is complete
	if (!this.isDeleting && this.txt === fullTxt){
		typeSpeed = this.wait;                                                  // Pause at end
		this.isDeleting = true;                                                 // Set delete to true
	}
	else if(this.isDeleting && this.txt === ''){
		this.isDeleting = false;
		this.wordIndex++;                                                       // Move to the next word
		typeSpeed = 500;                                                        // Pause before start typing
	}

	setTimeout(() => this.type(), typeSpeed)
}

// Init App
function init(){
	const txtElement = document.querySelector('.txt-type');
	const words = JSON.parse(txtElement.getAttribute('data-words'));
	const wait = txtElement.getAttribute('data-wait');

	// Init Typewriter
	new TypeWriter(txtElement, words, wait);
}
// ----- Typewriter code ends here ----- //

// ----- PubNub control starts here ----- //
const clientUUID = 'Website_Index_HTML';
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

pubnub.addListener({
	message: function(m) {
		// console.log('Message')
	},
	presence: function(p) {
		controlPresence(p)
	}
});

function controlPresence(p){  
	console.log(p.uuid + ' - ' + p.action)

	if(p.uuid == 'Raspberry_Pi_Controller' && p.action == 'join'){
		alert('Controller is now online');
		document.querySelector('h5').innerHTML = 'Ready to control';
		document.getElementById('enter-btn').innerHTML = 'Enter';
	}
	else if(p.uuid == 'Raspberry_Pi_Controller' && p.action == 'leave'){
		alert('Controller is not running');
		document.querySelector('h5').innerHTML = 'Controller is not running';
		document.getElementById('enter-btn').innerHTML = 'No access';
	}
};

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
		if(!users.includes('Raspberry_Pi_Controller')){
			document.querySelector('h5').innerHTML = 'Controller is not running';
			document.getElementById('enter-btn').innerHTML = 'No access';
		}
		else if(users.includes('Raspberry_Pi_Controller')){
			document.querySelector('h5').innerHTML = 'Ready to control';
			document.getElementById('enter-btn').innerHTML = 'Enter';
		}              
	}
);

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
			if(users.includes('Raspberry_Pi_Controller')){
				pubnub.unsubscribeAll();
				window.location.href = window.location.href.split('/')[0] + 'iot';
			}
			else{
				alert('Controller is not running');
				document.querySelector('h5').innerHTML = 'Controller is not running';
				document.getElementById('enter-btn').innerHTML = 'No access';
			}              
		}
	);
};

// ----- PubNub control starts here ----- //