const chart = LightweightCharts.createChart(
    document.getElementById("chart"),
    {
        layout: {
            background: { color: "#111" },
            textColor: "#DDD"
        },
        grid: {
            vertLines: { color: "#222" },
            horzLines: { color: "#222" }
        },
        width: 1200,
        height: 600
    }
);

const candleSeries = chart.addCandlestickSeries();

const candleData = [
    { time: '2026-03-10', open: 10, high: 12, low: 9, close: 11 },
    { time: '2026-03-11', open: 11, high: 13, low: 10, close: 12 },
    { time: '2026-03-12', open: 12, high: 14, low: 11, close: 13 },
    { time: '2026-03-13', open: 13, high: 15, low: 12, close: 14 },
    { time: '2026-03-14', open: 14, high: 16, low: 13, close: 15 }
];

candleSeries.setData(candleData);