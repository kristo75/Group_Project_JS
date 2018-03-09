const keys = require('./keys.js');
const Leaflet = require('leaflet');

const Map = function(container){
  this.map = Leaflet.map(container);
  this.tile = Leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
      {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.outdoors',
        accessToken: keys.mapbox
      }).addTo(this.map);
    this.userMarker = null;
    //this.geolocate = this.geolocate.bind(this);
}

Map.prototype.geolocate = function(view, zoom, watch){
  this.map.locate({setView: view, maxZoom: zoom, watch: watch});
    function onLocationFound(e){
      if (this.userMarker){
        this.userMarker.setLatLng(user.location)
      } else {
        console.log(this);
        this.addUserMarker(e.latlng, 'user_marker.png', [50,100])
      }
      console.log(e.latlng);
      this.userLocation = e.latlng;

      return e.latlng;
    }
    this.map.on('locationfound', onLocationFound);
}

Map.prototype.buildIconMarker = function(iconUrl, iconAnchor){
  return Leaflet.icon({
    iconUrl: iconUrl,
    // iconSize:     [60, 120] // size of the icon
    iconAnchor:   iconAnchor // point of the icon which will correspond to marker's location
    // popupAnchor:  [15, -20] // point from which the popup should open relative to the iconAnchor
  });

}


Map.prototype.addUserMarker = function(userLocation, iconImage, iconAnchor){
  const markerIcon = this.buildIconMarker(iconImage, iconAnchor)
  console.log(map);
  this.userMarker = Leaflet.marker([userLocation.lat, userLocation.lng],{icon: markerIcon}).addTo(this.map);

}

Map.prototype.updateUserMarker = function(newLocation){
  this.userMarker.setLatLng(newLocation);
}
module.exports = Map;
