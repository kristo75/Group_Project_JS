const Places = function() {
  this.pois = [];
  this.displayPOIS = this.displayPOIS.bind(this);
  this.poisToDisplay = [];
}



Places.prototype.getGooglePlacesPOIs = function(latLong, callback){
  const poiTypes = ['sightseeing'];
  console.log(poiTypes);

  const lat = latLong.lat;
  const lon = latLong.lng;

  const calculateBounds = function(lat, lon){
    console.log(lat);
    console.log(lon);
    const R = 6371;  // earth radius in km
    const radius = 5000; // meters
    const x1 = lon - (Math.PI/180)*(radius/R/Math.cos(lat*(Math.PI/180)));
    const x2 = lon + (Math.PI/180)*(radius/R/Math.cos(lat*(Math.PI/180)));
    const y1 = lat + (Math.PI/180)*(radius/R);
    const y2 = lat - (Math.PI/180)*(radius/R);
    const bounds = y2 + ',' + x1 +',' + y1 + ',' + x2;
    console.log(bounds);
    return bounds;
  };

  const bounds = calculateBounds(lat, lon);
console.log();
  const url = 'https://api.sygictraveldata.com/1.0/en/places/list?bounds='+ bounds + '&level=poi&limit=50'
  const request = new XMLHttpRequest();
  request.open('GET', url)
  request.setRequestHeader('x-api-key', 'jGGuMVeRWZ2x3ltjFRaj12sXfaxYpDzT4btQf2hV')
  request.addEventListener('load', function(){
    const jsonString = request.responseText
    this.pois= JSON.parse(jsonString).data.places;
console.log(this.pois);
}.bind(this));
  request.send();

  setTimeout(function(){
    this.displayPOIS();
    callback(this.poisToDisplay);
  }.bind(this), 2000);
}


Places.prototype.displayPOIS = function(){
  console.log(this.pois);

  for (var i = 0; i < 5; i++) {
    this.poisToDisplay.push(this.pois.splice(Math.floor(Math.random()*this.pois.length), 1)[0]);
  }
console.log(this.poisToDisplay);
}

module.exports = Places;
