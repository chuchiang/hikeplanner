
const fetchLocaiton = async (getsearchLocation) => {
    // console.log(getsearchLocation)

    if (!getsearchLocation) {
        return null;
    }
    const openRouteServiceApi = '5b3ce3597851110001cf62484e6df37ed2944841aeaa8f432926647b';
    const lat = getsearchLocation.lat;
    const lon = getsearchLocation.lng;

    const url = `https://api.openrouteservice.org/geocode/reverse?api_key=${openRouteServiceApi}&point.lon=${lon}&point.lat=${lat}`;
    try {

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
            },

        });

        const data = await response.json();
        const name = data.features[0].properties.name
        const region = data.features[0].properties.region
        return { name, region };

    } catch (error) {
        console.error('Error:', error);
        return null;
    }

};



export default fetchLocaiton;