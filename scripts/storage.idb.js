var storageIDB = (function($, host){
	//"FIX" for non-standard indexedDB namespacing
	var indexedDB = window.indexedDB || window.webkitIndexedDB ||
	                	window.mozIndexedDB;
	
	if ('webkitIndexedDB' in window) {
	  window.IDBTransaction = window.webkitIDBTransaction;
	  window.IDBKeyRange = window.webkitIDBKeyRange;
	}
	//END FIX
	
	var _db = null,
		_dbName = null;
	
	return{
		initLocalDb: function(name, version) {
			console.log("Initializing the local DB");
			
			_dbName = name;
			
			//Try reseting the DB
			//var t = indexedDB.deleteDatabase(_dbName);
			//t.onsuccess = t.onerror = t.onblocked = function (e) { console.log("DELETE DB", e); };
			
			var r = indexedDB.open(_dbName, version);
			//var r = {};

			r.onupgradeneeded = function(e){
				var trans = e.target.transaction;
				console.log(trans);
				//Set the shared _db variable
				_db = e.target.result;

				//Delete old versions
				//_db.deleteObjectStore(_dbName);

				//Define object store schema
				var store = _db.createObjectStore(_dbName, {keyPath:"id",autoIncrement:false});
				
				store.createIndex("timestamp", "timestamp", {unique:false});
				
				console.log("IndexedDb store created/opened");
				
				//Handle version change complete	
				trans.oncomplete = function(){ 
					console.log("Task DB Upgraded & Ready", _dbName, _db.version);
					$(host).trigger("TASK_DB_READY");					
				};
			};

			r.onblocked = function(e){
				console.log("BLOCKED", e, r)
			};
			
			r.onsuccess = function(e){
				_db = e.target.result;
				//DB version is correct		
				console.log("Task DB Ready", _dbName);			
				$(host).trigger("TASK_DB_READY");
			};
			
			r.onerror = function(e){
				//TODO add error logging
				//r.result.close();

				

				console.log("Error creating/opening DB", r, e);
			};
		},
		
		saveTask: function(task, successCallback, errorCallback, transactionCallback) {
			//Persist for longer term storage to IndexedDb
			var tx = _db.transaction([_dbName], "readwrite"),
				store = tx.objectStore(_dbName);
				
			var request = store.add(task);
			
			request.onsuccess = function(s){
				successCallback(request.result);				
			};
			
			request.onerror = function(e) {
				//TODO log errors
				console.log("Error saving task to DB");
				
				errorCallback();
			};

			tx.oncomplete = function(){
				if(transactionCallback !== undefined){ transactionCallback(); }
			}
		},
		
		deleteTask: function(key, successCallback, errorCallback, transactionCallback){
			var tx = _db.transaction([_dbName], "readwrite"),
				request = tx.objectStore(_dbName).delete(key);
			
			request.onsuccess = function() {
				successCallback();
			};
			
			request.onerror = function(e) {
				//TODO log error
				console.log("Error removing task from DB");
				
				errorCallback();
			};

			tx.oncomplete = function(){
				if(transactionCallback !== undefined){ transactionCallback(); }
			}
		},
		
		updateTask: function(task, successCallback, errorCallback, transactionCallback) {
			var tx = _db.transaction([_dbName], "readwrite"),
				keyRange = IDBKeyRange.only(task.id),
				cursor = tx.objectStore(_dbName).openCursor(keyRange);
			
			cursor.onsuccess = function(e){
				var csr = e.target.result;
				if(csr){
					updateReq = csr.update(task);
					
					updateReq.onsuccess = function(evt) {
						successCallback(task);
					};
					
					updateReq.onerror = function(evt){ 
						//TODO error logging
						console.log("Error updating task in DB");
					};
				}
			};
			
			cursor.onerror = function(e){
				//TODO error logging
				console.log("Error getting update cursor");
			};

			tx.oncomplete = function(){
				if(transactionCallback !== undefined){ transactionCallback(); }
			}
		},
		
		getAllTasks: function(successCallback, errorCallback){
			var trans = _db.transaction([_dbName], "readonly"); //Implied read-only
			var store = trans.objectStore(_dbName);
			
			//Define query
			var keyRange = IDBKeyRange.lowerBound(0);
			var cursor = store.index("timestamp").openCursor(keyRange);
			
			var tasks = [];
			cursor.onsuccess = function(e){
				var result = e.target.result;
				
				if(result) { //loop the cursor
					tasks.push(result.value);	
					result.continue();
				}
				else{ //cursor is done
					successCallback(tasks);	
					console.log("All available tasks loaded from DB");
				}								
			}; 
			
			cursor.onerror = function() {
				//TODO log errors
				console.log("Error loading all tasks.");
			};
		},
		
		getTaskById: function(key, successCallback, errorCallback){
			var request = _db.transaction([_dbName], "readonly").objectStore(_dbName).get(key);
			
			request.onsuccess = function(e) {
				successCallback(request.result);
			};
			
			request.onerror = function(e){
				//TODO log error
				console.log("Error getting task by ID from DB");
			};
		}
	}
}(jQuery, document));