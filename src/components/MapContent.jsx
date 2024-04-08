import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = () => {
    useEffect(() => {
        
        const initMap = () => {
            const defaultPos = { lat: -34.397, lng: 150.644 };
            const map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 4,
                center: defaultPos,
            });

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    map.setCenter(pos);
                    new window.google.maps.Marker({
                        position: pos,
                        map: map,
                        title: 'Your location',
                    });
                }, () => {
                    handleLocationError(true, map.getCenter());
                });
            } else {
                
                handleLocationError(false, map.getCenter());
            }
        };

        
        const handleLocationError = (browserHasGeolocation, pos) => {
            console.error(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
        };

        
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCiC4DyvSUDfNLnkElteyrrU0PFMnFdB8A&callback=initMap`;
        script.async = true;
        script.defer = true;
        window.initMap = initMap; 
        document.head.appendChild(script);

        
        return () => {
            window.initMap = undefined;
            document.head.removeChild(script);
        };
    }, []);
    return <div id="map" style={{ height: '30vh', width: '100%' }}></div>;
};

export default MapComponent;