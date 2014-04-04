function errorCallback(error){
	console.log("navigator.getUserMedia error: ", error);
}

function startRecording(stream) {
	console.log('Starting...');
	mediaRecorder = new MediaRecorder(stream);
	mediaRecorder.onerror = function(e){
	    console.log('Error: ' + e);
	};
	mediaRecorder.onstart = function(e){
	    console.log('Started');
	};
	mediaRecorder.onstop = function(e){
	    console.log('Stopped');
	};
	mediaRecorder.onwarning = function(e){
	    console.log('Warning: ' + e);
	};
	// parameter is number of milliseconds of data to return in a single Blob
	mediaRecorder.start();
}
