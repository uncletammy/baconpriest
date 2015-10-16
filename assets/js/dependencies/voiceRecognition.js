// Create globals
var final_transcript = '';
var interim_transcript = '';
var finalCount = 0;
var interimCount = 0;
var totalCount = 0;
var recognizing = false;
var flashActive = false;

// Create speech recognition object
var recognition = new webkitSpeechRecognition();

// Set counter text
// count.innerHTML = totalCount;

// Set recognition object default properties
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

// On recording start callback
recognition.onstart = function() {
  recognizing = true;
}

// On result callback
// process the audio input
recognition.onresult = function(event) {

  ////
  // Transcription
  ////

  // Interim transcript for immediate results, but not as accurate
  var interim_transcript = '';

  // Iterate through the array of results 
  // and build transcript strings
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      final_transcript += event.results[i][0].transcript;
      interimCount = 0;
    }
    else{
      if(event.results[i][0].confidence > 0.8){
        interim_transcript = event.results[i][0].transcript;
      }
    }
  }

  // If this is a final transcription
  if(final_transcript.length > 0){
    
    // Detect the word "hibiscus"
    // to reset the counter
    if(final_transcript.indexOf('hibiscus') > 0){
      resetCounter();
      return;
    }

    // Populate the final counter with the final string length
    finalCount = final_transcript.length;
  }

	console.log('final_transcript:',final_transcript);
};

function startButton(event) {
  final_transcript = '';
  recognition.start();
}

window.recognition = recognition;