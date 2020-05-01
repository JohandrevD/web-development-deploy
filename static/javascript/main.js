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