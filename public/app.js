  const Leaflet = require('leaflet');
  const keys = require('./keys.js');
  const Places = require('./places.js');
  const Request = require('./request.js');
  const MapWrapper = require('./mapWrapper.js');

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
    const callback = function(poisToDisplay){
      poisToDisplay.forEach(function(poi){
        let newMarkerIcon;
        if(poi.thumbnail_url != null){
          newMarkerIcon = Leaflet.divIcon({
            html: `<img  class= "marker-icon" src=${poi.thumbnail_url}/>`
          });
        } else {
          newMarkerIcon = Leaflet.divIcon({
            html: '<img  class= "marker-icon" src="./marker.png"/>'
          });
        }
        const lat = poi.location.lat;
        const lng = poi.location.lng;
        let perex = poi.perex;
        if(perex == null){
          perex = "";
        }

        const locationMarker = mymap.createLocationMarker([lat, lng], newMarkerIcon,
        true, poi.name + '\n' + perex, {className: 'popup'});

        const createRequestComplete = function(newPoi){
          console.log(newPoi);
        }

        mymap.locationListener('click', function(){
          const url = 'https://api.sygictraveldata.com/1.0/en/places/' + poi.id;
          const request = new Request(url);
          request.get(keys.sygicTravel, function(responseBody){
            let description = JSON.parse(responseBody).data.place.description;
            const poilatlng = Leaflet.latLng(poi.location.lat, poi.location.lng);
            const distance = userLocation.distanceTo(poilatlng);

            if(distance <= 50){
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
          // request.post();
        })
      })
    }

    const mymap = new MapWrapper('map');

    const userVisitedPoisBtn = document.querySelector('#userVisitedPoisBtn');
    userVisitedPoisBtn.addEventListener('click', function(){

    });

    const newMarkerIcon = Leaflet.icon({
      iconUrl: 'user_marker.png',
      iconAnchor: [50, 100]
    });

    mymap.locate(false, 15, true);

    const poi = new Places();

    let hasSetInitialView = false;
    let userMarker = mymap.createUserMarker([0,0], newMarkerIcon);

    function onLocationFound(e) {

      howToUseBtn = document.querySelector('#howToUseBtn');

      howToUseBtn.addEventListener('click', function(){
        const modal = document.getElementById('myModal');
        const getCity = new Request('https://api.sygictravelapi.com/1.0/en/places/detect-parents?location=' + e.latlng.lat + ',' + e.latlng.lng);
        const closeModal = document.getElementsByClassName("close")[0];
        const modalContent = document.querySelector('.modal-content');
        modalContent.innerHTML = "";
        const modalHeader = document.createElement('h2');
        modalHeader.innerHTML="HOW TO PLAY";
        modalContent.appendChild(modalHeader);
        const modalP = document.createElement('p');
        modalP.innerHTML = 'When you launch the app, the geo locator will display your start position and will display five random locations for you to explore.<br><br>'
        + 'The geo locator wil track your journey on the map and once you are within a 50 meter radius of a point of interest, click on the image icon to display detailed information about the point of interest.<br><br>'
        + 'This point of interest wil be automatically added to your list of places visited. To display this list, please click on the WHERE HAVE I BEEN button.<br><br>'
        + 'To get a preview of a point of interest, click on the image icon.</br> <br>  To exit from a pop up box, please click anywhere on the map.</b>'
        modalContent.appendChild(modalP);
        modal.style.display = "block";
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        }

        const addToModalCity = function(city){
          const userCity = document.createElement('h4');
          userCity.innerText = `You are currently in ${city.data.places[0].name}!`
          modalContent.appendChild(userCity);
          console.log(userCity);
          //console.log(city.data.places[0].name);
          const addToModal = function(weather){
            const weatherDescription = document.createElement('p');
            weatherDescription.innerHTML = `It is currently ${weather.weather[0].description}`;
            modalContent.appendChild(weatherDescription);

            const weatherImage = document.createElement('img');
            weatherImage.src = `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`
            modalContent.appendChild(weatherImage);
            const temperature = document.createElement('p');
            console.log("Temp: " + weather.main.temp);
            const tempinCelcius = Math.round(weather.main.temp - 273.15);
            temperature.innerHTML = `The current temperature is: ${tempinCelcius} degC`;
            modalContent.appendChild(temperature);

          }
          const openWeatherReq = new Request(`https://api.openweathermap.org/data/2.5/weather?q=${city.data.places[0].name}&APPID=${keys.openWeather}`);
          openWeatherReq.get(addToModal);
        }
        getCity.get(addToModalCity, keys.sygicTravel)


      });

      if(!hasSetInitialView){
        mymap.setInitialView(e.latlng, 15);
      }

      hasSetInitialView = true;

      mymap.repositionUserMarker(e.latlng)
      mymap.panToNewCoords(e.latlng);

      if(!poi.hasPlaces){
        poi.getPlacesPOIs(e.latlng, callback);
      }

    }
    mymap.onEvent('locationfound', onLocationFound);

  }

  document.addEventListener("DOMContentLoaded", appStart);
