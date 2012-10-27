//TaskList application logic

//Put entire application in a global variable
var tasklist = tasklist || {};

//Use self-execution funtion to encapsulate application logic
tasklist = (function($, m, host){
	
	//Public API
	var api = {
	    //saveTask: Saves task and updates UI
	    //params: 
		saveTask: function(e, opts){
			var txt = $("#txtTask");
			
			//TODO - Use a templating solution, like Kendo UI Templates			
			var p = $("#lstTasks");
			
			var newDom = "<li data-task-id=\"8\">"+ txt.val() +"<br /><span>Assigned to: ??</span></li>";

			p.append(newDom);
		},
		
		//init: Performs any app init code (like wiring-up event listeners)
		init: function(){
			//Bind events
			$("#btnSaveTask").on("click", api.saveTask);
					
			$("#lstTasks").on("click","li", function(e){ alert(e.target.dataset.taskId); });		
		}
	}
	
	return api;
}(jQuery, Modernizr, document));