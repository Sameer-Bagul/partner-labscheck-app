"use client";

import React, { useState, useEffect } from "react";
import { GoogleMap, Autocomplete, Marker, InfoWindow } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";

const containerStyle = {
  width: "100%",
  height: "200px", // Increased height for better visibility
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const mapOptions = {
  disableDefaultUI: false, // Enable default UI controls
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: true,
  fullscreenControl: true,
  mapTypeId: "roadmap", // Can be 'roadmap', 'satellite', 'hybrid', 'terrain'
  gestureHandling: "cooperative", // Better touch handling
  clickableIcons: true,
  // Enhanced styling to show maximum details like Google Maps
  styles: [
    {
      featureType: "all",
      elementType: "labels",
      stylers: [{ visibility: "on" }] // Show all labels
    },
    {
      featureType: "poi",
      elementType: "all",
      stylers: [{ visibility: "on" }] // Show all points of interest
    },
    {
      featureType: "poi.business",
      elementType: "all",
      stylers: [{ visibility: "on" }] // Show all business details
    },
    {
      featureType: "poi.medical",
      elementType: "all",
      stylers: [{ visibility: "on" }] // Show medical facilities
    },
    {
      featureType: "poi.school",
      elementType: "all",
      stylers: [{ visibility: "on" }] // Show schools
    },
    {
      featureType: "road",
      elementType: "all",
      stylers: [{ visibility: "on" }] // Show all road details
    },
    {
      featureType: "road.local",
      elementType: "labels",
      stylers: [{ visibility: "on" }] // Show local road names
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [{ visibility: "on" }] // Show all transit information
    },
    {
      featureType: "administrative",
      elementType: "all",
      stylers: [{ visibility: "on" }] // Show all administrative labels
    },
    {
      featureType: "landscape",
      elementType: "labels",
      stylers: [{ visibility: "on" }] // Show landscape labels
    }
  ]
};

export default function LocationSearch({
  onLocationSelect,
  defaultValue = "",
  defaultLat = 18.5204,
  defaultLng = 73.8567,
  isEditable = false, // New prop to control editability
  initialData = null, // Initial data for editing mode
}) {
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState({ lat: defaultLat, lng: defaultLng });
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);
  const [placesService, setPlacesService] = useState<any>(null);

  const [formFields, setFormFields] = useState({
    // Initialize with provided data or empty strings
    locality: initialData?.locality || "",
    city: initialData?.city || "",
    stateCountry: initialData?.stateCountry || "",
    pincode: initialData?.pincode || "",
  });

  // Update map center and form fields when initial data changes
  useEffect(() => {
    if (initialData) {
      if (initialData.lat && initialData.lng) {
        setMapCenter({ lat: initialData.lat, lng: initialData.lng });
        // Fetch nearby places for initial location (only if placesService is available)
        if (placesService) {
          fetchNearbyPlaces(initialData.lat, initialData.lng);
        }
      }
      setFormFields({
        locality: initialData.locality || "",
        city: initialData.city || "",
        stateCountry: initialData.stateCountry || "",
        pincode: initialData.pincode || "",
      });
      
      // Set initial place details if available
      if (initialData.locality || initialData.city) {
        setSelectedPlace({
          name: initialData.locality || initialData.city || "Lab Location",
          address: `${initialData.locality}, ${initialData.city}, ${initialData.stateCountry} - ${initialData.pincode}`,
          place_id: "",
          types: ["establishment"],
          rating: null,
          vicinity: initialData.city || "",
          formatted_phone_number: "",
          website: ""
        });
      }
    }
  }, [initialData, placesService]);

  const onLoad = (autoC: any) => {
    setAutocomplete(autoC);
    
    // Configure autocomplete with more options
    if (autoC) {
      autoC.setOptions({
        types: ['establishment', 'geocode'], // Allow both places and addresses
        componentRestrictions: { country: 'in' }, // Restrict to India (adjust if needed)
        fields: [
          'address_components', 
          'formatted_address', 
          'geometry', 
          'name', 
          'place_id',
          'types',
          'vicinity'
        ]
      });
    }
  };

  const extractFromComponents = (components: any[], types: string[]) =>
    components?.find((c) => types.every((t) => c.types.includes(t)))?.long_name || "";

  // Fetch nearby places using Google Maps PlacesService
  const fetchNearbyPlaces = (lat: number, lng: number) => {
    if (!placesService) return;

    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius: 1000, // 1km radius
      types: ['hospital', 'pharmacy', 'doctor', 'health'], // Medical related places
    };

    placesService.nearbySearch(request, (results: any[], status: any) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        setNearbyPlaces(results.slice(0, 5)); // Show top 5 results
      } else {
        // console.log("Places service status:", status);
        setNearbyPlaces([]);
      }
    });
  };

  // Handle manual field changes when in edit mode
  const handleFieldChange = (field: string, value: string) => {
    const updatedFields = { ...formFields, [field]: value };
    setFormFields(updatedFields);
    
    // Notify parent component of the change
    if (onLocationSelect) {
      onLocationSelect({
        address: `${updatedFields.locality}, ${updatedFields.city}, ${updatedFields.stateCountry} - ${updatedFields.pincode}`,
        lat: mapCenter.lat,
        lng: mapCenter.lng,
        placeId: "", // Will be empty for manual edits
        locality: updatedFields.locality,
        city: updatedFields.city,
        state: updatedFields.stateCountry.split(',')[0]?.trim() || "",
        country: updatedFields.stateCountry.split(',')[1]?.trim() || "",
        stateCountry: updatedFields.stateCountry,
        pincode: updatedFields.pincode,
      });
    }
  };

  const fetchPincodeFromLatLng = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      const addressComponents = data?.results?.[0]?.address_components || [];
      return extractFromComponents(addressComponents, ["postal_code"]);
    } catch (err) {
      console.error("Failed to fetch pincode from geocode:", err);
      return "";
    }
  };

  const onPlaceChanged = async () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      
      // Check if place has geometry and location data
      if (!place.geometry || !place.geometry.location) {
        console.warn("Place selected doesn't have complete location data:", place);
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const placeId = place.place_id;
      const address = place.formatted_address;

      setMapCenter({ lat, lng });
      setSelectedPlace({
        name: place.name || "Selected Location",
        address: address,
        place_id: placeId,
        types: place.types || [],
        rating: place.rating || null,
        vicinity: place.vicinity || "",
        formatted_phone_number: place.formatted_phone_number || "",
        website: place.website || ""
      });
      setShowInfoWindow(true);

      // Fetch nearby medical facilities using Places service
      if (placesService) {
        fetchNearbyPlaces(lat, lng);
      }

      const components = place.address_components || [];

      // const sublocality = extractFromComponents(components, ["sublocality", "sublocality_level_1"]);
      const locality = extractFromComponents(components, ["sublocality_level_1"]);
      const city = extractFromComponents(components, ["administrative_area_level_3"]) || locality;
      const state = extractFromComponents(components, ["administrative_area_level_1"]);
      const country = extractFromComponents(components, ["country"]);
      let pincode = extractFromComponents(components, ["postal_code"]);

      if (!pincode) {
        pincode = await fetchPincodeFromLatLng(lat, lng);
      }

      const stateCountry = `${state}, ${country}`;

      setFormFields({ locality, city, stateCountry, pincode });

      onLocationSelect({
        address,
        lat,
        lng,
        placeId,
        // sublocality,
        locality,
        city,
        state,
        country,
        stateCountry,
        pincode,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search input */}
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <Input type="text" placeholder="Search location..." defaultValue={defaultValue} />
      </Autocomplete>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Auto-filled fields */}
        <div className="space-y-2">
          {/* <Input type="text" placeholder="Sub-locality" value={formFields.sublocality} readOnly /> */}
          <Input 
            type="text" 
            placeholder="Locality" 
            value={formFields.locality} 
            readOnly={!isEditable}
            onChange={(e) => isEditable && handleFieldChange('locality', e.target.value)}
            className={isEditable ? "bg-white" : "bg-gray-50"}
          />
          <Input 
            type="text" 
            placeholder="City" 
            value={formFields.city} 
            readOnly={!isEditable}
            onChange={(e) => isEditable && handleFieldChange('city', e.target.value)}
            className={isEditable ? "bg-white" : "bg-gray-50"}
          />
          <Input 
            type="text" 
            placeholder="State, Country" 
            value={formFields.stateCountry} 
            readOnly={!isEditable}
            onChange={(e) => isEditable && handleFieldChange('stateCountry', e.target.value)}
            className={isEditable ? "bg-white" : "bg-gray-50"}
          />
          <Input 
            type="text" 
            placeholder="Pincode" 
            value={formFields.pincode} 
            readOnly={!isEditable}
            onChange={(e) => isEditable && handleFieldChange('pincode', e.target.value)}
            className={isEditable ? "bg-white" : "bg-gray-50"}
          />
        </div>

        {/* Map display with enhanced details */}
        <div className="space-y-4">
          <GoogleMap 
            mapContainerStyle={containerStyle} 
            center={mapCenter} 
            zoom={15}
            options={mapOptions}
            onLoad={(mapInstance) => {
              // console.log("Google Map loaded successfully");
              setMap(mapInstance);
              // Initialize Places service
              const service = new window.google.maps.places.PlacesService(mapInstance);
              setPlacesService(service);
            }}
            onClick={(e) => {
              if (isEditable && e.latLng) {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                setMapCenter({ lat, lng });
                setShowInfoWindow(false);
                // Fetch nearby places for the new location
                if (placesService) {
                  fetchNearbyPlaces(lat, lng);
                }
              }
            }}
          >
            <Marker 
              position={mapCenter} 
              draggable={isEditable}
              onDragEnd={(e) => {
                if (isEditable && e.latLng) {
                  const lat = e.latLng.lat();
                  const lng = e.latLng.lng();
                  setMapCenter({ lat, lng });
                  setShowInfoWindow(false);
                  // Fetch nearby places for the new location
                  if (placesService) {
                    fetchNearbyPlaces(lat, lng);
                  }
                }
              }}
              onClick={() => setShowInfoWindow(true)}
            />
            
            {/* Info window with enhanced place details */}
            {showInfoWindow && selectedPlace && (
              <InfoWindow
                position={mapCenter}
                onCloseClick={() => setShowInfoWindow(false)}
              >
                <div className="p-3 max-w-sm">
                  <h3 className="font-semibold text-base text-gray-800">{selectedPlace.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedPlace.address}</p>
                  
                  {selectedPlace.rating && (
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500 text-sm">{'⭐'.repeat(Math.round(selectedPlace.rating))}</span>
                      <span className="ml-1 text-sm text-gray-600">{selectedPlace.rating}/5</span>
                    </div>
                  )}
                  
                  {selectedPlace.types && selectedPlace.types.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {selectedPlace.types.slice(0, 2).join(", ")}
                      </span>
                    </div>
                  )}
                  
                  {selectedPlace.formatted_phone_number && (
                    <p className="text-sm text-green-600 mt-2">📞 {selectedPlace.formatted_phone_number}</p>
                  )}
                  
                  {selectedPlace.vicinity && (
                    <p className="text-xs text-gray-500 mt-1">📍 {selectedPlace.vicinity}</p>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
}
