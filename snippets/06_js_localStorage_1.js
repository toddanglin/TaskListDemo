//Private API
autoSaveInput: function(e){
	//Auto-save input as it's typed to local storage
	var ele = e.target;
	
	if(m.localstorage){
		localStorage.taskAutoSave = ele.value;
	}
},

loadAutoSaveState: function(){
	//Load any auto-saved values from LocalStorage
	var ele = $eleTxtTask;
	
	if(localStorage.taskAutoSave != undefined){
		ele.val(localStorage.taskAutoSave);
	}
},