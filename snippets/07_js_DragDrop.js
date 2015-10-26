//Drag-Drop Event Handlers
$eleListTask.on("dragstart", "li", function(e) {
	e.originalEvent.dataTransfer.effectAllowed = "copy";
	e.originalEvent.dataTransfer.setData("Text", this.dataset.taskId);
});

$("#team").on("dragover", "li", function(e) {
	if (e.originalEvent.preventDefault) e.originalEvent.preventDefault(); // allows us to drop
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
	
	//api.assignTaskTo(taskId, newUser);
	
    return false;
});
	