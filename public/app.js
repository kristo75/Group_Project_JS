const Leaflet = require('leaflet');
const keys = require('./keys.js');
const Places = require('./places.js');
const Request = require('./request.js')

// var map;
// var service;
// var infowindow;
// let zoom;
let userLocation;


const initialiseElements = function(){
  const userPrevPOIBtn = document.querySelector('#userSavedPoi');
  userPrevPOIBtn.addEventListener('click', function(){
    console.log('clicky');
    const getRequest = new Request('http://localhost:3000/db');
    getRequest.get(function(allPOIs){
      console.log(allPOIs);
    })
  })
}

const appStart = function(){

    initialiseElements();
    const callback = function(poisToDisplay){

      poisToDisplay.forEach(function(poi){
        let newMarkerIcon;
        if(poi.thumbnail_url != null){
          newMarkerIcon = Leaflet.divIcon({
            html: `<img  class= "marker-icon" src=${poi.thumbnail_url}/>`
            // className: 'marker-icon'
            // iconSize:     [100, 100] // size of the icon
          });
        } else {
          // newMarkerIcon = Leaflet.icon({
            newMarkerIcon = Leaflet.divIcon({
              html: '<img  class= "marker-icon" src="./marker.png"/>'
              // iconAnchor:   [50, 1], // point of the icon which will correspond to marker's location
              // popupAnchor:  [15, -20] // point from which the popup should open relative to the iconAnchor
          });
        }
        const lat = poi.location.lat;
        const long = poi.location.lng;
        let perex = poi.perex;
        if(perex == null){
          perex = "";
        }

        const marker = Leaflet.marker([lat, long], {icon: newMarkerIcon, riseOnHover: true}).addTo(mymap)
            .bindPopup(poi.name + '\n' + perex, {className: 'popup'});

            const createRequestComplete = function(newPoi){
              console.log(newPoi);
            }

        marker.addEventListener('click', function(){
          const url = 'https://api.sygictraveldata.com/1.0/en/places/' + poi.id
          const request = new XMLHttpRequest();
          request.open('GET', url)
          request.setRequestHeader('x-api-key', keys.sygicTravel)
          request.addEventListener('load', function(){
            const jsonString = request.responseText
            let description = JSON.parse(jsonString).data.place.description;
            const poilatlng = Leaflet.latLng(poi.location.lat, poi.location.lng);
            const distance = userLocation.distanceTo(poilatlng);
            console.log('userLocation: ' +userLocation);
            console.log('distance: '+distance);
            console.log('poilatlng: ' +poilatlng);

            if(distance <= 50){
              console.log('sending get request');
              const getRequest = new Request('http://localhost:3000/db');
              getRequest.get(function(allPOIs){

                  //console.log(allPOIs);
                //   for (let savedPOI of allPOIs ) {
                //     console.log(savedPOI.);
                //
                // }
              const alreadyInDB = allPOIs.reduce(function(incrementor, userPOI){
                // console.log(userPOI.id, poi.id);
                 return incrementor || (userPOI.id == poi.id);
               }, false)

                if (!alreadyInDB) {
                  const postRequest = new Request('http://localhost:3000');
                  postRequest.post(poi, createRequestComplete);
                }
              });
              // const postRequest = new Request('http://localhost:3000');
              // postRequest.post(poi, createRequestComplete)
              // getRequest.get(function(){
              //   if(getRequest.status !== 200){
              //     const poiToSend = poi;
              //     const saveRequest = new Request('http://localhost:3000/');
              //     saveRequest.post(poiToSend, createRequestComplete);
              //   }
              // });

              if(description == null){
                description = poi.name;
              } else {
                description = poi.name + ' ' + description.text
              }
              marker._popup.setContent(description);
            }

        }.bind(this));
          request.send();
        })
      })
    }

    const mymap = Leaflet.map('map');

    Leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: keys.mapbox
    }).addTo(mymap);

    const newMarkerIcon = Leaflet.icon({
        iconUrl: 'user_marker.png',
        // iconSize:     [60, 120] // size of the icon
        iconAnchor:   [50, 100] // point of the icon which will correspond to marker's location
        // popupAnchor:  [15, -20] // point from which the popup should open relative to the iconAnchor
    });

    mymap.locate({setView: false, maxZoom: 15, watch: true});

// CodeClan:
// 55.946927, -3.201912
// New York:
// 40.7751012,-73.9767428

const poi = new Places();
let hasSetInitialView = false;

let userMarker = Leaflet.marker([0,0],{icon: newMarkerIcon}).addTo(mymap);
// let userCircle = Leaflet.circle([0,0], 20).addTo(mymap);


function onLocationFound(e) {

  if(!hasSetInitialView){
    mymap.setView(e.latlng, 15);
  }

  hasSetInitialView = true;

  userLocation = e.latlng;
  // const radius = e.accuracy / 2;
  userMarker.setLatLng(e.latlng);
  mymap.panTo(e.latlng);
  // userCircle.setLatLng(e.latlng);

  if(!poi.hasPlaces){
    poi.getPlacesPOIs(e.latlng, callback);
  }

}
mymap.on('locationfound', onLocationFound);

}

document.addEventListener("DOMContentLoaded", appStart);
