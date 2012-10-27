var storageSQL = (function($, host){

	var _db = null,
		_dbName = null;
	
	return{
		initLocalDb: function(name, version) {
			console.log("Initializing the local DB");
			var dbSize = 5 * 1024 * 1024; //5MB
			
			_dbName = name;
			
			//Creates and names object store (description optional)
			
			_db = openDatabase(_dbName, "", "", dbSize, function(db){
				//Success callback
				console.log("Database with name "+ _dbName +" created/opened.");					

				_db.transaction(function(tx){
					tx.executeSql('CREATE TABLE IF NOT EXISTS tasks(id TEXT PRIMARY KEY, text TEXT, timestamp TEXT, user TEXT)',[],
							function(){
								console.log("Created table 'tasks' (if needed)");
								
								$(host).trigger("TASK_DB_READY");
							},
							function(){console.log("Failed to create table 'tasks'");}
					);
				});
			});

			console.log("DB Version", _db.version);
			
		},
		
		saveTask: function(task, successCallback, errorCallback) {
			console.log("SQL SAVE", task);
			//Persist for longer term storage to IndexedDb
			_db.transaction(function(tx){
				tx.executeSql('INSERT INTO tasks(id, text, timestamp, user) VALUES (?,?,?,?)',
					[task.id, task.text, task.timestamp, task.user],
					function(tx,rs){
						console.log("Successfully inserted task!");
						
						successCallback(rs.insertId);
					},
					function(e){
						console.log("Failed to insert task.");
						
						errorCallback();
					}
				);
			});
		},
		
		deleteTask: function(key, successCallback, errorCallback){
			_db.transaction(function(tx){
				tx.executeSql("DELETE FROM tasks WHERE id = ?", 
					[key],
					function(){
						console.log("Task with ID "+ key +" removed from DB."); 
						
						successCallback();
					},
					function(){
						//TODO log error
						console.log("Error removing task from DB");
						
						errorCallback();
					}
				);
			});
		},
		
		updateTask: function(task, successCallback, errorCallback) {
			_db.transaction(function(tx){
				tx.executeSql("UPDATE tasks SET text = ?, user = ? WHERE id = ?",
				[task.text, task.user, task.id],
				function(tx,rs){
					successCallback(task);
				},
				function(){
					//TODO error logging
					console.log("Error updating task in DB");
				}); 
			});
		},
		
		getAllTasks: function(successCallback, errorCallback){
			_db.transaction(function(tx){
				tx.executeSql("SELECT * FROM tasks ORDER BY timestamp",
				[],
				function(tx,rs){
					var tasks = [];
				
					for (var i = 0; i < rs.rows.length; i++) {
						var r = rs.rows.item(i),
							task = {
								"id": r.id,
								"text": r.text,
								"timestamp": r.timestamp,
								"user": r.user
							};
						
						tasks.push(task);	
					}
				
					successCallback(tasks);
				},
				function(){
					//TODO log errors
					console.log("Error loading all tasks.");
				});
			});
		},
		
		getTaskById: function(key, successCallback, errorCallback){
			_db.transaction(function(tx){
				tx.executeSql("SELECT * FROM tasks WHERE id = ?",
				[key],
				function(tx,rs){
					var r = rs.rows.item(0),
						task = {
							"id": r.id,
							"text": r.text,
							"timestamp": r.timestamp,
							"user": r.user
						};
				
					successCallback(task);
				},
				function(){
					//TODO log errors
					console.log("Error getting task by ID from DB.");
				});
			});
		}
	}
}(jQuery, document));