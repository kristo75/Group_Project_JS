const User = function(){
  this.location = {lat: 0, lng: 0}
}

User.prototype.updateLocation = function(lat, lng){
  this.location.lat = lat;
  this.location.lng = lng;
}

module.exports = User;
