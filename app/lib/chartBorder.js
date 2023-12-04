// chart外框
export const customBorderPlugin = {
    id: 'customBorderPlugin',
    afterDraw: function (chart, args, options) {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        ctx.save();
        ctx.strokeStyle = 'gray'; 
        ctx.lineWidth = 1; 
        // 畫矩形邊框
        ctx.strokeRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
        ctx.restore();
    }
};