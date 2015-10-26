//TaskList application logic

//Put entire application in a global variable
var tasklist = tasklist || {};

//Use self-execution funtion to encapsulate application logic
tasklist = (function($, m, host, io, storage){
	var $eleBtnSave,
		$eleListTask,
		$eleTxtTask,
		_mapEle = $("#userMap")[0],
		_dbName = "taskListDb",
		_dBv = 1,
		_socket = null;
		
	var _private = {
		initLocalDb: function(){
			storage.initLocalDb(_dbName, _dBv);
		},
		
		initSocket: function(){
			  if(io === undefined) {
     			console.log("SOCKETS NOT LOADED");
			  	//Mock-out the _socket
			  	_socket = {};
			  	_socket.emit = function(){ /*Do Nothing*/ };
			  	
			  	return; //Sockets not available; don't configure
			  }
			  
			  _socket = io.connect('http://socketdemo.mod.bz/');	
			  
			  console.log("SOCKET", _socket);		  
			
			  _socket.on('connect', function () {
					console.log("Connected to socket server");
					
					_socket.on('message', function (msg) {
						$("body").append('<p>Received: ' + msg + '</p>');
					});
					
					_socket.on('newTask', function(msg){
						var task = $.parseJSON(msg);
						console.log("NEW TASK", task);
						api.saveTask(null, {"task": task, "broadcast": false});
					});
					
					_socket.on('rmTask', function(msg){
						var taskId = msg;
						console.log("RM TASK", taskId);
						api.deleteTask(null, {"taskId": taskId, "broadcast": false})	;
					});		    
			  });					  			  			 
		},
		
		renderList: function(data) {
			//TODO - Use a templating solution, like Kendo UI Templates
			
			var p = $eleListTask;
			
			if(data.length == 0)
				data = [{"id": 0, "text": "No tasks here. Yay!"}];
			
			var newDom = "";
			$.each(data, function(index, item){
				newDom += "<li data-task-id=\""+ item.id +"\" draggable='true'>"+ item.text +"<br /><span>Assigned to: "+ item.user+"</span></li>";		
			});
			
			p.empty();
			p.append(newDom);
		},
		
		getUserLocation: function(){
			if(m.geolocation){
				navigator.geolocation.getCurrentPosition(function(p){										
					var latlng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
					var myOptions = {
					      zoom: 8,
					      center: latlng,
					      mapTypeId: google.maps.MapTypeId.ROADMAP
					    };
					var map = new google.maps.Map(_mapEle,
					        myOptions);
					        
					var marker = new google.maps.Marker({
					     map:map,
					     draggable:true,
					     animation: google.maps.Animation.DROP,
					     position: latlng
					   });
				});
			}
		},
		
		autoSaveInput: function(e){
			//Auto-save input as it's typed to local storage
			var ele = e.target;
			
			if(m.localstorage){
				localStorage.taskAutoSave = ele.value;
			}
		},
		
		loadAutoSaveState: function(){
			var ele = $eleTxtTask;
			
			if(localStorage.taskAutoSave != undefined){
				ele.val(localStorage.taskAutoSave);
			}
		}
	}
	
	var api = {
		saveTask: function(e, opts){
			var txt = $eleTxtTask,
				newTask = null;
				
			//Check the form elements' validity
			//(Also escape on opts === undefined to allow Sockets updates)
			if(opts === undefined && !$("form")[0].checkValidity()){
				return; //Invalid - don't continue
			}

			//Prevent form submit
			if(e !== null) e.preventDefault();
			
			if(opts !== undefined && opts.task !== undefined){
				newTask = opts.task;
			}else{
				newTask = {
					"id": uuid(),
					"text": txt.val(),
					"timestamp": new Date(),
					"user": "SampleUser"
				};
			}
			
			storage.saveTask(newTask, function(key){
				//Task saved! Clear input, auto save, updated list
				txt.val("");
				
				localStorage.taskAutoSave = "";		

				//This will only work for WebSQL
				api.loadAllTasks();	
				
				//Update new task object with key value
				newTask.id = key;
				
				//Update other clients with WebSockets
				if(opts === undefined || opts.broadcast){
					_socket.emit("newTask", JSON.stringify(newTask));
				}
			}, function(){
				//Error handler
				//Most common error is due to duplicate keys (same machine)
				//(reload list anyway)
				console.log("Error saving task");
			},
			function(){
				//This will only work for IndexedDB
				//Transaction complete. Refresh list now.
				console.log("Transaction complete. Refresh.");
				api.loadAllTasks();
			});
		},
		
		deleteTask: function(e, opts){
			var key = null;
			
			if(opts !== undefined){
				key = opts.taskId;
			} else {
				key = $(e.target).data("taskId");
		
				if(key == null || key === 0) return;
			
				var check = confirm("Are you sure you want to delete this task?");
				if(!check) return;
			}
		
			storage.deleteTask(key, function(){
				//Rebind the data display
				console.log("Delete Done.");

				//This will only work for WebSQL
				api.loadAllTasks();
				
				//Update other clients with WebSockets
				if(opts === undefined || opts.broadcast){
					_socket.emit("rmTask", key);
				}
			},
			function(){
				//Most common error is due to item already being deleted
				//(Go ahead and refresh list)
				console.log("Delete Error. Refresh");
			},
			function(){
				//This will work for IndexedDB
				//Transaction complete. Refresh list now.
				console.log("Transaction complete. Refresh.");
				api.loadAllTasks();
			});
		},
		
		assignTaskTo: function(taskId, newUser){
			//Get the task item
			
			var task = api.getTaskById(taskId, function(t){
				if(t === null) return;
				
				t.user = newUser;
				
				api.updateTask(t, function(){
					//OnSuccess for WebSQL
					api.loadAllTasks();
				},
				function(){
					//Transaction complete for IndexedDB
					api.loadAllTasks();
				});
			});						
		},
		
		loadAllTasks: function(){			
			storage.getAllTasks(function(result) {
				console.log("Loaded All Tasks", result);
				_private.renderList(result);
			});
		},
		
		getTaskById: function(taskId, successCallback){
			storage.getTaskById(taskId, function(task){
				successCallback(task);
			});
		},
		
		updateTask: function(task, successCallback, transactionCallback){
			storage.updateTask(task, function(t){
				successCallback(task);
			},
			function(){
				//Error
			},
			function(){
				//Transaction complete (only for IndexedDB)
				if(transactionCallback !== undefined){ transactionCallback(); }
			});
		},
		
		loadLocation: function(){
			_private.getUserLocation();
		},
		
		init: function(eleBtnSave, eleListTask, eleTxtTask){
			//Init element variables
			$eleBtnSave = $(eleBtnSave);
			$eleListTask = $(eleListTask);
			$eleTxtTask = $(eleTxtTask);
			
			//Bind events
			$eleBtnSave.on("click", api.saveTask);
			$eleListTask.on("click","li", api.deleteTask);
			$(host).on("TASK_DB_READY",api.loadAllTasks);

			//Bind the keyup event to save typing
			$eleTxtTask.on("keyup", _private.autoSaveInput);

			//Check for auto-saved values
			_private.loadAutoSaveState();
			
			//Init the IndexedDB store
			_private.initLocalDb();	
			
			//Init web sockets
			_private.initSocket();
			
			
			//Drag-Drop Event Handlers
			$eleListTask.on("dragstart", "li", function(e) {
				e.originalEvent.dataTransfer.effectAllowed = "copy";
				e.originalEvent.dataTransfer.setData("Text", this.dataset.taskId);
});

			$("#team").on("dragover", "li", function(e) {
				if (e.originalEvent.preventDefault) 					e.originalEvent.preventDefault(); // allows us to drop
    				this.className = 'over';
    				e.originalEvent.dataTransfer.dropEffect = 'copy';
    				return false;
			});

			$("#team").on("dragleave", "li", function(e) {
    			this.className = '';
			});
			
			$("#team").on("drop", "li", function(e) {
				if (e.stopPropagation) e.stopPropagation();
	
				var t = e.currentTarget;				
				t.className = '';
	
				//Assign task to target user
				var newUser = (t.innerText || t.textContent),
					taskId = e.originalEvent.dataTransfer.getData("Text");
					console.log("ASSINGING TASK", "TO: "+ newUser, "ID: "+ taskId);
	
				api.assignTaskTo(taskId, newUser);
	
    			return false;
			});												

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
		}
	}
	
	return api;
}(jQuery, Modernizr, document, io, storage));