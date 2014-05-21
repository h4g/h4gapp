function encodeAudio(data) {
	var reader = new window.FileReader();
	reader.readAsDataURL(data); 
	reader.onloadend = function() {
		$('#audioData').val(reader.result);
	}
}
function processImage(file, containerid) {
	var MAX_WIDTH = 320;
	var MAX_HEIGHT = 240;
	var container = document.getElementById(containerid);
	var img = document.createElement('img');
	var canvas = document.createElement('canvas');
	var reader = new FileReader();  
	reader.onload = function(e) {img.src = e.target.result}
	reader.readAsDataURL(file);
	img.onload = function() {
		var width = img.width;
		var height = img.height;
		if (width > height) {
			if (width > MAX_WIDTH) {
				height *= MAX_WIDTH / width;
				width = MAX_WIDTH;
			}
		} else {
			if (height > MAX_HEIGHT) {
				width *= MAX_HEIGHT / height;
				height = MAX_HEIGHT;
			}
		}
		canvas.width = width;
		canvas.height = height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, width, height);	
		container.appendChild(canvas);
	}
}
function getUserInfo(whatId){
	var currentUid =  window.localStorage.getItem("uid");
	var fiblindGetUserInfoAPI= "http://192.168.1.128:3000/user";
	//var fiblindGetClosestAPI = "http://nosferatu.sytes.net:3000/closestSpots";
	$.ajax({
		type: 'GET',
		data: {
			id:whatId,
			uid:currentUid
		},
		url: fiblindGetUserInfoAPI,
		dataType: 'text',
		success: function(data){
			userInfo = JSON.parse(data);
			//TODO: Si no tiene todos los campos rellenos
			var fullName = "";
			fullName += userInfo.firstName+" ";
			fullName += " "+userInfo.lastName;

			$('#fullName').text(fullName);
			$('#livingIn').text(userInfo.living);
			$('#bio').text(userInfo.bio);
			if (userInfo.picture == ""){
				$('#picture').attr('src','./img/no-profile.png');
			} else {
				$('#picture').attr('src','whatever');
			}
			if (userInfo.cover == ""){
				$('#cover').css('background','url(./img/no-cover.png) no-repeat scroll 50% 50% / cover transparent;');
			} else {
				$('#cover').css('background','url(Whatever) no-repeat scroll 50% 50% / cover transparent;');
			}
		},
		error: function(xhr, type){
			console.log('Ajax error!');
			console.log('XHR:'+xhr.readyState);
			console.log(xhr.responseText);
			console.log(xhr.responseXML);
			console.log(xhr.status);
			console.log(xhr.statusText);
			console.log('Type:'+type);
		}
	})
}
