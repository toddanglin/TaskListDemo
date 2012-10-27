var _mapEle = $("#userMap")[0];

//Instantiate new Google Map					
var latlng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
var myOptions = {
      zoom: 8,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
var map = new google.maps.Map(_mapEle,
        myOptions);
        
//Add a marker at current position        
var marker = new google.maps.Marker({
     map:map,
     draggable:true,
     animation: google.maps.Animation.DROP,
     position: latlng
   });				