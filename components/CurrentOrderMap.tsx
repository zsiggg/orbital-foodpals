import Head from 'next/head';
import { NUS_LNGLAT } from 'helpers/constants';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { MutableRefObject, useEffect, useRef } from 'react';
 
export const CurrentOrderMap = ({ location: deliveryLocation }: { location: LngLatLike }) => {
    const mapContainerRef: MutableRefObject<HTMLDivElement> = useRef(null)
    const mapRef: MutableRefObject<mapboxgl.Map> = useRef(null)
    const deliveryMarkerRef: MutableRefObject<mapboxgl.Marker> = useRef(null)
    mapboxgl.accessToken = 'pk.eyJ1IjoiZm9vZHBhbHMiLCJhIjoiY2w0cG9ocmk1MGIxaTNrbGhseHlrcm0zaSJ9.ksxGgo0gBr4UaudQhTKDww';  // default mapbox access token, not secret

    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: NUS_LNGLAT,
            zoom: 15
        });
        deliveryMarkerRef.current = new mapboxgl.Marker({ color: "#10b981" }).setLngLat(deliveryLocation).addTo(mapRef.current)
        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
        
        const geolocateControl: mapboxgl.GeolocateControl = new mapboxgl.GeolocateControl({
            positionOptions: { 
                enableHighAccuracy: true,
                timeout: 3000
            },
            showUserHeading: true,
            trackUserLocation: true
        })
        mapRef.current.addControl(geolocateControl)
        mapRef.current.on('load', () => {
            geolocateControl.trigger()
        })
        geolocateControl.on('error', () => {    // try to trigger() again after timeout
            console.log("geolocate timed out or failed, retrying...")
            geolocateControl.trigger()  // switch off location
            geolocateControl.trigger()  // try again
        })

        // always pan camera to user and delivery location
        geolocateControl.on('geolocate', (data: GeolocationPosition) => {
            mapRef.current.fitBounds(
                new mapboxgl.LngLatBounds(
                    deliveryMarkerRef.current.getLngLat(),
                    new mapboxgl.LngLat(data.coords.longitude, data.coords.latitude)),
                {
                    maxZoom: 20,
                    padding: 50
                }
            )
            console.log('geolocate event happened')
        })

        // make call to matrix api every 30 seconds (pass in access token)
        // do within the app file, if deliverer is active, then we should keep hitting the api 
        
    }, [])

    // provide directions for deliverer to location
        // center map to delivery location and user's location
        // matrix api -> update ETA every 30 seconds (use walking time)
        // use navigation api (directions api)
        // button to start navigation
            // how does the map look at this stage?
        // update location in db every 5 seconds
    
    // buyer
        // subscribe to deliverer location, plot on map
            // animate how the location moves?
        // matrix api -> update ETA every 30 seconds

    return (<>
        <Head>
            <link
            href="https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.css"
            rel="stylesheet"
            />
        </Head>
        <div id="map" ref={mapContainerRef} className="h-full"></div>
    </>)
}