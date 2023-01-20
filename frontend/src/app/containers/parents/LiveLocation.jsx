import { useState } from "react";
import { ProSidebar, Menu, SubMenu, MenuItem } from "react-pro-sidebar";
import {
  GoogleMap,
  MarkerF,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import Loader from "../../components/Loader";
import useParentAuth from "../../context/auth/useParentAuth";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { database } from "../../firebase/firebaseConfig";
import { useEffect } from "react";

const LiveLocation = () => {
  const { parent } = useParentAuth();
  const [map, setMap] = useState();
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState();
  const [driverLocation, setDriverLocation] = useState({
    lat: -3.745,
    lng: -38.523,
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAuEoedfRUtYDOBUsLoGEZUPWeNJOEoXXg",
  });

  const directions = async () => {
    const routes = await getBusRoute();

    const routesCopy = routes.map((route) => {
      return {
        location: {
          lat: parseFloat(route.latitude),
          lng: parseFloat(route.longitude),
        },
      };
    });
    const origin =
      routesCopy.length === 1
        ? // eslint-disable-next-line no-undef
          new google.maps.LatLng(
            routesCopy[0].location.lat,
            routesCopy[0].location.lng
          )
        : routesCopy.shift().location;
    const destination =
      routesCopy.length === 1
        ? // eslint-disable-next-line no-undef
          new google.maps.LatLng(
            routesCopy[0].location.lat,
            routesCopy[0].location.lng
          )
        : routesCopy.pop().location;
    console.log(destination);

    // eslint-disable-next-line no-undef
    const directions = new google.maps.DirectionsService();

    const result = await directions.route({
      origin: origin,
      destination: destination,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
      waypoints: routesCopy,
    });

    setResponse(result);
    getDriverLocation();
  };

  const getDriverLocation = () => {
    const locationCollection = collection(database, "location");
    const q = query(
      locationCollection,
      where("institute", "==", parent.institute),
      where("busNo", "==", parent.busNo)
    );

    onSnapshot(q, (locationSnapshot) => {
      const location = locationSnapshot.docs.map((location) => ({
        id: location.id,
        ...location.data(),
      }));

      setDriverLocation({
        lat: location[0].latitude,
        lng: location[0].longitude,
      });
    });
  };

  const getBusRoute = async () => {
    const busCollection = collection(database, "bus");

    const q = query(
      busCollection,
      where("institute", "==", parent.institute),
      where("busNo", "==", parent.busNo)
    );

    const busSnapshot = await getDocs(q);
    const bus = busSnapshot.docs.map((bus) => ({ id: bus.id, ...bus.data() }));

    return bus[0].busRoutes;
  };

  useEffect(() => {
    directions();
  }, []);

  if (!isLoaded) return <Loader />;

  return (
    <>
      <div className="map-container">
        <div className="row h-100">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            zoom={15}
            center={driverLocation}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            onLoad={(map) => setMap(map.panTo(driverLocation))}
          >
            <MarkerF position={driverLocation} title="It's your drivers" />
            {response && (
              <DirectionsRenderer directions={response}></DirectionsRenderer>
            )}
          </GoogleMap>
        </div>
      </div>
    </>
  );
};

export default LiveLocation;
