const Places = function() {
  this.pois = [];
  this.callback = this.callback.bind(this);
  this.displayPOIS = this.displayPOIS.bind(this);

}



Places.prototype.callback = function(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    //console.log(results.length);
    //console.log(results);
    //console.log(this);
    this.pois.push(results);
  //  console.log(this.pois)
    // if (this.pois.length > 5){
    //   console.log(this.pois);
    //   displayPOIS(this.pois);
    // }
    // for (var i = 0; i < results.length; i++) {
    //   var place = results[i];
    //   //console.log(place);
    // }
  }
}


Places.prototype.getGooglePlacesPOIs = function(latLong){
    const poiTypes = ['art_gallery', 'museum', 'church', 'city_hall', 'courthouse', 'zoo', 'synagogue', 'hindu_temple', 'mosque', 'library'];
    console.log(poiTypes);
    const currentLocation = new google.maps.LatLng(latLong.lat, latLong.lng);

    poiTypes.forEach(function(type){
    //  console.log(this);
      var request = {
        location: currentLocation,
        radius: '1000',
        type: type
      };

      const googleMap = new google.maps.Map(document.createElement('nomap'), {
      center: currentLocation,
      zoom: 15
    });
      //console.log(googleMap);
      service = new google.maps.places.PlacesService(googleMap);
      //console.log(this);
      //console.log(service);
      service.nearbySearch(request, this.callback);
      //console.log(this);
    }.bind(this));
  //  console.log(this.pois);
    this.displayPOIS();
    //console.log(currentLocation);

    //console.log(this.pois);

}

Places.prototype.displayPOIS = function(){
  console.log(this.pois);
}

module.exports = Places;
