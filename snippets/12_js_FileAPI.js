		//Add to App INIT
		//Drop File handlers
			$("#importTask").on("dragover","p", function(e){
				if (e.originalEvent.preventDefault) e.originalEvent.preventDefault(); // allows us to drop
				
				this.className = "hover";

				return false;
			});

			$("#importTask").on("dragleave dragend", "p",function(e){
				e.originalEvent.preventDefault();

				this.className = "";

				return false;
			});

			$("#importTask").on("drop","p", function(e){
				e.originalEvent.preventDefault();
				this.className = "";

				var file = e.originalEvent.dataTransfer.files[0],
			      reader = new FileReader();

			  	reader.onloadend = function(event) {
			  		console.log("FileReader LoadEnd", event, reader.result);
			  		var taskTxt = reader.result;
			  		if(taskTxt !== ""){
			  			//Create task object
			  			var newTask = {
							"id": uuid(),
							"text": taskTxt,
							"timestamp": new Date(),
							"user": "SampleUser"
						};

			  			//Save task
			  			api.saveTask(null, {"task": newTask, "broadcast": true});
			  		}
			  	};

			  	if(file.type === "text/plain"){
			  		reader.readAsText(file);
			  	}

				return false;
			});