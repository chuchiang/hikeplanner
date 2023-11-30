import { useMap } from 'react-leaflet';

export const usePrintFirebase = () => {
    const map = useMap();

    const captureMap = async () => {
        const mapContainer = map.getContainer();
        const mapCanvas = mapContainer.querySelector('canvas');
        if (mapCanvas) {
            return new Promise((resolve, reject) => {
                mapCanvas.toBlob(blob => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to convert map to Blob.'));
                    }
                }, 'image/png');
            });
        } else {
            throw new Error('No canvas found in the map container.');
        }
    };

    return captureMap;
};
