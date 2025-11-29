import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete, InfoWindow } from '@react-google-maps/api';
import AddAlertModal from '../components/AddAlertModal';
import RequestFoodModal from '../components/RequestFoodModal';
import HighSeverityPanel from '../components/HighSeverityPanel';
import MapLegend from '../components/MapLegend';
import ActionChoiceModal from '../components/ActionChoiceModal';
import api from '../api/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 6.9271,
  lng: 79.8612
};

const libraries = ["places"];

const icons = {
    flood: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    landslide: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    traped: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    food_request: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
    other: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
};

const HomePage = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  const [allNotifications, setAllNotifications] = useState([]);
  const [openNotifications, setOpenNotifications] = useState([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const autocompleteRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
        const data = await api.get('/api/notifications');
        setAllNotifications(data);
        setOpenNotifications(data.filter(n => n.open));
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMapClick = useCallback((event) => {
    setActiveMarker(null);
    const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    setSelectedLocation(location);
    setIsChoiceModalOpen(true);
  }, []);

  const closeAllModals = () => {
    setIsAlertModalOpen(false);
    setIsFoodModalOpen(false);
    setIsChoiceModalOpen(false);
    setSelectedLocation(null);
    fetchNotifications();
  };

  const handleChoice = (choice) => {
    setIsChoiceModalOpen(false);
    if (choice === 'alert') {
      setIsAlertModalOpen(true);
    } else if (choice === 'food') {
      setIsFoodModalOpen(true);
    }
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
        const place = autocompleteRef.current.getPlace();
        if (place && place.geometry && place.geometry.location) {
            map.panTo(place.geometry.location);
            map.setZoom(15);
        }
    }
  };

  return (
    <div className="relative h-full">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onClick={handleMapClick}
          onLoad={setMap}
          options={{ fullscreenControl: true, streetViewControl: false, mapTypeControl: false, zoomControl: true }}
        >
          <div className="absolute top-4 w-full flex justify-center">
            <div className="w-full md:w-1/3">
                <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={onPlaceChanged}>
                    <input type="text" placeholder="Search for a place" className="w-full p-2 rounded-lg shadow-lg" />
                </Autocomplete>
            </div>
          </div>

          {openNotifications.map(notification => (
            <Marker
              key={notification.id}
              position={{ lat: notification.location.latitude, lng: notification.location.longitude }}
              icon={{ url: icons[notification.incidentType] || icons.other }}
              onClick={() => setActiveMarker(notification)}
            />
          ))}

          {activeMarker && (
            <InfoWindow
              position={{ lat: activeMarker.location.latitude, lng: activeMarker.location.longitude }}
              onCloseClick={() => setActiveMarker(null)}
            >
              <div className="p-2 max-w-xs">
                <h4 className="font-bold text-lg mb-1">{activeMarker.locationDescription}</h4>
                <p className="text-sm mb-2">{activeMarker.comments}</p>
                <div className="text-xs space-y-1">
                    <p><strong className="capitalize">{activeMarker.incidentType.replace('_', ' ')}</strong> - <span className="font-semibold text-red-600">{activeMarker.severity}</span></p>
                    {activeMarker.roadBlocked && <p className="font-bold text-red-500">Road Blocked</p>}
                    <p><strong>Affected:</strong> Children: {activeMarker.affectedChildren}, Adults: {activeMarker.affectedAdults}, Injured: {activeMarker.affectedInjured}</p>
                    {activeMarker.reporterContacts && activeMarker.reporterContacts.length > 0 && (
                        <p><strong>Reporter:</strong> {activeMarker.reporterContacts[0].phoneNumber}</p>
                    )}
                    <div className="flex space-x-2">
                        <span className="text-green-600 font-semibold">True: {activeMarker.trueReports}</span>
                        <span className="text-red-600 font-semibold">Spam: {activeMarker.spamReports}</span>
                    </div>
                </div>
              </div>
            </InfoWindow>
          )}
          
          <MapLegend />
          <HighSeverityPanel notifications={allNotifications} />

        </GoogleMap>
      ) : <p>Loading map...</p>}

      <div className="absolute bottom-10 right-4 md:right-10 flex flex-col space-y-2 z-10">
        <button onClick={() => { setSelectedLocation(null); setIsFoodModalOpen(true); }} className="bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700">
            Request Food
        </button>
        <button onClick={() => { setSelectedLocation(null); setIsAlertModalOpen(true); }} className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700">
            Add Alert
        </button>
      </div>

      {isChoiceModalOpen && <ActionChoiceModal onChoose={handleChoice} onCancel={closeAllModals} />}
      {isAlertModalOpen && <AddAlertModal closeModal={closeAllModals} locationFromMap={selectedLocation} />}
      {isFoodModalOpen && <RequestFoodModal closeModal={closeAllModals} locationFromMap={selectedLocation} />}
    </div>
  );
};

export default HomePage;
