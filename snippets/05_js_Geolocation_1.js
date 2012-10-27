//Private app API methods
var _private = {
		//Get user location using HTML5 Geolocation
		getUserLocation: function(){
			if(m.geolocation){
			navigator.geolocation.getCurrentPosition(function(p){
					alert("You are at: "+ p.coords.longitude +", "+ p.coords.latitude);					
				});
			}
		}
};