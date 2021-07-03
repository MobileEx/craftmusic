import axios from 'axios';

const LocationService = {
  getCountryCodeAndName(lat, lng) {
    return axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=AIzaSyDiU9bDt5maBts7nrolXHlntqxAsPsKfyE`
    );
  },
};

export default LocationService;
