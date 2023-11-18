const fetchDirection = async(plannerLocation, setDirectionData, setPath, setIsLoading) => {
    
    setIsLoading(true);
    const openRouteServiceApi = '5b3ce3597851110001cf62484e6df37ed2944841aeaa8f432926647b';

    if (plannerLocation.length >= 2) {
        const lastLocation = plannerLocation[plannerLocation.length - 1];//1
        const secondLastLocation = plannerLocation[plannerLocation.length - 2];//0
        const coordinatesOne = [secondLastLocation.lng, secondLastLocation.lat];
        const coordinatesTwo = [lastLocation.lng, lastLocation.lat];

        const url = 'https://api.openrouteservice.org/v2/directions/foot-hiking/geojson';
        const body = JSON.stringify({ "coordinates": [coordinatesOne, coordinatesTwo], "elevation": "true", "extra_info": ["steepness"] })
        try {

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                    'Content-Type': 'application/json',
                    'Authorization': openRouteServiceApi
                },
                body: body
            });

            const data = await response.json();

            const distance = data.features[0].properties.segments[0].distance;//距離
            const kilometers = (distance / 1000).toFixed(1);;
            const ascent = Math.round(data.features[0].properties.segments[0].ascent);//上升
            const descent = Math.round(data.features[0].properties.segments[0].descent);//下將
            const path = data.features[0].geometry.coordinates;
            const id = 1


            const ascentTimePerHour = 300; // 每上升 300 米增加 1 小時的行走時間

            // 計算總共需要的行走時間（以小時為單位）
            let totalTime = distance / 5000; // 每 5 公里（約3.1英里）增加 1 小時的基本行走時間
            totalTime += ascent / ascentTimePerHour; // 加上爬升需要的額外時間
            const hours = Math.floor(totalTime); // 獲得完整小時數
            const minutes = Math.round((totalTime - hours) * 60); // 將小數部分轉換為分鐘

            const duration = totalTime.toFixed(2);//期間


            // console.log('Total Walking Time:', totalTime.toFixed(2), 'hours');

            const newDirection = {
                id: id, kilometers: kilometers, duration: duration, ascent: ascent, descent: descent, hours: hours, minutes: minutes

            }



            console.log(newDirection);
            setIsLoading(false);
            return(path,newDirection)
            
            setDirectionData(directionData => [...directionData, newDirection]);
            setPath(prevPath => [...prevPath, ...path]); // 更新 path 数据


            // 将 newDirection 合并到 plannerLocation 数组的倒数第二个元素中
            // addNewDirection(newDirection);

            // setIsLoading(false);
            // return(path,newDirection)

        } catch (error) {
            console.error('Error:', error);
            setIsLoading(false);
        }

    }


}

