const Places = function() {
  this.pois = [];
  this.callback = this.callback.bind(this);
  this.displayPOIS = this.displayPOIS.bind(this);
}



Places.prototype.callback = function(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    this.pois.push(results);
  }
}


Places.prototype.getGooglePlacesPOIs = function(latLong){
    const poiTypes = ['art_gallery', 'museum', 'church', 'city_hall', 'courthouse', 'zoo', 'synagogue', 'hindu_temple', 'mosque', 'library'];
    console.log(poiTypes);
    const currentLocation = new google.maps.LatLng(latLong.lat, latLong.lng);

    poiTypes.forEach(function(type){
      var request = {
        location: currentLocation,
        radius: '1000',
        type: type
      };

      const googleMap = new google.maps.Map(document.createElement('nomap'), {
      center: currentLocation,
      zoom: 15
    });
      service = new google.maps.places.PlacesService(googleMap);

      service.nearbySearch(request, this.callback);

    }.bind(this));
    this.displayPOIS();


}

Places.prototype.displayPOIS = function(){
  console.log(this.pois);
}

module.exports = Places;
