const Places = function() {
  this.pois = [];
  this.callback = this.callback.bind(this);
  this.displayPOIS = this.displayPOIS.bind(this);
  this.poisToDisplay = [];
}



Places.prototype.callback = function(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for(let result of results){
      this.pois.push(result);
    }
  }
}


Places.prototype.getGooglePlacesPOIs = function(latLong, callback){
  const poiTypes = ['sightseeing'];
  console.log(poiTypes);
  // const currentLocation = new google.maps.LatLng(latLong.lat, latLong.lng);

  // poiTypes.forEach(function(type){
  //   var request = {
  //     location: currentLocation,
  //     radius: '500',
  //     type: type
  //   };
  //
  //   const googleMaps = new google.maps.Map(document.createElement('nomap'), {
  //   center: currentLocation,
  //   zoom: 15
  // });
  //   service = new google.maps.places.PlacesService(googleMap);
  //
  //   service.nearbySearch(request, this.callback);
  //
  // }.bind(this));
  const lat = latLong.lat;
  const lon = latLong.lng;

  const calculateBounds = function(lat, lon){
    console.log(lat);
    console.log(lon);
    const R = 6371;  // earth radius in km
    const radius = 5000; // km
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
  const url = 'https://api.sygictraveldata.com/1.0/en/places/list?bounds='+ bounds + '&level=poi'
  const request = new XMLHttpRequest();
  request.open('GET', url)
  request.setRequestHeader('x-api-key', 'jGGuMVeRWZ2x3ltjFRaj12sXfaxYpDzT4btQf2hV')
  request.addEventListener('load', function(){
    const jsonString = request.responseText
    console.log(JSON.parse(jsonString).data.places);

  });
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
