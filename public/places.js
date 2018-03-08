const keys = require('./keys.js');

const Places = function() {
  this.pois = [];
  this.displayPOIS = this.displayPOIS.bind(this);
  this.poisToDisplay = [];
  this.hasPlaces = false;

}



Places.prototype.getPlacesPOIs = function(latLng, callback){
  this.hasPlaces = true;

  const poiTypes = ['sightseeing'];

  const lat = latLng.lat;
  const lng = latLng.lng;

  const calculateBounds = function(lat, lng){
    const R = 6371;  // earth radius in km
    const radius = 5000; // meters
    const x1 = lng - (Math.PI/180)*(radius/R/Math.cos(lat*(Math.PI/180)));
    const x2 = lng + (Math.PI/180)*(radius/R/Math.cos(lat*(Math.PI/180)));
    const y1 = lat + (Math.PI/180)*(radius/R);
    const y2 = lat - (Math.PI/180)*(radius/R);
    const bounds = y2 + ',' + x1 +',' + y1 + ',' + x2;
    return bounds;
  };

  const bounds = calculateBounds(lat, lng);
  const url = 'https://api.sygictraveldata.com/1.0/en/places/list?bounds='+ bounds + '&level=poi&categories=' + poiTypes + '&limit=50'
  const request = new XMLHttpRequest();
  request.open('GET', url)
  request.setRequestHeader('x-api-key', keys.sygicTravel)
  request.addEventListener('load', function(){
    const jsonString = request.responseText
    this.pois = JSON.parse(jsonString).data.places;
}.bind(this));
  request.send();

  setTimeout(function(){
    this.displayPOIS();
    callback(this.poisToDisplay);
  }.bind(this), 1000);
}


Places.prototype.displayPOIS = function(){
  for (var i = 0; i < 5; i++) {
    this.poisToDisplay.push(this.pois.splice(Math.floor(Math.random()*this.pois.length), 1)[0]);
  }
}

module.exports = Places;
