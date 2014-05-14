function encodeAudio(data) {
	var reader = new window.FileReader();
	reader.readAsDataURL(data); 
	reader.onloadend = function() {
		$('#audioData').val(reader.result);
	}
}
