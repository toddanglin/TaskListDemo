//This snippet is only needed if trying to support a browser
//that recognizes HTML5 video tag, but doesn't support H264
//(like older versions of Firefox)
if(Modernizr.video.h264 != ""){
	var vid = document.createElement("video");
	vid.src = "content/crazyMan.mp4";
	$(vid).attr("type","video/mp4").attr("autoplay","autoplay").attr("loop","loop").attr("controls","controls").height("200").width("200");
	
	$(vid).append("Video not supported");
	
	$("#vidHolder").empty().append(vid);
}