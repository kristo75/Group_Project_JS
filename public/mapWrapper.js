  const keys = require('./keys.js');
  const Leaflet = require('leaflet');

  const MapWrapper = function(container){
    this.map = Leaflet.map(container);
    this.tile = Leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
      {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.outdoors',
        accessToken: keys.mapbox
      }).addTo(this.map);
    this.userMarker;
    this.locationMarkers = [];
  }

  MapWrapper.prototype.locate = function(view, zoom, watch){
    this.map.locate({setView: view, maxZoom: zoom, watch: watch});
  }

  MapWrapper.prototype.createUserMarker = function(latLng, icon){
    this.userMarker = Leaflet.marker(latLng, {icon: icon}).addTo(this.map);
  }

  MapWrapper.prototype.createLocationMarker = function(latLng, icon, rise, info, className){
    const newMarker = Leaflet.marker(latLng, {icon: icon, riseOnHover: rise})
    .bindPopup(info, className);
    newMarker.addTo(this.map);
    this.locationMarkers.push(newMarker);
  }

  MapWrapper.prototype.repositionUserMarker = function(latLng){
    this.userMarker.setLatLng(latLng);
  }

  MapWrapper.prototype.onEvent = function(event, callback){
    this.map.on(event, callback);
  }

  MapWrapper.prototype.setInitialView = function(latLng, zoom){
    this.map.setView(latLng, zoom);
  }

  MapWrapper.prototype.panToNewCoords = function(latLng){
    this.map.panTo(latLng);
  }

  MapWrapper.prototype.locationListener = function(event, callback){
    this.locationMarkers.forEach(function(location){
      addEventListener(event, callback);
    });
  }

  module.exports = MapWrapper;
