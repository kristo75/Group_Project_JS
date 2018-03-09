const Leaflet = require('leaflet');
const keys = require('./keys.js');
const Places = require('./places.js');
const Request = require('./request.js');
const User = require('./user.js')
const Map = require('./map.js')

let userLocation;
let howToUseBtn;

const initialiseUI = function(){
  const userVisitedPoisBtn = document.querySelector('#userVisitedPoisBtn');
  const modal = document.getElementById('myModal');
  const closeModal = document.getElementsByClassName("close")[0];
  userVisitedPoisBtn.addEventListener('click', function(){
    const getRequest = new Request('http://localhost:3000/db');
    getRequest.get(function(allPOIs){
      const modalContent = document.querySelector('.modal-content')
      modalContent.innerHTML = "";
      const modalHeader = document.createElement('h2')
      modalHeader.innerHTML="Saved Points of Interest";
      modalContent.appendChild(modalHeader);
      console.log(allPOIs);

      allPOIs.forEach(function(poi){
        const poiInfo = document.createElement('p');
        poiInfo.innerHTML = `${poi.name} in ${poi.name_suffix}`;

        modalContent.appendChild(poiInfo);


        modal.style.display = "block";
      })

    })
  })
  closeModal.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}




const appStart = function(){

  initialiseUI();
  const addPOIMarkersToMap = function(poisToDisplay){

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

      const marker = Leaflet.marker([lat, long], {icon: newMarkerIcon, riseOnHover: true}).addTo(mymap.map)
      .bindPopup('<p>' + poi.name + '</p><p>' + perex + '</p>', {className: 'popup'});

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
              const alreadyInDB = allPOIs.reduce(function(incrementor, userPOI){
                return incrementor || (userPOI.id == poi.id);
              }, false)

              if (!alreadyInDB) {
                const postRequest = new Request('http://localhost:3000');
                postRequest.post(poi, createRequestComplete);
              }
            });

            const modal = document.getElementById('myModal');
            const modalContent = document.querySelector('.modal-content');
            //  const closeModal = document.getElementsByClassName("close")[0];
            modalContent.innerHTML = "";
            const poiName = document.createElement('h2');
            poiName.innerHTML = poi.name;
            modalContent.appendChild(poiName);

            if (!(poi.thumbnail_url == null)) {
              const poiImage = document.createElement('img');
              poiImage.src = poi.thumbnail_url;
              poiImage.alt = "A picture of " + poi.name;
              modalContent.appendChild(poiImage);
            }


            if(description == null){
              description = poi.name;
            } else {
              description = poi.name + ' ' + description.text
            }
            const poiDescription = document.createElement('p');
            poiDescription.innerHTML = description;

            // marker._popup.setContent(description);
            modalContent.appendChild(poiDescription)

            modal.style.display="block";
            //   closeModal.onclick = function() {
            //     modal.style.display = "none";
            // }
            window.onclick = function(event) {
              if (event.target == modal) {
                modal.style.display = "none";
              }
            }
          }

        }.bind(this));
        request.send();
      })
    })
  }

  const mymap = new Map('map');
  const user = new User();
  const sygicWrapper = new Places();
  const userMarker = mymap.addUserMarker({lat: 0, lng: 0}, 'user_marker.png', [50, 100]);
  mymap.map.locate({setView: false, maxZoom: 15, watch: true});
  // mapbox.streets
  //mapbox.outdoors
  //mapbox.emerald
  //mapbox.outdoors

  //this does nothign
  // const userVisitedPoisBtn = document.querySelector('#userVisitedPoisBtn');
  //
  // userVisitedPoisBtn.addEventListener('click', function(){
  //
  // });
  //  const userMarker = mymap.buildIconMarker('user_marker.png', [50,100])
  // const newMarkerIcon = Leaflet.icon({
  //   iconUrl: 'user_marker.png',
  //   // iconSize:     [60, 120] // size of the icon
  //   iconAnchor:   [50, 100] // point of the icon which will correspond to marker's location
  //   // popupAnchor:  [15, -20] // point from which the popup should open relative to the iconAnchor
  // });

  //const userInitialLocation = mymap.geolocate({setView: false, maxZoom: 15, watch: true});


  // CodeClan:
  // 55.946927, -3.201912
  // New York:
  // 40.7751012,-73.9767428




  //let userLocation = mymap.addUserMarker(userInitialLocation, 'user_marker.png', [50,100]);

  //let userMarker = Leaflet.marker([0,0],{icon: newMarkerIcon}).addTo(mymap);
  // let userCircle = Leaflet.circle([0,0], 20).addTo(mymap);


  function onLocationFound(e) {
    howToUseBtn = document.querySelector('#howToUseBtn');

    howToUseBtn.addEventListener('click', function(){
      const modal = document.getElementById('myModal');
      const getCity = new Request('https://api.sygictravelapi.com/1.0/en/places/detect-parents?location=' + e.latlng.lat + ',' + e.latlng.lng);
      const closeModal = document.getElementsByClassName("close")[0];
      const modalContent = document.querySelector('.modal-content');
      modalContent.innerHTML = "";
      const modalHeader = document.createElement('h2')
      modalHeader.innerHTML="HOW TO PLAY";
      modalContent.appendChild(modalHeader);
      const modalP = document.createElement('p');
      modalP.innerHTML = 'When you launch the app, the geo locator will display your start position and will display five random locations for you to explore.<br><br>'
      + 'The geo locator will track your journey on the map and once you are within a 50 meter radius of a point of interest, click on the image icon to display detailed information about the point of interest.<br><br>'
      + 'This point of interest will be automatically added to your list of places visited. To display this list, please click on the WHERE HAVE I BEEN button.<br><br>'
      + 'To get a preview of a point of interest, click on the image icon.</br> <br>  To exit from a pop up box, please click anywhere on the map.</b>'
      modalContent.appendChild(modalP);
      modal.style.display = "block";
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }


      const addToModalCity = function(city){
        const weatherInfo = document.querySelector('.weather-data');
        // weatherInfo.innerHTML = "";
        const userCity = document.createElement('h4');

        const addToModal = function(weather){
          userCity.innerText = `You are currently in ${city.data.places[0].name}!`
          weatherInfo.appendChild(userCity);
          const weatherDescription = document.createElement('p');
          weatherDescription.innerHTML = `It is currently ${weather.weather[0].description}`;
          weatherInfo.appendChild(weatherDescription);

          const weatherImage = document.createElement('img');
          weatherImage.src = `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`
          weatherInfo.appendChild(weatherImage);
          const temperature = document.createElement('p');
          const tempinCelcius = Math.round(weather.main.temp - 273.15);
          temperature.innerHTML = `The current temperature is: ${tempinCelcius} degC`;
          weatherInfo.appendChild(temperature);
          modalContent.appendChild(weatherInfo);
        }
        const openWeatherReq = new Request(`https://api.openweathermap.org/data/2.5/weather?q=${city.data.places[0].name}&APPID=${keys.openWeather}`);
        // openWeatherReq.get(addToModal);
      }
      getCity.get(addToModalCity, keys.sygicTravel)


    });
    console.log(e);
    user.updateLocation(e.latlng.lat, e.latlng.lng);
    mymap.updateUserMarker(e.latlng);

    console.log(user.location);
    let hasSetInitialView = false;
    if(!hasSetInitialView){
      mymap.map.setView(user.location, 15);
    }

    hasSetInitialView = true;

    //userLocation = e.latlng;
    // const radius = e.accuracy / 2;
    //  mymap.updateUserMarker(user.location);
    //userMarker.setLatLng(user.location);
    mymap.map.panTo(user.location);
    // userCircle.setLatLng(e.latlng);

    if(!sygicWrapper.hasPlaces){
      sygicWrapper.getPlacesPOIs(user.location, addPOIMarkersToMap);
    }

  }

  mymap.map.on('locationfound', onLocationFound);

}

document.addEventListener("DOMContentLoaded", appStart);
