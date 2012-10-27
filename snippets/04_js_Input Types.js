//Check the form elements' validity
if(!$("form")[0].checkValidity()){
	return; //Invalid - don't continue
}

//Prevent form submit
e.preventDefault();