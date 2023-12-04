//hover 線條
export const verticalLinePlugin = {
    id: 'verticalLinePlugin',
    afterDatasetsDraw: function (chart, args, options) {
        const { ctx, chartArea: { top, bottom }, scales: { x } } = chart;
        if (chart.tooltip && chart.tooltip._active && chart.tooltip._active.length) {
            const activePoint = chart.tooltip._active[0];
            const xCoord = activePoint.element.x;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(xCoord, top);
            ctx.lineTo(xCoord, bottom);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'; 
            ctx.stroke();
            ctx.restore();
        }
    }
};

