// this is a "barrel file" that prevents the ClientMap from ever getting loaded in the server.

// components/mapContainer.js
import { useState,useEffect } from 'react';
import React from 'react';


export const Map = (props) => {
    const [Client, setClient] = useState();

    useEffect(() => {
        (async () => {
            if (typeof window !== "undefined") {
                const newClient = (await import('./mapa')).default
                setClient(() => newClient);
            }
        })();
    }, [])

    if (typeof window === "undefined" || !Client) {
        return null;
    }
    
    return Client ? <Client {...props}/> : null;

}