//TaskList application logic

//Put entire application in a global variable
var tasklist = tasklist || {};

//Use self-execution funtion to encapsulate application logic
tasklist = (function($, m, host){
	//Elements
	var $eleBtnSave,
		$eleListTask,
		$eleTxtTask;
		
	//Public API
	var api = {
	    //saveTask: Saves task and updates UI
	    //params: 
		saveTask: function(e, opts){
			var txt = $eleTxtTask,
				p = $eleListTask,
				newDom;
			
			//TODO - Use a templating solution, like Kendo UI Templates			
			newDom = "<li data-task-id=\"8\">"+ txt.val() +"<br /><span>Assigned to: ??</span></li>";

			p.append(newDom);
		},
		
		//init: Performs any app init code (like wiring-up event listeners)
		init: function(eleBtnSave, eleListTask, eleTxtTask){
			//Init element variables
			$eleBtnSave = $(eleBtnSave);
			$eleListTask = $(eleListTask);
			$eleTxtTask = $(eleTxtTask);
			
			//Bind events
			$eleBtnSave.on("click", api.saveTask);					
			$eleListTask.on("click","li", function(e){ alert(e.target.dataset.taskId); });		
		}
	}
	
	return api;
}(jQuery, Modernizr, document));