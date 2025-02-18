const socket = io();
console.log("Connected to socket.io");


if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position)=>{
      const {longitude,latitude} =  position.coords;
      socket.emit("send-loaction", {latitude,longitude})
    }, (error)=>{
        console.log(error)
    },
    { 
        enableHighAccuracy :true,
        maximumAge:0,
        timeout:5000
    }
 );
}

const map = L.map("map").setView([0,0],10);


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
attribution : "OpenStreetMap"
}).addTo(map)


const markers = {};



socket.on("receveid-loaction", function(data){
    const {id,latitude,longitude} = data;
    map.setView([latitude,longitude],16);
    if (markers[id]) {
        markers[id].setLatLng([latitude,longitude])
    }else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
});


socket.on("User-Disconnected", (id)=>{
        if (markers[id]) {
            map.removeLayer(markers[id]);
            delete markers[id];
        }
})