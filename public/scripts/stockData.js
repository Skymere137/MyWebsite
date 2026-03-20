const input = document.getElementById('ticker');

function fetchData(ticker) {
    fetch(`http://192.168.0.61:8000/get_data/${ticker}/1m`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error: ', error)
    });
}

input.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        ticker = input.value
        fetchData(ticker)
    }
})

