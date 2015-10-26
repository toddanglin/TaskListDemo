//Post Message to IFRAME
var o = $("iframe")[0];
o.contentWindow.postMessage("New Task: "+ txt.val(),"http://jsbin.com/");