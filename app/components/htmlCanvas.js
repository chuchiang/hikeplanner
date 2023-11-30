import html2canvas from 'html2canvas';

const captureMap = () => {
    const mapElement = document.getElementById('map');
    console.log(mapElement);
    html2canvas(mapElement).then((canvas) => {
        // 這裡的 canvas 就是地圖的畫面
        // 您可以將其轉換為圖片或進行其他操作
        const image = canvas.toDataURL('image/png');
        // 顯示圖片或將其發送到服務器

        // 創建一個臨時的下載連結
        const link = document.createElement('a');
        link.href = image;
        link.download = 'map-capture.png'; // 下載的文件名

        // 觸發下載
        link.click();

    });
};

export default captureMap;