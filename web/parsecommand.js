var map;
var gcommand;
var http;

function initCommander(map_given){
    map = map_given;
}

function initRequest() {
    if (window.XMLHttpRequest) {
        if (navigator.userAgent.indexOf('MSIE') != -1) {
            isIE = true;
        }
        return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        isIE = true;
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function parseCommand(command, parameter){
    gcommand = command;
    if(command == "add"){
        addNode(parameter);
    } else if(command == "remove") {
        removeNode(parameter);
    }
}

function addMapsCallBack(results, status){
    if(status == google.maps.places.PlacesServiceStatus.OK){
        // tell server
        var place = results[0];
        var lat = place.geometry.location;
        var long = lat.lng();
        var lat = lat.lat();
        http = initRequest();
        http.open("GET", "ItineraryServlet?action=submit&actid=" 
                + gcommand + "&lat=" + lat + "&long=" + long + "&name=" + parameter, true);
        http.onreadystatechange = serverCallBack;
        http.send(null);
    } else {
        alert("No such location was found!");
    }
}

// ask google
function addNode(parameter){
    var request = {
        query: parameter
    };
    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, addMapsCallBack);
}

function serverCallBack(){
    if (http.readyState == 4) {
        if (http.status == 200) {
            var tst = http.responseXML.getElementsByTagName("p");
            if(tst!=null){
               tst = tst[0].firstChild.nodeValue;
               alert(tst);
            } else {
               alert("Your itinerary is now blank.");
            }
        }
    }
}

function removeNode(id){
    http = initRequest();
    alert(id);
    http.open("GET", "ItineraryServlet?action=submit&actid=" 
        + gcommand + "&id=" + id, true);
    http.onreadystatechange = serverCallBack;
    http.send(null);
}
