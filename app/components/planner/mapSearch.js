import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl } from "leaflet-geosearch";
import 'node_modules/leaflet-geosearch/dist/geosearch.css';



//map搜尋功能
const SearchControl = ({ provider, onResult, position = "topleft",...props }) => {
  const map = useMap();

  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider: provider,
      position,
      ...props
    });

    // 添加事件搜尋結果監聽
    const handleSearchResults = (result) => {
      if (onResult) {
        onResult(result);
      }
    };

    // 註冊事件
    map.on('geosearch/showlocation', handleSearchResults);

    map.addControl(searchControl);

    return () => {
      map.removeControl(searchControl);
      // 移除事件監聽
      map.off('geosearch/showlocation', handleSearchResults);
    };
  }, [provider, props, map, onResult]);

  return null;
};

export default SearchControl;