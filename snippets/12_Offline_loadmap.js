if(window.google === undefined){
					console.log("Load the Google Maps script...");
					//Reload the script
					var head= document.getElementsByTagName("head")[0],
				   		script= document.createElement("script");
				   
				   script.src= "//maps.googleapis.com/maps/api/js?key=AIzaSyAO2hxQ0uMBEBvY9FpEm22DRMFV2EQdQAA&sensor=false&callback=tasklist.loadLocation";
				   head.appendChild(script);

				   return;
				}