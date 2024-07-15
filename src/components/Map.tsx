"use client"
import {APIProvider, ControlPosition, Map} from '@vis.gl/react-google-maps';
import {CustomMapControl} from './map-control';
import MapHandler from './map-handler';
import { useState } from 'react';
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"


export default function MapInstance() {

  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  return (
    <div className='flex flex-1 flex-col'>
      
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
        <Map
          defaultCenter={{lat: 22.54992, lng: 0}}
          defaultZoom={3}
          mapTypeId= {'hybrid'}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          streetViewControl= {true}
          minZoom = {3}
          maxZoom = {23}
        />
        <CustomMapControl
            controlPosition={ControlPosition.TOP}
            onPlaceSelect={setSelectedPlace}
          />
        <MapHandler place={selectedPlace} />
      </APIProvider>
    </div>
  )
}
