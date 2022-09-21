import { useState, useRef } from 'react';
import {useJsApiLoader, GoogleMap, Autocomplete, DirectionsRenderer} from '@react-google-maps/api';
import CarList from './CarList';
import '../style.scss';

const App = () => {

    const [originSelected,setOriginSelected] = useState(false);
    const [destinationSelected,setDestinationSelected] = useState(false);
    const [libraries] = useState(['places']);
    const [directionResponse, setDirectionResponse] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration,setDuration] = useState('');
    const [currentLocation,setCurrentLocation] = useState(null);
    const [deviceLocationError,setDeviceLocationError] = useState('');

    const originRef = useRef();
    const destinationRef = useRef();
    
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey:process.env.REACT_APP_GOOGLE_MAP_API_KEY,
        libraries
    })
    
    const getCurrentLocation = () => {
        if("geolocation" in navigator){
            window.navigator.geolocation.getCurrentPosition(
                position => setCurrentLocation(`${position.coords.latitude},${position.coords.longitude}`), 
                error => {
                    if(error.code === 1){
                        setDeviceLocationError('Our services require information about your geolocation. For the most accurate estimate, you may need to adjust location settings in your browser.');
                    }
                }
              );
        }
    }
    
    if(!isLoaded){
        return(
            <div className='loader-wrapper'>
                <ul className="loader">
                    <li className="loader__item"></li>
                    <li className="loader__item"></li>
                    <li className="loader__item"></li>
                </ul>
            </div>
        )
    }

    const renderOriginInput = () => {
        if(currentLocation){
            return (
                <div className='location-input-wrapper'>
                    <div className='autocomplete-wrapper origin'>
                        <input type="text" placeholder='origin' value="Your current location" readOnly />
                    </div>
                    <button className='clear-btn' onClick={() => clearInput('origin')}>
                        <svg aria-hidden="true" focusable="false" width="10px" height="10px" fill="currentColor" viewBox="0 0 12 12" tabIndex="0" role="button" aria-label="Delete pickup location" className="pe-location-clear bu rx ch ry rz s0">
                            <path d="M10.595 0L6 4.596 1.405 0 0 1.404 4.596 6 0 10.595 1.405 12 6 7.404 10.595 12 12 10.595 7.404 6 12 1.404z"></path>
                        </svg>
                    </button>
                </div>
            )
        }
        return (
            <div className='location-input-wrapper'>
                <Autocomplete className='autocomplete-wrapper origin' onPlaceChanged={() => onOriginChange()}>
                    <input type="text" placeholder='Pickup location' ref={originRef} />
                </Autocomplete>
                {originSelected && <button className='clear-btn' onClick={() => clearInput('origin')}>
                    <svg aria-hidden="true" focusable="false" width="10px" height="10px" fill="currentColor" viewBox="0 0 12 12" tabIndex="0" role="button" aria-label="Delete pickup location" className="pe-location-clear bu rx ch ry rz s0">
                        <path d="M10.595 0L6 4.596 1.405 0 0 1.404 4.596 6 0 10.595 1.405 12 6 7.404 10.595 12 12 10.595 7.404 6 12 1.404z"></path>
                    </svg>
                </button>}
                {(!currentLocation && !originSelected) && <button className='clear-btn' onClick={() => getCurrentLocation()}>
                    <svg aria-hidden="true" focusable="false" width="16px" height="16px" fill="currentColor" viewBox="0 0 24 24" tabIndex="0" role="button" aria-label="Locate me" className="pe-location-fetch bu rx ch ry rz s0">
                        <path d="M10.5 13.5L.5 11 21 3l-8 20.5-2.5-10z"></path>
                    </svg>
                </button>}
            </div>
        )
    }

    const renderDestinationInput = () => {
        return (
            <div className='location-input-wrapper'>
                <Autocomplete className='autocomplete-wrapper destination' onPlaceChanged={() => setDestinationSelected(true)}>
                    <input type="text" placeholder='Destination location' ref={destinationRef} />
                </Autocomplete>
                {destinationSelected && <button className='clear-btn' onClick={() => clearInput('destination')}>
                    <svg aria-hidden="true" focusable="false" width="10px" height="10px" fill="currentColor" viewBox="0 0 12 12" tabIndex="0" role="button" aria-label="Delete pickup location" className="pe-location-clear bu rx ch ry rz s0">
                        <path d="M10.595 0L6 4.596 1.405 0 0 1.404 4.596 6 0 10.595 1.405 12 6 7.404 10.595 12 12 10.595 7.404 6 12 1.404z"></path>
                    </svg>
                </button>}
            </div>
        )
    }

    const clearInput = (type) => {
        if(type === 'origin'){
            if(currentLocation){
                setCurrentLocation(null);
            }else{
                originRef.current.value='';    
            }
            setOriginSelected(false);
        }else{
            destinationRef.current.value='';
            setDestinationSelected(false);
        }
        // setDistance('');
        setDuration('');
    }

    const onOriginChange = () => {
        setOriginSelected(true);
        setDeviceLocationError('');
    }

    const calculateRoute = async () => {
        if(!currentLocation && (originRef.current.value === '' || destinationRef.current.value === '')){
            return
        }
        
        // eslint-disable-next-line
        const directionsService = new google.maps.DirectionsService();
        const results = await directionsService.route({
            origin: currentLocation ? currentLocation : originRef.current.value,
            destination:destinationRef.current.value,
            // eslint-disable-next-line
            travelMode:google.maps.TravelMode.DRIVING
        })
        setDirectionResponse(results);
        setDistance(results.routes[0].legs[0].distance.value);
        setDuration(results.routes[0].legs[0].duration.value);
    }

    const routeOptions = {
        polylineOptions:{'strokeColor': "#FF6A28"}
    };

    const mapOptions = {
        zoomControl:false,
        streetViewControl:false,
        mapTypeControl:false,
        fullscreenControl:false
    }
    
    return(
        <div className={`top-banner ${distance ? 'with-distance' : ''}`}>

            {distance && <button className='back-to-search' onClick={() => setDistance('')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-narrow-left" width="50" height="50" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <line x1="5" y1="12" x2="9" y2="16" />
                    <line x1="5" y1="12" x2="9" y2="8" />
                </svg>
            </button>}

            <div className={`form-container ${distance ? 'open' : ''}`}>
                <div className='form-wrapper'>
                    {distance && <button className='back-to-search desktop' onClick={() => setDistance('')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-narrow-left" width="50" height="50" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FF6A28" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <line x1="5" y1="12" x2="9" y2="16" />
                            <line x1="5" y1="12" x2="9" y2="8" />
                        </svg>
                    </button>}
                    <h2 className='slogan'>Ride with Rido</h2>
                    {renderOriginInput()}
                    {renderDestinationInput()}
                    <button className='submit-btn' onClick={() => calculateRoute()} disabled={(( !currentLocation && !originSelected) || !destinationSelected)}>Check Fare</button>
                    {(deviceLocationError) && <p className='error'>{deviceLocationError}</p>}
                </div>
                {(duration && distance) && <CarList duration={duration} distance={distance} />}
            </div>

            {!distance && <div className='content'>
                <h1 className='brand-name'>Rido</h1>
                <h3 className='brand-text'>The Best way to get<br/> wherever you're going</h3>
                <img src='././assets/images/car.png' alt="white car" />
            </div>}

            {(distance && isLoaded) && <div className='g-map-container'>
                <GoogleMap zoom={15} mapContainerClassName="map-wrapper" options={mapOptions}>
                    {(duration && directionResponse) && <DirectionsRenderer directions={directionResponse} options={routeOptions} />}
                </GoogleMap>
            </div>}
        </div>
    )
}

export default App;