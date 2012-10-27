//Bind the keyup event to save typing
$eleTxtTask.on("keyup", _private.autoSaveInput);

//Check for auto-saved values
_private.loadAutoSaveState();