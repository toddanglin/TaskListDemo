$(window).on("online", api.loadLocation);
			$(window).on("offline", function(){console.log("Browser offline...");});
			if(!navigator.onLine){
				console.log("Offline. Don't load map.");
				$("#userMap").html("You are <b>offline.</b><br />Map unavailable.");
			}
