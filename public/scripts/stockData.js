let baseUrl;

// Fetch config once on page load
fetch('/api/config')
  .then(r => r.json())
  .then(config => {
    baseUrl = config.baseUrl;
  })
  .catch(err => console.error('Failed to load config:', err));
const tickerInput = document.getElementById('ticker');
const timeframeInput = document.getElementById('tf');
const limitInput = document.getElementById('limit')
const chartContainer = document.getElementById('chart');

if (!chartContainer) {
    throw new Error("Chart container not found!");
}

// Default values
let limit = 1000
let ticker = '';
let timeframe = '';
let candleData = [];
let warningLabel = 'No ticker'

function adjustPage() {
    document.getElementById('current-ticker').innerText = `Current Ticker: ${ticker}`;
    document.getElementById('current-tf').innerText = `Current TF: ${timeframe}`
    document.getElementById('warning-label-header').innerText = warningLabel
    // ticker = ''
    // timeframe = 'Select Timeframe'
    tickerInput.value = ticker
    timeframeInput.value = timeframe
    limitInput.value = limit
}

adjustPage()
function calculateSma(data, period) {
    const smaData = [];
    for (let i = period - 1; i < data.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += data[i - j].close;
        }
        const smaValue = sum / period;
        smaData.push({
            time: data[i].time,
            value: smaValue
        })
    }
    return smaData;
}
// ------------------------------
// Create Lightweight Chart
// ------------------------------
const chart = LightweightCharts.createChart(chartContainer, {
    width: 1500,
    height: 700,
    layout: {
        background: { color: "#111" },
        textColor: "#DDD"
    },
    grid: {
        vertLines: { color: "#222" },
        horzLines: { color: "#222" }
    }
});

chart.timeScale().applyOptions({
    rightOffset: 10,
    barSpacing: 10,
    minBarSpacing: 2,
    timeVisible: true,
    secondsVisible: false,
});

const candleSeries = chart.addCandlestickSeries();

const sma10Series = chart.addLineSeries({
    color: '#FF6B6B',
    lineWidth: 2,
    title: 'SMA 10'
});

const sma50Series = chart.addLineSeries({
    color: '#4ECDC4',
    lineWidth: 2,
    title: 'SMA 50'
});


// ------------------------------
// Fetch and format data
// ------------------------------
async function fetchData(ticker, timeframe, limit) {
    try {
        const response = await fetch(`${baseUrl}/get_data/${ticker}/${timeframe}?limit=${limit}`);
        const data = await response.json();
        console.log("Raw data sample:", data.slice(0, 3));
        console.log("Raw timestamps:", data.slice(0, 3).map(c => ({
            timestamp: c.timestamp,
            typeof: typeof c.timestamp,
            keys: Object.keys(c)
        })));
        if (!data) {
        throw new Error("Server returned null data");
    }
        const formatted = data.map((c, index) => {
            const timeValue = c.timestamp;
            const mapped = {
                time: timeValue,
                open: Number(c.open),
                close: Number(c.close),
                high: Number(c.high),
                low: Number(c.low)
            };
            
            // Debug first few items
            if (index < 3) {
                console.log(`Item ${index}:`, {
                    original_timestamp: c.timestamp,
                    mapped_time: mapped.time,
                    is_time_nan: isNaN(mapped.time)
                });
            }
            
            return mapped;
        });
        console.log("Formatted sample:", formatted.slice(0, 3));
        // Filter out invalid entries
        const filtered = formatted.filter(c => {
            const isValid = c && 
                !isNaN(c.time) && 
                !isNaN(c.open) && 
                !isNaN(c.close) && 
                !isNaN(c.high) && 
                !isNaN(c.low);
            
            if (!isValid) {
                // console.log("Invalid candle filtered out:", c);
            }
            return isValid;
        });
        // console.log("filtered sample:", filtered.slice(0, 3));
        // Sort by time ascending
        filtered.sort((a, b) => a.time - b.time);

        // Remove duplicate timestamps
        const unique = filtered.filter((c, i, arr) => i === 0 || c.time !== arr[i - 1].time);
        // console.log(unique)
        // console.log("Candles to display:", unique.length);
        return unique;
    } catch (err) {
        warningLabel = 'No data could be found!'
        adjustPage(warningLabel)
        console.error("Failed to fetch data:", err);
        return [];
    }
}

// ------------------------------
// Event listener for ticker input
// ------------------------------
const applyParams = document.getElementById("applyChart");

applyParams.addEventListener("click", async () => {
    warningLabel = ''
    const newTicker = tickerInput.value.trim();
    ticker = newTicker
    if (ticker === '') {
        document.getElementById('warning-label-header').innerText = 'Please enter a valid ticker symbol'
        return
    }
    const newTimeframe = timeframeInput.value.trim();
    timeframe = newTimeframe
    if (timeframe === 'Select Timeframe') {
        document.getElementById('warning-label-header').innerText = 'Please enter a valid timeframe'
        return
    }
    let newLimit = parseInt(limitInput.value.trim())
    if (Number.isNaN(newLimit)) {

        warningLabel.textContent =
            'Please input a valid number for limiter: Default is 1000';

        limit = 1000;

    } else {

        limit = newLimit;
    }

    if (limit >= 5000) {
        warningLabel = 'WARNING: large limit may result in slower load times'
        document.getElementById('warning-label-header').innerText = warningLabel;
    }

    console.log(typeof limit)
    if (!newTicker) return;
    if (!newTimeframe) return;
    if (timeframe === 'Select Timeframe') {
        warningLabel = 'Please select a valid timeframe!'
        return
    }
    
    console.log(limit)
    try {
        const candles = await fetchData(newTicker, timeframe, limit);

        if (!candles.length) {
            console.warn("No valid candles to display!");
            return;
        }

        // Limit the number of candles to improve performance (optional)
        candleSeries.setData(candles);
        
        const sma10Data = calculateSma(candles, 10);
        const sma50Data = calculateSma(candles, 50);

        sma10Series.setData(sma10Data);
        sma50Series.setData(sma50Data);

        chart.timeScale().fitContent();
        
        adjustPage()
    } catch (err) {

        console.log("Failed to update chart:", err);
    }
});