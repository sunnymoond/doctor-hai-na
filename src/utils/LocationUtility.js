import Geolocation from '@react-native-community/geolocation';
const locationConfig = { skipPermissionRequests: false, authorizationLevel: "whenInUse" }
Geolocation.setRNConfiguration(locationConfig);

const getCurrentLocationLatLong = async () => {
  await Geolocation.getCurrentPosition(
    (position) => {
      const region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03
      };
      console.log('region==> ' + JSON.stringify(region));
      return region;
    },
    (error) => {
      alert(error);
      return null;
    },
    { enableHighAccuracy: false, timeout: 200000, maximumAge: 5000 },
  );
}

export {
  getCurrentLocationLatLong
}